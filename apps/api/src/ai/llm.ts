import Anthropic from '@anthropic-ai/sdk';
import { env, llmProvider, llmModel } from '../config/env.js';
import { logger } from '../config/logger.js';
import { AppError } from '../utils/AppError.js';

export interface LlmMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LlmRequest {
  system: string;
  messages: LlmMessage[];
  maxTokens?: number;
  timeoutMs?: number;
}

export interface LlmClient {
  readonly name: string;
  generate(req: LlmRequest): Promise<string>;
}

const DEFAULT_TIMEOUT_MS = 30_000;

/* -------------------------------------------------------------------------- */
/*  Google Gemini (Generative Language REST API)                               */
/* -------------------------------------------------------------------------- */

// Current Gemini flash models are "thinking" models: reasoning tokens are drawn
// from the same maxOutputTokens budget as the visible answer, and thinking
// cannot be fully disabled. Cap it, and add matching headroom so a long answer
// isn't truncated by the reasoning it did first.
const GEMINI_THINKING_BUDGET = 2048;

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
}

class GeminiClient implements LlmClient {
  readonly name = 'gemini';
  private readonly apiKey = env.GEMINI_API_KEY;
  private readonly model = llmModel;

  async generate(req: LlmRequest): Promise<string> {
    // Gemini uses "user" / "model" and requires the turn list to start with a
    // user message and alternate. Our history always starts with a user turn,
    // but guard anyway.
    const contents = req.messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    while (contents.length > 1 && contents[0]!.role === 'model') contents.shift();

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      this.model,
    )}:generateContent`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), req.timeoutMs ?? DEFAULT_TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': this.apiKey },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: req.system }] },
          contents,
          generationConfig: {
            maxOutputTokens: (req.maxTokens ?? env.LLM_MAX_TOKENS) + GEMINI_THINKING_BUDGET,
            temperature: 0.2,
            thinkingConfig: { thinkingBudget: GEMINI_THINKING_BUDGET },
          },
        }),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        logger.error(
          { status: res.status, body: body.slice(0, 400) },
          'Gemini API error',
        );
        if (res.status === 429) {
          throw new AppError(
            'AI_UNAVAILABLE',
            'The assistant is busy right now (rate limit). Please try again shortly.',
          );
        }
        if (res.status === 400 && /API key|API_KEY_INVALID/i.test(body)) {
          throw new AppError('AI_UNAVAILABLE', 'The assistant is misconfigured (invalid API key).');
        }
        if (res.status === 404) {
          // e.g. the configured model was retired. Surface it clearly in logs.
          throw new AppError(
            'AI_UNAVAILABLE',
            `The assistant model "${this.model}" is not available. Set LLM_MODEL to a current Gemini model.`,
          );
        }
        throw new AppError('AI_UNAVAILABLE', 'The assistant is temporarily unavailable.');
      }

      const data = (await res.json()) as GeminiResponse;
      const candidate = data.candidates?.[0];
      const blocked =
        data.promptFeedback?.blockReason ||
        (candidate?.finishReason && ['SAFETY', 'RECITATION', 'BLOCKLIST'].includes(candidate.finishReason));
      if (blocked) {
        logger.warn({ reason: data.promptFeedback?.blockReason ?? candidate?.finishReason }, 'Gemini blocked the response');
        throw new AppError(
          'AI_UNAVAILABLE',
          'The assistant could not produce a response for this question. Please rephrase, or contact the official channel.',
        );
      }

      const text = (candidate?.content?.parts ?? [])
        .map((p) => p.text ?? '')
        .join('')
        .trim();

      if (!text) {
        if (candidate?.finishReason === 'MAX_TOKENS') {
          logger.warn('Gemini hit MAX_TOKENS before emitting an answer (thinking budget too high?)');
          throw new AppError(
            'AI_UNAVAILABLE',
            'The assistant ran out of space before answering. Please try a shorter question.',
          );
        }
        throw new AppError('AI_UNAVAILABLE', 'The assistant returned an empty response.');
      }
      return text;
    } catch (err) {
      if (err instanceof AppError) throw err;
      if ((err as Error)?.name === 'AbortError') {
        throw new AppError('AI_TIMEOUT', 'The assistant took too long to respond. Please try again.');
      }
      logger.error({ err }, 'LLM generate failed (gemini)');
      throw new AppError('AI_UNAVAILABLE', 'The assistant is temporarily unavailable.');
    } finally {
      clearTimeout(timer);
    }
  }
}

/* -------------------------------------------------------------------------- */
/*  Anthropic (Claude)                                                         */
/* -------------------------------------------------------------------------- */

class AnthropicClient implements LlmClient {
  readonly name = 'anthropic';
  private client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

  async generate(req: LlmRequest): Promise<string> {
    try {
      const res = await this.client.messages.create(
        {
          model: llmModel,
          max_tokens: req.maxTokens ?? env.LLM_MAX_TOKENS,
          system: req.system,
          messages: req.messages.map((m) => ({ role: m.role, content: m.content })),
        },
        { timeout: req.timeoutMs ?? DEFAULT_TIMEOUT_MS },
      );

      const text = res.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('')
        .trim();

      if (!text) throw new AppError('AI_UNAVAILABLE', 'The assistant returned an empty response.');
      return text;
    } catch (err) {
      if (err instanceof AppError) throw err;
      if (err instanceof Anthropic.APIError) {
        logger.error({ status: err.status, message: err.message }, 'Anthropic API error');
        if (err.status === 429) {
          throw new AppError('AI_UNAVAILABLE', 'The assistant is busy right now. Please try again shortly.');
        }
        if (err.status === 408 || err.name === 'APIConnectionTimeoutError') {
          throw new AppError('AI_TIMEOUT', 'The assistant took too long to respond. Please try again.');
        }
        throw new AppError('AI_UNAVAILABLE', 'The assistant is temporarily unavailable.');
      }
      logger.error({ err }, 'LLM generate failed');
      throw new AppError('AI_UNAVAILABLE', 'The assistant is temporarily unavailable.');
    }
  }
}

/* -------------------------------------------------------------------------- */
/*  Mock (no API key)                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Deterministic offline stand-in. It does NOT invent facts: it surfaces the
 * retrieved source text verbatim and tells the user this is a limited response.
 * Lets the whole pipeline (retrieval, grounding, UI) run with no API key.
 */
class MockLlmClient implements LlmClient {
  readonly name = 'mock';

  async generate(req: LlmRequest): Promise<string> {
    const lastUser = [...req.messages].reverse().find((m) => m.role === 'user')?.content ?? '';
    const sourceBlock = lastUser.split('SOURCES:')[1]?.trim();

    if (!sourceBlock || /NONE FOUND/i.test(sourceBlock)) {
      return (
        "I don't have verified information on this yet. Please contact your local " +
        'cooperative office or the relevant department for official guidance.'
      );
    }

    // Grab the first numbered source, skipping the "OFFICIAL SOURCES" /
    // "WEB SOURCES" section headers. Cite it so the pipeline attributes it.
    const blocks = sourceBlock
      .split(/\n(?=\[\d+])/)
      .map((b) => b.trim())
      .filter((b) => /^\[\d+]/.test(b));
    const first = blocks[0] ?? '';
    const num = first.match(/^\[(\d+)]/)?.[1] ?? '1';
    const isWeb = /WEB SOURCES/i.test(sourceBlock.split(`[${num}]`)[0] ?? '');
    const snippet = first
      .replace(/^\[\d+][^\n]*\n?/, '')
      .trim()
      .slice(0, 600);

    const lead = isWeb
      ? 'Based on general background from public sources'
      : 'Based on the available official material';

    return (
      `${lead} [${num}]:\n\n${snippet}\n\n` +
      '_(This is a limited offline response. Connect an AI provider for a fuller, ' +
      'plain-language answer in your language. Always confirm details with the official source.)_'
    );
  }
}

/* -------------------------------------------------------------------------- */

let instance: LlmClient | null = null;

export function getLlm(): LlmClient {
  if (!instance) {
    instance =
      llmProvider === 'gemini'
        ? new GeminiClient()
        : llmProvider === 'anthropic'
          ? new AnthropicClient()
          : new MockLlmClient();
    logger.info(
      { provider: instance.name, model: llmProvider === 'mock' ? 'n/a' : llmModel },
      'LLM client ready',
    );
  }
  return instance;
}

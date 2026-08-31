import Anthropic from '@anthropic-ai/sdk';
import { env, hasLlm } from '../config/env.js';
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
          model: env.LLM_MODEL,
          max_tokens: req.maxTokens ?? env.LLM_MAX_TOKENS,
          system: req.system,
          messages: req.messages.map((m) => ({ role: m.role, content: m.content })),
        },
        { timeout: req.timeoutMs ?? 30_000 },
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
    instance = hasLlm ? new AnthropicClient() : new MockLlmClient();
    logger.info({ provider: instance.name, model: hasLlm ? env.LLM_MODEL : 'n/a' }, 'LLM client ready');
  }
  return instance;
}

import type {
  AnswerConfidence,
  ChatResponse,
  KnowledgeCategory,
  LanguageCode,
  SourceRef,
} from '@sahakar/shared';
import { prisma } from '../config/prisma.js';
import { logger } from '../config/logger.js';
import { AppError } from '../utils/AppError.js';
import { detectLanguage } from '../ai/language.js';
import { getLlm } from '../ai/llm.js';
import { buildSystemPrompt, buildUserPrompt, disclaimersFor } from '../ai/prompt.js';
import { retrieve, type RetrievedChunk } from './retrieval.service.js';

interface AskInput {
  message: string;
  conversationId?: string;
  language?: LanguageCode;
  category?: KnowledgeCategory;
  userId?: string;
}

const HISTORY_TURNS = 6; // prior messages sent back to the model

export async function ask(input: AskInput): Promise<ChatResponse> {
  const language: LanguageCode = input.language ?? detectLanguage(input.message);

  const conversation = await resolveConversation(input.conversationId, input.userId, language);

  // Persist the user's message first so history is consistent even if generation fails.
  const userMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: 'user',
      content: input.message,
      language,
    },
  });

  const chunks = await retrieve({ query: input.message, category: input.category });
  const priorTurns = await recentTurns(conversation.id, userMessage.id);

  const llm = getLlm();
  const answer = await llm.generate({
    system: buildSystemPrompt(language),
    messages: [
      ...priorTurns,
      { role: 'user', content: buildUserPrompt(input.message, chunks) },
    ],
  });

  const citedNumbers = parseCitations(answer);
  const usedChunks =
    citedNumbers.length > 0
      ? citedNumbers.map((n) => chunks[n - 1]).filter((c): c is RetrievedChunk => Boolean(c))
      : // No explicit citations (e.g. offline mock): keep only chunks close to
        // the top score so we don't attribute the answer to weak matches.
        chunks.filter((c) => chunks[0] && c.score >= chunks[0].score - 0.04).slice(0, 3);

  const sources = dedupeSources(usedChunks);
  const confidence = scoreConfidence(chunks, usedChunks);
  const categories = [...new Set(usedChunks.map((c) => c.category))];
  const disclaimers = disclaimersFor(categories, language, chunks.length > 0);

  const assistantMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: 'assistant',
      content: answer,
      language,
      confidence,
      sources: sources as unknown as object,
      disclaimers: disclaimers as unknown as object,
    },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: {
      updatedAt: new Date(),
      title: conversation.title ?? input.message.slice(0, 80),
    },
  });

  logger.info(
    { conversationId: conversation.id, language, chunks: chunks.length, confidence, provider: llm.name },
    'chat answered',
  );

  return {
    conversationId: conversation.id,
    reply: {
      id: assistantMessage.id,
      role: 'assistant',
      content: answer,
      language,
      createdAt: assistantMessage.createdAt.toISOString(),
      confidence,
      sources,
      disclaimers,
    },
  };
}

export async function getHistory(conversationId: string, userId?: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });
  if (!conversation) throw AppError.notFound('Conversation not found.');
  // A conversation owned by a user is private to that user; anonymous
  // conversations are protected only by the unguessable id.
  if (conversation.userId && conversation.userId !== userId) throw AppError.forbidden();

  return {
    conversationId: conversation.id,
    language: conversation.language as LanguageCode,
    messages: conversation.messages.map((m) => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      content: m.content,
      language: m.language as LanguageCode,
      createdAt: m.createdAt.toISOString(),
      confidence: (m.confidence as AnswerConfidence | null) ?? undefined,
      sources: (m.sources as unknown as SourceRef[] | null) ?? undefined,
      disclaimers: (m.disclaimers as unknown as string[] | null) ?? undefined,
    })),
  };
}

export async function listConversations(userId: string) {
  const conversations = await prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: 50,
    select: { id: true, title: true, language: true, updatedAt: true },
  });
  return conversations.map((c) => ({
    id: c.id,
    title: c.title,
    language: c.language as LanguageCode,
    updatedAt: c.updatedAt.toISOString(),
  }));
}

/* -------------------------------------------------------------------------- */
/*  helpers                                                                    */
/* -------------------------------------------------------------------------- */

async function resolveConversation(
  conversationId: string | undefined,
  userId: string | undefined,
  language: LanguageCode,
) {
  if (conversationId) {
    const existing = await prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!existing) throw AppError.notFound('Conversation not found.');
    if (existing.userId && existing.userId !== userId) throw AppError.forbidden();
    return existing;
  }
  return prisma.conversation.create({
    data: { userId: userId ?? null, language },
  });
}

async function recentTurns(conversationId: string, exceptMessageId: string) {
  const rows = await prisma.message.findMany({
    where: { conversationId, id: { not: exceptMessageId } },
    orderBy: { createdAt: 'desc' },
    take: HISTORY_TURNS,
    select: { role: true, content: true },
  });
  return rows
    .reverse()
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));
}

/** Pull [1], [2,3] style citation markers out of the answer text. */
export function parseCitations(text: string): number[] {
  const found = new Set<number>();
  for (const match of text.matchAll(/\[(\d+(?:\s*,\s*\d+)*)\]/g)) {
    for (const n of match[1]!.split(',')) {
      const num = Number(n.trim());
      if (num > 0) found.add(num);
    }
  }
  return [...found].sort((a, b) => a - b);
}

function dedupeSources(chunks: RetrievedChunk[]): SourceRef[] {
  const seen = new Set<string>();
  const out: SourceRef[] = [];
  for (const c of chunks) {
    if (seen.has(c.documentId)) continue;
    seen.add(c.documentId);
    out.push({
      id: c.documentId,
      title: c.title,
      authority: c.authority,
      sourceUrl: c.sourceUrl,
      category: c.category,
      verifiedAt: c.verifiedAt,
      snippet: c.content.length > 240 ? c.content.slice(0, 237) + '…' : c.content,
    });
  }
  return out;
}

export function scoreConfidence(
  allChunks: RetrievedChunk[],
  usedChunks: RetrievedChunk[],
): AnswerConfidence {
  if (allChunks.length === 0) return 'NO_SOURCE';
  const top = allChunks[0]!.score;
  if (top >= 0.85 && usedChunks.length >= 1) return 'HIGH';
  if (top >= 0.78) return 'MEDIUM';
  return 'LOW';
}

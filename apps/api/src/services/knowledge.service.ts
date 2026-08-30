import { nanoid } from 'nanoid';
import type { KnowledgeCategory, LanguageCode } from '@sahakar/shared';
import { prisma } from '../config/prisma.js';
import { logger } from '../config/logger.js';
import { embedPassages } from '../ai/embeddings.js';

export interface IngestInput {
  title: string;
  category: KnowledgeCategory;
  authority: string;
  sourceUrl?: string | null;
  language?: LanguageCode;
  text: string;
  /** Mark verified + published so retrieval can use it immediately. */
  verified?: boolean;
  verifiedAt?: Date;
  uploadedById?: string | null;
  /** Update this exact document (allows a title change); else match on title+authority. */
  existingId?: string;
}

const TARGET_CHARS = 1100; // ~250-300 tokens per chunk
const MAX_CHARS = 1600;

/**
 * Split text into retrieval-sized chunks along paragraph boundaries, keeping
 * whole paragraphs together where possible and hard-splitting only very long ones.
 */
export function chunkText(text: string): string[] {
  const paragraphs = text
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = '';

  const flush = () => {
    if (current.trim()) chunks.push(current.trim());
    current = '';
  };

  for (const para of paragraphs) {
    if (para.length > MAX_CHARS) {
      flush();
      for (const sentence of para.split(/(?<=[.?!।])\s+/)) {
        if ((current + ' ' + sentence).length > TARGET_CHARS) flush();
        current += (current ? ' ' : '') + sentence;
      }
      flush();
      continue;
    }
    if (current && (current + '\n\n' + para).length > TARGET_CHARS) flush();
    current += (current ? '\n\n' : '') + para;
  }
  flush();

  return chunks;
}

/**
 * Create (or replace) a knowledge document and its embedded chunks.
 * Re-ingesting a document with the same title + authority bumps its version
 * and replaces the chunks.
 */
export async function ingestDocument(input: IngestInput): Promise<{ documentId: string; chunks: number }> {
  const language = input.language ?? 'en';
  const chunks = chunkText(input.text);
  if (chunks.length === 0) throw new Error(`Document "${input.title}" produced no chunks`);

  const embeddings = await embedPassages(chunks);

  const existing = input.existingId
    ? await prisma.knowledgeDocument.findUnique({
        where: { id: input.existingId },
        select: { id: true, version: true },
      })
    : await prisma.knowledgeDocument.findFirst({
        where: { title: input.title, authority: input.authority },
        select: { id: true, version: true },
      });

  const documentId = await prisma.$transaction(async (tx) => {
    const doc = existing
      ? await tx.knowledgeDocument.update({
          where: { id: existing.id },
          data: {
            title: input.title,
            authority: input.authority,
            category: input.category,
            sourceUrl: input.sourceUrl ?? null,
            language,
            version: existing.version + 1,
            isVerified: input.verified ?? false,
            verifiedAt: input.verified ? (input.verifiedAt ?? new Date()) : null,
            isPublished: input.verified ?? false,
          },
        })
      : await tx.knowledgeDocument.create({
          data: {
            title: input.title,
            category: input.category,
            authority: input.authority,
            sourceUrl: input.sourceUrl ?? null,
            language,
            isVerified: input.verified ?? false,
            verifiedAt: input.verified ? (input.verifiedAt ?? new Date()) : null,
            isPublished: input.verified ?? false,
            uploadedById: input.uploadedById ?? null,
          },
        });

    await tx.documentChunk.deleteMany({ where: { documentId: doc.id } });

    for (let i = 0; i < chunks.length; i++) {
      const content = chunks[i]!;
      const vec = `[${embeddings[i]!.join(',')}]`;
      // Raw insert bypasses the model's @default(cuid()), so supply an id.
      await tx.$executeRaw`
        INSERT INTO "DocumentChunk" ("id", "documentId", "chunkIndex", "content", "tokenCount", "embedding")
        VALUES (${nanoid(24)}, ${doc.id}, ${i}, ${content}, ${Math.round(content.length / 4)}, ${vec}::vector)
      `;
    }

    return doc.id;
  });

  logger.info({ documentId, title: input.title, chunks: chunks.length }, 'ingested knowledge document');
  return { documentId, chunks: chunks.length };
}

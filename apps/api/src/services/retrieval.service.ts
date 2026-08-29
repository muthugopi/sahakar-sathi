import { Prisma } from '@prisma/client';
import type { KnowledgeCategory, LanguageCode } from '@sahakar/shared';
import { prisma } from '../config/prisma.js';
import { logger } from '../config/logger.js';
import { embedQuery } from '../ai/embeddings.js';

export interface RetrievedChunk {
  chunkId: string;
  documentId: string;
  title: string;
  authority: string;
  category: KnowledgeCategory;
  sourceUrl: string | null;
  verifiedAt: string | null;
  content: string;
  /** Cosine similarity in [0, 1]; higher is closer. */
  score: number;
}

interface RetrieveOptions {
  query: string;
  category?: KnowledgeCategory;
  k?: number;
  /** Discard chunks below this similarity. */
  minScore?: number;
}

const DEFAULT_K = 5;
// e5-small cosine similarity: genuine topical matches land ~0.82+, loosely
// related text ~0.75. Set high — a false source is worse than NO_SOURCE here.
const DEFAULT_MIN_SCORE = 0.8;

/**
 * Semantic search over verified, published knowledge chunks using pgvector.
 * Raw SQL because Prisma has no first-class vector operator; parameters are
 * bound, not interpolated.
 */
export async function retrieve(opts: RetrieveOptions): Promise<RetrievedChunk[]> {
  const k = opts.k ?? DEFAULT_K;
  const minScore = opts.minScore ?? DEFAULT_MIN_SCORE;

  const queryVec = await embedQuery(opts.query);
  const vecLiteral = `[${queryVec.join(',')}]`;

  const categoryFilter = opts.category
    ? Prisma.sql`AND d."category" = ${opts.category}::"KnowledgeCategory"`
    : Prisma.empty;

  const rows = await prisma.$queryRaw<
    {
      chunkId: string;
      documentId: string;
      title: string;
      authority: string;
      category: KnowledgeCategory;
      sourceUrl: string | null;
      verifiedAt: Date | null;
      content: string;
      distance: number;
    }[]
  >(Prisma.sql`
    SELECT
      c."id"          AS "chunkId",
      d."id"          AS "documentId",
      d."title"       AS "title",
      d."authority"   AS "authority",
      d."category"    AS "category",
      d."sourceUrl"   AS "sourceUrl",
      d."verifiedAt"  AS "verifiedAt",
      c."content"     AS "content",
      c."embedding" <=> ${vecLiteral}::vector AS "distance"
    FROM "DocumentChunk" c
    JOIN "KnowledgeDocument" d ON d."id" = c."documentId"
    WHERE d."isPublished" = true
      AND d."isVerified" = true
      AND c."embedding" IS NOT NULL
      ${categoryFilter}
    ORDER BY c."embedding" <=> ${vecLiteral}::vector
    LIMIT ${k}
  `);

  const results = rows
    .map((r) => ({
      chunkId: r.chunkId,
      documentId: r.documentId,
      title: r.title,
      authority: r.authority,
      category: r.category,
      sourceUrl: r.sourceUrl,
      verifiedAt: r.verifiedAt ? r.verifiedAt.toISOString() : null,
      content: r.content,
      score: 1 - Number(r.distance),
    }))
    .filter((r) => r.score >= minScore);

  logger.debug(
    { query: opts.query.slice(0, 80), returned: results.length, top: results[0]?.score },
    'retrieval',
  );
  return results;
}

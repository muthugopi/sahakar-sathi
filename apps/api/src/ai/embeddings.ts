import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

/**
 * Text embeddings for retrieval.
 *
 * Default provider is a local multilingual model (`multilingual-e5-small`,
 * 384 dimensions). It runs on-device with no API key; the model (~120 MB)
 * downloads once on first use and is then cached, so ingestion and retrieval
 * keep working offline.
 *
 * The pgvector column is declared vector(512) — Voyage's voyage-3-lite (the
 * hosted option below) only supports 512-dim output, not Matryoshka-capable,
 * so it can't be trimmed to 384. That means the local provider is NOT
 * dimension-compatible with a database that has been ingested via Voyage (and
 * vice versa) — switching providers on an existing DB needs a re-ingest, and
 * switching back to `local` needs the column reverted to vector(384).
 *
 * e5 models expect an instruction prefix: "query: " for search queries and
 * "passage: " for indexed documents. Getting this wrong quietly hurts recall.
 */

export const EMBEDDING_DIM = 512;
const MODEL_ID = 'Xenova/multilingual-e5-small';

type FeatureExtractor = (
  input: string | string[],
  opts: { pooling: 'mean'; normalize: boolean },
) => Promise<{ tolist: () => number[][] }>;

let extractorPromise: Promise<FeatureExtractor> | null = null;

async function getExtractor(): Promise<FeatureExtractor> {
  if (!extractorPromise) {
    extractorPromise = (async () => {
      logger.info({ model: MODEL_ID }, 'loading embedding model (first run downloads ~120MB)');
      const { pipeline, env: hfEnv } = await import('@huggingface/transformers');
      // Keep model cache inside the repo-ignored .cache dir.
      hfEnv.cacheDir = '.cache/transformers';
      const pipe = await pipeline('feature-extraction', MODEL_ID);
      logger.info('embedding model ready');
      return pipe as unknown as FeatureExtractor;
    })().catch((err) => {
      extractorPromise = null; // allow a later retry
      throw err;
    });
  }
  return extractorPromise;
}

async function embed(texts: string[]): Promise<number[][]> {
  if (env.EMBEDDINGS_PROVIDER === 'voyage') {
    return embedWithVoyage(texts);
  }
  const extractor = await getExtractor();
  const output = await extractor(texts, { pooling: 'mean', normalize: true });
  return output.tolist();
}

/** Embed a search query. */
export async function embedQuery(text: string): Promise<number[]> {
  const [vec] = await embed([`query: ${text}`]);
  return vec!;
}

/** Embed one or more document chunks for indexing. */
export async function embedPassages(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  return embed(texts.map((t) => `passage: ${t}`));
}

/** Pre-load the model so the first user request isn't slow. Safe to call and ignore. */
export async function warmupEmbeddings(): Promise<void> {
  try {
    await embedQuery('warmup');
  } catch (err) {
    logger.warn({ err }, 'embedding warmup failed — will retry on first use');
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Voyage accounts with no payment method on file are capped at 3 requests per
// rolling 60s window (still free — 200M tokens included either way, per their
// docs). Pace calls to that limit proactively so bulk ingestion doesn't burn
// through 429s and retry budget; this under-uses a higher paid-tier limit,
// which is a fine trade for "never fails on the free tier" over "fastest
// possible once upgraded". Raise FREE_TIER_RPM (or remove the wait) once a
// payment method is added and the account's real limit is confirmed higher.
const FREE_TIER_RPM = 3;
const requestTimestamps: number[] = [];

async function waitForRateLimitSlot(): Promise<void> {
  const windowMs = 60_000;
  const now = Date.now();
  while (requestTimestamps.length && now - requestTimestamps[0]! > windowMs) requestTimestamps.shift();
  if (requestTimestamps.length >= FREE_TIER_RPM) {
    const wait = windowMs - (now - requestTimestamps[0]!) + 250; // small safety margin
    logger.debug({ wait }, 'pacing Voyage embeddings to stay under the free-tier rate limit');
    await sleep(wait);
    return waitForRateLimitSlot();
  }
  requestTimestamps.push(now);
}

async function embedWithVoyage(texts: string[], attempt = 0): Promise<number[][]> {
  if (!env.VOYAGE_API_KEY) throw new Error('EMBEDDINGS_PROVIDER=voyage but VOYAGE_API_KEY is unset');
  await waitForRateLimitSlot();
  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${env.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({ input: texts, model: 'voyage-3-lite', output_dimension: EMBEDDING_DIM }),
  });
  if (res.status === 429 && attempt < 8) {
    // Belt-and-braces: the proactive pacing above should prevent this, but
    // retry with backoff in case the server's window doesn't align with ours.
    const retryAfter = Number(res.headers.get('retry-after'));
    const delay = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 20_000;
    logger.warn({ attempt, delayMs: delay }, 'Voyage embeddings rate-limited — retrying');
    await sleep(delay);
    return embedWithVoyage(texts, attempt + 1);
  }
  if (!res.ok) throw new Error(`Voyage embeddings failed: ${res.status}`);
  const json = (await res.json()) as { data: { embedding: number[] }[] };
  return json.data.map((d) => d.embedding);
}

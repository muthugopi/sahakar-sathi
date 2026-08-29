import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

/**
 * Text embeddings for retrieval.
 *
 * Default provider is a local multilingual model (`multilingual-e5-small`,
 * 384 dimensions — matches the pgvector column). It runs on-device with no API
 * key; the model (~120 MB) downloads once on first use and is then cached, so
 * ingestion and retrieval keep working offline.
 *
 * e5 models expect an instruction prefix: "query: " for search queries and
 * "passage: " for indexed documents. Getting this wrong quietly hurts recall.
 */

export const EMBEDDING_DIM = 384;
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

async function embedWithVoyage(texts: string[]): Promise<number[][]> {
  if (!env.VOYAGE_API_KEY) throw new Error('EMBEDDINGS_PROVIDER=voyage but VOYAGE_API_KEY is unset');
  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${env.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({ input: texts, model: 'voyage-3-lite', output_dimension: EMBEDDING_DIM }),
  });
  if (!res.ok) throw new Error(`Voyage embeddings failed: ${res.status}`);
  const json = (await res.json()) as { data: { embedding: number[] }[] };
  return json.data.map((d) => d.embedding);
}

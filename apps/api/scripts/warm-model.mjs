/**
 * Download and cache the local embedding model at image-build time so the
 * container starts fast and works even with no outbound network at runtime.
 * Stand-alone on purpose — it must not import the app (which validates env).
 * Run from the repo root so the cache lands where the app expects it.
 */
import { pipeline, env } from '@huggingface/transformers';

const MODEL_ID = 'Xenova/multilingual-e5-small';
env.cacheDir = '.cache/transformers'; // matches apps/api/src/ai/embeddings.ts

console.log(`Warming ${MODEL_ID} …`);
const extract = await pipeline('feature-extraction', MODEL_ID);
await extract(['query: warmup'], { pooling: 'mean', normalize: true });
console.log('Embedding model cached at .cache/transformers');

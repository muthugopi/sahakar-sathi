import { Prisma } from '@prisma/client';
import { logger } from '../config/logger.js';

/**
 * Prisma error codes that mean "the database was momentarily unreachable" rather
 * than "your query is wrong" — a Neon compute waking from idle, a dropped pooled
 * connection, or a connection-pool checkout timeout. Safe to retry for an
 * idempotent read.
 *
 *   P1001 — can't reach database server
 *   P1002 — database server reached but timed out
 *   P1008 — operation timed out
 *   P1017 — server has closed the connection
 *   P2024 — timed out fetching a connection from the pool
 */
const TRANSIENT_CODES = new Set(['P1001', 'P1002', 'P1008', 'P1017', 'P2024']);

export function isTransientDbError(err: unknown): boolean {
  if (err instanceof Prisma.PrismaClientInitializationError) return true;
  if (err instanceof Prisma.PrismaClientRustPanicError) return true;
  if (err instanceof Prisma.PrismaClientKnownRequestError) return TRANSIENT_CODES.has(err.code);
  return false;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface RetryOptions {
  retries?: number;
  baseDelayMs?: number;
}

/**
 * Run an idempotent read, retrying a few times with exponential backoff on
 * transient connection errors so a Neon cold start is absorbed instead of
 * surfacing to the client. Non-transient errors (and the final attempt) are
 * rethrown unchanged for the global error handler to classify.
 *
 * Do NOT wrap writes or multi-statement logic in this — only single reads.
 */
export async function withDbRetry<T>(
  fn: () => Promise<T>,
  { retries = 3, baseDelayMs = 250 }: RetryOptions = {},
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (!isTransientDbError(err) || attempt === retries) break;
      const delay = baseDelayMs * 2 ** attempt;
      logger.warn(
        { attempt: attempt + 1, retries, delayMs: delay, err },
        'transient DB error — retrying read',
      );
      await sleep(delay);
    }
  }
  throw lastErr;
}

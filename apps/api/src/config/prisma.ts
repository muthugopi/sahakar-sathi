import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { env, isProd } from './env.js';
import { logger } from './logger.js';

// Node has no native WebSocket suitable for the Neon serverless driver; this
// lets the driver tunnel the Postgres wire protocol over wss:// (port 443)
// instead of a raw TCP :5432 connection — needed on networks that block
// arbitrary outbound ports (Neon's direct/pooler endpoints included).
neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: env.DIRECT_URL ?? env.DATABASE_URL });

/**
 * Reuse a single PrismaClient across hot reloads in development to avoid
 * exhausting the connection pool.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: isProd ? ['warn', 'error'] : ['warn', 'error'],
  });

if (!isProd) globalForPrisma.prisma = prisma;

void env; // ensure env validation runs before any DB access

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Open the connection pool on boot, retrying with backoff. On Neon the compute
 * may be suspended when the process starts; without this the first user request
 * pays the cold-start cost and can time out.
 */
export async function connectWithRetry(retries = 5): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await prisma.$connect();
      logger.info('Database connection established');
      return;
    } catch (err) {
      if (attempt === retries) {
        logger.error({ err, attempt }, 'Database connection failed after all retries');
        throw err;
      }
      const delay = Math.min(1000 * 2 ** (attempt - 1), 10_000);
      logger.warn({ err, attempt, retries, delayMs: delay }, 'Database connection failed — retrying');
      await sleep(delay);
    }
  }
}

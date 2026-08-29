import { PrismaClient } from '@prisma/client';
import { env, isProd } from './env.js';

/**
 * Reuse a single PrismaClient across hot reloads in development to avoid
 * exhausting the connection pool.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isProd ? ['warn', 'error'] : ['warn', 'error'],
  });

if (!isProd) globalForPrisma.prisma = prisma;

void env; // ensure env validation runs before any DB access

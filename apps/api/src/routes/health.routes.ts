import { Router } from 'express';
import { prisma } from '../config/prisma.js';
import { llmProvider, env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const healthRouter = Router();

/** Liveness — process is up. */
healthRouter.get('/live', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

/** Readiness — dependencies reachable. */
healthRouter.get(
  '/ready',
  asyncHandler(async (_req, res) => {
    const checks: Record<string, 'ok' | 'error'> = { database: 'ok' };
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      checks.database = 'error';
    }

    const ready = Object.values(checks).every((v) => v === 'ok');
    res.status(ready ? 200 : 503).json({
      status: ready ? 'ready' : 'degraded',
      env: env.NODE_ENV,
      llm: llmProvider,
      embeddings: env.EMBEDDINGS_PROVIDER,
      checks,
    });
  }),
);

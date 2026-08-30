import type { Request } from 'express';
import { prisma } from '../config/prisma.js';
import { logger } from '../config/logger.js';

/**
 * Record an admin / security-relevant action. Fire-and-forget — an audit
 * failure must never block the operation it describes.
 */
export function audit(
  req: Request,
  action: string,
  target?: { type: string; id: string },
  metadata?: Record<string, unknown>,
): void {
  const actorId = req.auth?.sub ?? null;
  void prisma.auditLog
    .create({
      data: {
        actorId,
        action,
        targetType: target?.type ?? null,
        targetId: target?.id ?? null,
        metadata: (metadata ?? undefined) as object | undefined,
        ip: req.ip ?? null,
      },
    })
    .catch((err) => logger.warn({ err, action }, 'audit log write failed'));
}

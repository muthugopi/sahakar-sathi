import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { UserRole } from '@sahakar/shared';
import { AppError } from '../utils/AppError.js';
import { verifyAccessToken, type AccessTokenPayload } from '../utils/tokens.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AccessTokenPayload;
    }
  }
}

function readBearer(req: Request): string | undefined {
  const header = req.header('authorization');
  if (!header?.startsWith('Bearer ')) return undefined;
  return header.slice(7).trim() || undefined;
}

/** Populate req.auth if a valid token is present; never rejects. */
export const optionalAuth: RequestHandler = (req, _res, next) => {
  const token = readBearer(req);
  if (token) {
    try {
      req.auth = verifyAccessToken(token);
    } catch {
      /* ignore — treated as anonymous */
    }
  }
  next();
};

/** Require a valid access token. */
export const requireAuth: RequestHandler = (req, _res, next) => {
  const token = readBearer(req);
  if (!token) return next(AppError.unauthorized());
  try {
    req.auth = verifyAccessToken(token);
    next();
  } catch {
    next(AppError.unauthorized('Your session has expired. Please sign in again.'));
  }
};

/** Require one of the given roles (implies requireAuth). */
export const requireRole =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) return next(AppError.unauthorized());
    if (!roles.includes(req.auth.role)) return next(AppError.forbidden());
    next();
  };

import type { NextFunction, Request, Response } from 'express';

/**
 * Wrap an async route handler so rejected promises reach the error middleware
 * instead of hanging the request.
 */
export const asyncHandler =
  <T extends Request = Request>(
    fn: (req: T, res: Response, next: NextFunction) => Promise<unknown>,
  ) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req as T, res, next)).catch(next);
  };

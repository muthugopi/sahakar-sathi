import type { RequestHandler } from 'express';
import type { ZodTypeAny, z } from 'zod';

type Sources = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

/**
 * Parse and REPLACE req.body / req.query / req.params with validated data.
 * Handlers downstream can trust the shapes. Throws ZodError -> error middleware.
 */
export const validate =
  (schemas: Sources): RequestHandler =>
  (req, _res, next) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) {
        const parsed = schemas.query.parse(req.query);
        Object.defineProperty(req, 'query', { value: parsed, writable: true, configurable: true });
      }
      if (schemas.params) req.params = schemas.params.parse(req.params) as typeof req.params;
      next();
    } catch (err) {
      next(err);
    }
  };

export type Infer<T extends ZodTypeAny> = z.infer<T>;

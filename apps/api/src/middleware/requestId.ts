import type { RequestHandler } from 'express';
import { nanoid } from 'nanoid';

/** Attach a short correlation id to every request, echoed in the response + errors. */
export const requestId: RequestHandler = (req, res, next) => {
  const incoming = req.header('x-request-id');
  const id = incoming && incoming.length <= 64 ? incoming : nanoid(12);
  (req as { id?: string }).id = id;
  res.setHeader('x-request-id', id);
  next();
};

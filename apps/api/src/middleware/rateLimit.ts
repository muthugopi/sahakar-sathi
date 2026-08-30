import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

const json429 = {
  error: { code: 'RATE_LIMITED', message: 'Too many requests. Please slow down and try again.' },
};

/** Default limiter applied to the whole API. */
export const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: json429,
});

/** Tighter limiter for auth endpoints (brute-force protection). */
export const authLimiter = rateLimit({
  windowMs: 15 * 60_000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: json429,
});

/** Chat is expensive (LLM calls) — cap per window. */
export const chatLimiter = rateLimit({
  windowMs: 60_000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: json429,
});

/** Grievance submission — deter spam / abuse. */
export const grievanceLimiter = rateLimit({
  windowMs: 60 * 60_000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: json429,
});

/** File uploads — tighter still. */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60_000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: json429,
});

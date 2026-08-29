import { createHash, randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
import type { UserRole, LanguageCode } from '@sahakar/shared';
import { env } from '../config/env.js';

export interface AccessTokenPayload {
  sub: string;
  role: UserRole;
  lang: LanguageCode;
}

/** Signed, short-lived bearer token sent in the Authorization header. */
export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL as jwt.SignOptions['expiresIn'],
    issuer: 'sahakar-sathi',
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, { issuer: 'sahakar-sathi' });
  if (typeof decoded === 'string') throw new Error('Malformed token');
  return decoded as AccessTokenPayload & jwt.JwtPayload;
}

/**
 * Refresh tokens are opaque high-entropy strings. Only their SHA-256 hash is
 * stored, so a database leak does not expose usable tokens.
 */
export function generateRefreshToken(): { token: string; tokenHash: string } {
  const token = randomBytes(48).toString('base64url');
  return { token, tokenHash: hashRefreshToken(token) };
}

export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** Parse a duration like "30d" / "15m" / "3600s" into milliseconds. */
export function durationToMs(value: string): number {
  const match = /^(\d+)\s*(ms|s|m|h|d)$/.exec(value.trim());
  if (!match) throw new Error(`Invalid duration: ${value}`);
  const n = Number(match[1]);
  const unit = match[2] as 'ms' | 's' | 'm' | 'h' | 'd';
  const factor = { ms: 1, s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[unit];
  return n * factor;
}

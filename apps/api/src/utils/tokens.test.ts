import { describe, it, expect } from 'vitest';
import {
  durationToMs,
  generateRefreshToken,
  hashRefreshToken,
  signAccessToken,
  verifyAccessToken,
} from './tokens.js';

describe('durationToMs', () => {
  it('parses common units', () => {
    expect(durationToMs('15m')).toBe(900_000);
    expect(durationToMs('30d')).toBe(2_592_000_000);
    expect(durationToMs('45s')).toBe(45_000);
  });
  it('rejects garbage', () => {
    expect(() => durationToMs('soon')).toThrow();
  });
});

describe('access tokens', () => {
  it('round-trips the payload', () => {
    const token = signAccessToken({ sub: 'u1', role: 'FARMER', lang: 'ta' });
    const decoded = verifyAccessToken(token);
    expect(decoded.sub).toBe('u1');
    expect(decoded.role).toBe('FARMER');
    expect(decoded.lang).toBe('ta');
  });
  it('rejects a tampered token', () => {
    const token = signAccessToken({ sub: 'u1', role: 'USER', lang: 'en' });
    expect(() => verifyAccessToken(token + 'x')).toThrow();
  });
});

describe('refresh tokens', () => {
  it('produces a stable hash and unique tokens', () => {
    const a = generateRefreshToken();
    const b = generateRefreshToken();
    expect(a.token).not.toBe(b.token);
    expect(hashRefreshToken(a.token)).toBe(a.tokenHash);
    expect(a.tokenHash).toHaveLength(64);
  });
});

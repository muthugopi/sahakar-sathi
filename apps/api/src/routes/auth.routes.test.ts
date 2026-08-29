import { describe, it, expect } from 'vitest';
import type { AddressInfo } from 'node:net';
import { createApp } from '../app.js';

async function withServer(fn: (base: string) => Promise<void>) {
  const server = createApp().listen(0);
  await new Promise((r) => server.once('listening', r));
  const { port } = server.address() as AddressInfo;
  try {
    await fn(`http://127.0.0.1:${port}`);
  } finally {
    server.close();
  }
}

describe('auth routes (no DB required)', () => {
  it('rejects /auth/me without a token', async () => {
    await withServer(async (base) => {
      const res = await fetch(`${base}/api/v1/auth/me`);
      expect(res.status).toBe(401);
      const body = (await res.json()) as { error: { code: string } };
      expect(body.error.code).toBe('UNAUTHORIZED');
    });
  });

  it('rejects /auth/refresh with no cookie', async () => {
    await withServer(async (base) => {
      const res = await fetch(`${base}/api/v1/auth/refresh`, { method: 'POST' });
      expect(res.status).toBe(401);
    });
  });

  it('validates the register payload before touching the database', async () => {
    await withServer(async (base) => {
      const res = await fetch(`${base}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: 'A', password: 'short' }),
      });
      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: { code: string } };
      expect(body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});

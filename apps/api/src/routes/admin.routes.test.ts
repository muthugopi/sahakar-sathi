import { describe, it, expect } from 'vitest';
import type { AddressInfo } from 'node:net';
import { createApp } from '../app.js';
import { signAccessToken } from '../utils/tokens.js';

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

describe('admin routes guard', () => {
  it('rejects an anonymous request with 401', async () => {
    await withServer(async (base) => {
      const res = await fetch(`${base}/api/v1/admin/analytics`);
      expect(res.status).toBe(401);
    });
  });

  it('rejects a non-admin token with 403', async () => {
    await withServer(async (base) => {
      const token = signAccessToken({ sub: 'u1', role: 'FARMER', lang: 'en' });
      const res = await fetch(`${base}/api/v1/admin/analytics`, {
        headers: { authorization: `Bearer ${token}` },
      });
      expect(res.status).toBe(403);
    });
  });

  it('validates the scheme payload for an admin', async () => {
    await withServer(async (base) => {
      const token = signAccessToken({ sub: 'admin1', role: 'ADMIN', lang: 'en' });
      const res = await fetch(`${base}/api/v1/admin/schemes`, {
        method: 'POST',
        headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
        body: JSON.stringify({ slug: 'Bad Slug!', title: 'x' }),
      });
      expect(res.status).toBe(400);
    });
  });
});

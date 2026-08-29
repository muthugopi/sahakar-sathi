import { describe, it, expect } from 'vitest';
import type { AddressInfo } from 'node:net';
import { createApp } from './app.js';

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

describe('app', () => {
  it('reports liveness', async () => {
    await withServer(async (base) => {
      const res = await fetch(`${base}/api/v1/health/live`);
      expect(res.status).toBe(200);
      expect(await res.json()).toMatchObject({ status: 'ok' });
    });
  });

  it('returns a structured 404 envelope for unknown routes', async () => {
    await withServer(async (base) => {
      const res = await fetch(`${base}/api/v1/does-not-exist`);
      expect(res.status).toBe(404);
      const body = (await res.json()) as { error: { code: string } };
      expect(body.error.code).toBe('NOT_FOUND');
    });
  });
});

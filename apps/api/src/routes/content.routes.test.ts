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

describe('content routes validation', () => {
  it('rejects an unknown content section before hitting the database', async () => {
    await withServer(async (base) => {
      const res = await fetch(`${base}/api/v1/content/NOT_A_SECTION`);
      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: { code: string } };
      expect(body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  it('rejects an over-long scheme slug', async () => {
    await withServer(async (base) => {
      const res = await fetch(`${base}/api/v1/schemes/${'x'.repeat(200)}`);
      expect(res.status).toBe(400);
    });
  });
});

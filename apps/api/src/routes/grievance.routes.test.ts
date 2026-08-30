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

describe('grievance routes (no DB required)', () => {
  it('rejects a malformed tracking id before touching the database', async () => {
    await withServer(async (base) => {
      const res = await fetch(`${base}/api/v1/grievances/not-a-real-id`);
      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: { code: string } };
      expect(body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  it('validates the grievance payload (description too short, no category)', async () => {
    await withServer(async (base) => {
      const res = await fetch(`${base}/api/v1/grievances`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ description: 'too short' }),
      });
      expect(res.status).toBe(400);
    });
  });

  it('requires auth for the admin status endpoint', async () => {
    await withServer(async (base) => {
      const res = await fetch(`${base}/api/v1/grievances/GRV-ABCD2345/status`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: 'UNDER_REVIEW' }),
      });
      expect(res.status).toBe(401);
    });
  });

  it('rejects an unsupported upload with no file', async () => {
    await withServer(async (base) => {
      const res = await fetch(`${base}/api/v1/grievances/attachments`, { method: 'POST' });
      expect([400, 500]).toContain(res.status);
    });
  });
});

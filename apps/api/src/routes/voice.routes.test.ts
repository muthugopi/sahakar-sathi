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

describe('voice routes', () => {
  it('advertises the browser speech strategy with language tags', async () => {
    await withServer(async (base) => {
      const res = await fetch(`${base}/api/v1/voice/config`);
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        stt: string;
        tts: string;
        languageTags: Record<string, string>;
        serverTranscription: boolean;
      };
      expect(body.stt).toBe('browser');
      expect(body.tts).toBe('browser');
      expect(body.languageTags).toMatchObject({ en: 'en-IN', ta: 'ta-IN', hi: 'hi-IN' });
      expect(body.serverTranscription).toBe(false);
    });
  });

  it('returns 501 for server transcribe/speak until a provider is configured', async () => {
    await withServer(async (base) => {
      for (const path of ['/api/v1/voice/transcribe', '/api/v1/voice/speak']) {
        const res = await fetch(`${base}${path}`, { method: 'POST' });
        expect(res.status).toBe(501);
      }
    });
  });
});

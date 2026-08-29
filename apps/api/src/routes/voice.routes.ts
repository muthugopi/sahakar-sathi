import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getSpeechConfig } from '../speech/index.js';

export const voiceRouter = Router();

/**
 * Tells the client which speech strategy to use. Today: browser Web Speech API.
 * When a hosted provider is configured this flips `serverTranscription` /
 * `serverSynthesis` to true and the endpoints below start doing real work.
 */
voiceRouter.get(
  '/config',
  asyncHandler(async (_req, res) => {
    res.json(getSpeechConfig());
  }),
);

const notConfigured = (res: import('express').Response, feature: string) =>
  res.status(501).json({
    error: {
      code: 'NOT_FOUND',
      message: `Server-side ${feature} is not configured. The app uses on-device speech (Web Speech API).`,
    },
  });

voiceRouter.post(
  '/transcribe',
  asyncHandler(async (_req, res) => {
    notConfigured(res, 'speech-to-text');
  }),
);

voiceRouter.post(
  '/speak',
  asyncHandler(async (_req, res) => {
    notConfigured(res, 'text-to-speech');
  }),
);

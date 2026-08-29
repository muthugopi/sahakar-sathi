import { env } from '../config/env.js';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '@sahakar/shared';

/**
 * Speech (STT / TTS) strategy.
 *
 * The default is `browser`: the web app uses the device's Web Speech API, which
 * is free, needs no server round-trip for audio, and keeps user voice data on
 * the device. The server exposes only a capability descriptor and reserved
 * endpoints so a hosted provider (e.g. Bhashini / ULCA for Indian languages)
 * can be added later without changing the client contract.
 */

export type SpeechProviderName = 'browser';

export interface SpeechConfig {
  stt: SpeechProviderName;
  tts: SpeechProviderName;
  /** BCP-47 tags the client should request from the Web Speech API, per language. */
  languageTags: Record<LanguageCode, string>;
  serverTranscription: boolean;
  serverSynthesis: boolean;
}

const LANGUAGE_TAGS: Record<LanguageCode, string> = {
  en: 'en-IN',
  ta: 'ta-IN',
  hi: 'hi-IN',
};

export function getSpeechConfig(): SpeechConfig {
  return {
    stt: env.SPEECH_PROVIDER,
    tts: env.SPEECH_PROVIDER,
    languageTags: LANGUAGE_TAGS,
    serverTranscription: false,
    serverSynthesis: false,
  };
}

export const speechLanguages = SUPPORTED_LANGUAGES.map((l) => l.code);

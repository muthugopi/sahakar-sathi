import { DEFAULT_LANGUAGE, LANGUAGE_CODES, type LanguageCode } from '@sahakar/shared';

/**
 * Script-based language detection for the supported set (en/ta/hi).
 * We only support three languages with distinct scripts, so counting
 * characters per Unicode block is more robust (and dependency-free) than a
 * statistical detector — it works on very short strings and code-mixed text.
 */
const TAMIL = /[஀-௿]/g; // Tamil block
const DEVANAGARI = /[ऀ-ॿ]/g; // Devanagari block (Hindi)
const LATIN = /[A-Za-z]/g;

export function detectLanguage(
  text: string,
  fallback: LanguageCode = DEFAULT_LANGUAGE,
): LanguageCode {
  if (!text?.trim()) return fallback;

  const tamil = (text.match(TAMIL) ?? []).length;
  const devanagari = (text.match(DEVANAGARI) ?? []).length;
  const latin = (text.match(LATIN) ?? []).length;

  // A little Indic script goes a long way — users often mix in English words.
  if (tamil >= 2 && tamil >= devanagari) return 'ta';
  if (devanagari >= 2 && devanagari > tamil) return 'hi';
  if (latin > 0) return 'en';
  return fallback;
}

export function isSupportedLanguage(value: string): value is LanguageCode {
  return (LANGUAGE_CODES as readonly string[]).includes(value);
}

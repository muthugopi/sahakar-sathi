import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { DEFAULT_LANGUAGE, LANGUAGE_CODES } from '@sahakar/shared';
import en from './locales/en.json';
import hi from './locales/hi.json';
import ta from './locales/ta.json';

/**
 * Chrome translations are bundled (small). AI responses are translated
 * server-side per the user's selected language — see the RAG pipeline.
 * Adding a language: add it to SUPPORTED_LANGUAGES in @sahakar/shared and
 * drop a locale JSON here.
 */
export const STORAGE_KEY = 'sahakar.lang';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      ta: { translation: ta },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: LANGUAGE_CODES,
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: STORAGE_KEY,
      caches: ['localStorage'],
    },
    returnObjects: true,
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;

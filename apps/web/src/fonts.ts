/**
 * Typefaces. Source Serif 4 (display) + Noto Sans (text) load with the app; the
 * Indic companions — Noto Serif and Noto Sans in Devanagari / Tamil — are fetched
 * only when that language is chosen. All self-hosted via @fontsource, Latin
 * subsets only for the base.
 */
import '@fontsource/source-serif-4/latin-400.css';
import '@fontsource/source-serif-4/latin-600.css';
import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '@fontsource/noto-sans/latin-600.css';

let devanagariLoaded = false;
let tamilLoaded = false;

export async function ensureScriptFont(lang: string): Promise<void> {
  if (lang === 'hi' && !devanagariLoaded) {
    devanagariLoaded = true;
    await Promise.all([
      import('@fontsource/noto-sans-devanagari/400.css'),
      import('@fontsource/noto-sans-devanagari/600.css'),
      import('@fontsource/noto-serif-devanagari/400.css'),
      import('@fontsource/noto-serif-devanagari/600.css'),
    ]);
  }
  if (lang === 'ta' && !tamilLoaded) {
    tamilLoaded = true;
    await Promise.all([
      import('@fontsource/noto-sans-tamil/400.css'),
      import('@fontsource/noto-sans-tamil/600.css'),
      import('@fontsource/noto-serif-tamil/400.css'),
      import('@fontsource/noto-serif-tamil/600.css'),
    ]);
  }
}

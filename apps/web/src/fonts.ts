/**
 * Typefaces. Archivo (display) + Noto Sans (body) load with the app; the Indic
 * Noto faces are fetched only when that language is chosen. All self-hosted via
 * @fontsource. Latin subsets only for the base — @fontsource splits per subset.
 */
import '@fontsource/archivo/latin-600.css';
import '@fontsource/archivo/latin-700.css';
import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-600.css';

let devanagariLoaded = false;
let tamilLoaded = false;

export async function ensureScriptFont(lang: string): Promise<void> {
  if (lang === 'hi' && !devanagariLoaded) {
    devanagariLoaded = true;
    await Promise.all([
      import('@fontsource/noto-sans-devanagari/400.css'),
      import('@fontsource/noto-sans-devanagari/600.css'),
    ]);
  }
  if (lang === 'ta' && !tamilLoaded) {
    tamilLoaded = true;
    await Promise.all([
      import('@fontsource/noto-sans-tamil/400.css'),
      import('@fontsource/noto-sans-tamil/600.css'),
    ]);
  }
}

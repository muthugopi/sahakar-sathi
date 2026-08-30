/**
 * Typefaces. Latin (IBM Plex Serif for headings, IBM Plex Sans for body) loads
 * with the app; the Indic faces are fetched only when that language is chosen.
 * All are self-hosted via @fontsource and precached by the service worker.
 */
import '@fontsource/ibm-plex-sans/latin-400.css';
import '@fontsource/ibm-plex-sans/latin-600.css';
import '@fontsource/ibm-plex-serif/latin-400.css';
import '@fontsource/ibm-plex-serif/latin-600.css';

let devanagariLoaded = false;
let tamilLoaded = false;

export async function ensureScriptFont(lang: string): Promise<void> {
  if (lang === 'hi' && !devanagariLoaded) {
    devanagariLoaded = true;
    await Promise.all([
      import('@fontsource/ibm-plex-sans-devanagari/400.css'),
      import('@fontsource/ibm-plex-sans-devanagari/600.css'),
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

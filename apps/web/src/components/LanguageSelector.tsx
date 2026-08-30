import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@sahakar/shared';

/**
 * Always-visible language control. A native <select> on purpose — familiar,
 * screen-reader friendly, works on the lowest-end phones.
 */
export function LanguageSelector({ id = 'lang', hideLabel = false }: { id?: string; hideLabel?: boolean }) {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage ?? 'en';

  return (
    <span className="flex items-center gap-2">
      <label htmlFor={id} className={hideLabel ? 'sr-only' : 'text-sm text-ink-2'}>
        {t('nav.language')}
      </label>
      <select
        id={id}
        value={current}
        onChange={(e) => void i18n.changeLanguage(e.target.value)}
        className="min-h-touch rounded-lg border border-line bg-panel px-3 py-1.5 font-sans text-sm font-medium text-ink transition-colors hover:border-ink/25 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-panel text-ink">
            {lang.nativeLabel}
          </option>
        ))}
      </select>
    </span>
  );
}

import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@sahakar/shared';

/**
 * Always-visible language control. Uses a native <select> on purpose:
 * it is familiar, keyboard/screen-reader friendly, and works on the
 * lowest-end mobile browsers.
 */
export function LanguageSelector({ id = 'lang' }: { id?: string }) {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage ?? 'en';

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {t('nav.language')}
      </label>
      <select
        id={id}
        value={current}
        onChange={(e) => void i18n.changeLanguage(e.target.value)}
        className="min-h-[2.75rem] rounded border border-line bg-panel px-3 py-1.5 text-base
                   focus-visible:outline-field"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

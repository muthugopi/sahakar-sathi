import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@sahakar/shared';

/**
 * Always-visible language control. A native <select> on purpose — familiar,
 * screen-reader friendly, works on the lowest-end phones. Inherits its colour
 * from the surrounding context (white on the navy header, navy in the menu).
 */
export function LanguageSelector({ id = 'lang' }: { id?: string }) {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage ?? 'en';

  return (
    <span className="flex items-center gap-2">
      <label htmlFor={id} className="text-sm">
        {t('nav.language')}
      </label>
      <select
        id={id}
        value={current}
        onChange={(e) => void i18n.changeLanguage(e.target.value)}
        className="min-h-11 rounded border-2 border-current bg-transparent px-2 font-sans font-semibold"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-white text-ink">
            {lang.nativeLabel}
          </option>
        ))}
      </select>
    </span>
  );
}

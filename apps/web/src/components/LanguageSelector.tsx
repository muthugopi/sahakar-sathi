import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@sahakar/shared';

/**
 * Always-visible language control. A native <select> on purpose — familiar,
 * screen-reader friendly, works on the lowest-end phones. Styled for the dark
 * header band.
 */
export function LanguageSelector({ id = 'lang' }: { id?: string }) {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage ?? 'en';

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-sm text-white/90">
        {t('nav.language')}
      </label>
      <select
        id={id}
        value={current}
        onChange={(e) => void i18n.changeLanguage(e.target.value)}
        className="min-h-[2.75rem] border-2 border-white bg-field-deep px-2 font-bold text-white"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-white text-ink">
            {lang.nativeLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

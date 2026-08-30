import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@sahakar/shared';

export function LanguageSelector({ id = 'lang' }: { id?: string }) {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage ?? 'en';

  return (
    <label className="flex items-center gap-2 rounded-md border border-line bg-panel px-2.5 py-1.5 text-sm text-ink">
      <span className="hidden text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted sm:inline">
        {t('nav.language')}
      </span>
      <select
        id={id}
        value={current}
        onChange={(e) => void i18n.changeLanguage(e.target.value)}
        className="min-h-[2.2rem] border-0 bg-transparent pr-1 text-sm font-medium text-ink outline-none"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

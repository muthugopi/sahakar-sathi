import { useTranslation } from 'react-i18next';
import { useTextSize } from '../lib/useTextSize';

/** "Text size  A− A A+" — a familiar, always-visible accessibility control. */
export function TextSizeControl() {
  const { t } = useTranslation();
  const { larger, smaller, reset, canGrow, canShrink } = useTextSize();

  const btn =
    'flex h-11 min-w-[2.75rem] items-center justify-center border-2 border-white bg-transparent font-bold text-white hover:bg-white/15 disabled:opacity-40';

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm text-white/90">{t('a11y.textSize')}</span>
      <div className="flex gap-1">
        <button type="button" onClick={smaller} disabled={!canShrink} className={btn} aria-label={t('a11y.smaller')}>
          <span aria-hidden>A−</span>
        </button>
        <button type="button" onClick={reset} className={`${btn} text-base`} aria-label={t('a11y.resetSize')}>
          <span aria-hidden>A</span>
        </button>
        <button type="button" onClick={larger} disabled={!canGrow} className={`${btn} text-xl`} aria-label={t('a11y.larger')}>
          <span aria-hidden>A+</span>
        </button>
      </div>
    </div>
  );
}

import { useTranslation } from 'react-i18next';
import { useTextSize } from '../lib/useTextSize';

/** "Text size  A− A A+" — a familiar, always-visible accessibility control.
 *  Inherits its colour from the surrounding context. */
export function TextSizeControl() {
  const { t } = useTranslation();
  const { larger, smaller, reset, canGrow, canShrink } = useTextSize();

  const btn =
    'flex h-11 min-w-11 items-center justify-center rounded border-2 border-current bg-transparent font-sans font-semibold hover:bg-white/15 disabled:opacity-40';

  return (
    <span className="flex items-center gap-1.5">
      <span className="text-sm">{t('a11y.textSize')}</span>
      <span className="flex gap-1">
        <button type="button" onClick={smaller} disabled={!canShrink} className={btn} aria-label={t('a11y.smaller')}>
          <span aria-hidden>A−</span>
        </button>
        <button type="button" onClick={reset} className={btn} aria-label={t('a11y.resetSize')}>
          <span aria-hidden>A</span>
        </button>
        <button type="button" onClick={larger} disabled={!canGrow} className={`${btn} text-xl`} aria-label={t('a11y.larger')}>
          <span aria-hidden>A+</span>
        </button>
      </span>
    </span>
  );
}

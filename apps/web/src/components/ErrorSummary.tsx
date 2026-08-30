import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export interface FieldError {
  /** id of the input this message belongs to (for the jump link) */
  field?: string;
  message: string;
}

/**
 * GOV.UK-style error summary. Sits at the top of a form, lists every problem,
 * and moves focus to itself so screen-reader and keyboard users hear it first.
 */
export function ErrorSummary({ errors }: { errors: FieldError[] }) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (errors.length) ref.current?.focus();
  }, [errors]);

  if (errors.length === 0) return null;

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      aria-labelledby="error-summary-title"
      className="error-summary"
    >
      <h2 id="error-summary-title" className="text-lg font-bold text-ink">
        {t('common.errorSummaryTitle')}
      </h2>
      <ul className="mt-2 space-y-1">
        {errors.map((e, i) => (
          <li key={i}>
            {e.field ? (
              <a href={`#${e.field}`} className="font-bold text-clay">
                {e.message}
              </a>
            ) : (
              <span className="font-bold text-clay">{e.message}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

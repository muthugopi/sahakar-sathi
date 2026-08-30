import { useTranslation } from 'react-i18next';
import type { AnswerConfidence } from '@sahakar/shared';

const STYLE: Record<AnswerConfidence, string> = {
  HIGH: 'border-s-primary text-primary',
  MEDIUM: 'border-s-primary text-primary',
  LOW: 'border-s-accent text-ink',
  NO_SOURCE: 'border-s-error text-error',
};

const DOT: Record<AnswerConfidence, string> = {
  HIGH: '●●●',
  MEDIUM: '●●○',
  LOW: '●○○',
  NO_SOURCE: '○○○',
};

/** How well the answer is grounded — shown as text plus dots, never colour alone. */
export function ConfidenceTag({ value }: { value: AnswerConfidence }) {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-flex items-center gap-2 rounded border-s-4 bg-bg px-2 py-1 font-sans text-sm font-semibold ${STYLE[value]}`}
    >
      <span aria-hidden className="font-mono">
        {DOT[value]}
      </span>
      {t(`assistant.confidence.${value}`)}
    </span>
  );
}

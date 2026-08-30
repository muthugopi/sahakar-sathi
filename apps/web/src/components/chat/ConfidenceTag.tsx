import { useTranslation } from 'react-i18next';
import type { AnswerConfidence } from '@sahakar/shared';

const STYLE: Record<AnswerConfidence, string> = {
  HIGH: 'text-primary',
  MEDIUM: 'text-primary',
  LOW: 'text-ink',
  NO_SOURCE: 'text-error',
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
    <span className={`inline-flex items-baseline gap-2 font-sans text-sm font-semibold ${STYLE[value]}`}>
      <span aria-hidden className="font-mono text-xs">
        {DOT[value]}
      </span>
      {t(`assistant.confidence.${value}`)}
    </span>
  );
}

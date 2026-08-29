import { useTranslation } from 'react-i18next';
import type { AnswerConfidence } from '@sahakar/shared';

const STYLES: Record<AnswerConfidence, string> = {
  HIGH: 'bg-field-wash text-field-deep border-field/30',
  MEDIUM: 'bg-field-wash text-field-deep border-field/30',
  LOW: 'bg-marigold/15 text-ink border-marigold/40',
  NO_SOURCE: 'bg-clay/10 text-clay border-clay/40',
};

const DOT: Record<AnswerConfidence, string> = {
  HIGH: '●●●',
  MEDIUM: '●●○',
  LOW: '●○○',
  NO_SOURCE: '○○○',
};

/** Communicates how well an answer is grounded — never colour alone (uses text + dots). */
export function ConfidenceTag({ value }: { value: AnswerConfidence }) {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-flex items-center gap-2 rounded border px-2 py-1 text-xs font-medium ${STYLES[value]}`}
    >
      <span aria-hidden className="font-mono tracking-tight">
        {DOT[value]}
      </span>
      {t(`assistant.confidence.${value}`)}
    </span>
  );
}

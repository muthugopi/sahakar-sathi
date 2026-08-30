import { useTranslation } from 'react-i18next';
import type { AnswerConfidence } from '@sahakar/shared';

const STYLE: Record<AnswerConfidence, string> = {
  HIGH: 'bg-field-wash text-field-deep border-field/40',
  MEDIUM: 'bg-field-wash text-field-deep border-field/40',
  LOW: 'bg-[#fff2d6] text-[#5b4300] border-[#e0b970]',
  NO_SOURCE: 'bg-soft text-clay border-clay',
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
      className={`inline-flex items-center gap-2 border px-2 py-1 text-xs font-bold uppercase tracking-wide ${STYLE[value]}`}
    >
      <span aria-hidden className="font-mono">
        {DOT[value]}
      </span>
      {t(`assistant.confidence.${value}`)}
    </span>
  );
}

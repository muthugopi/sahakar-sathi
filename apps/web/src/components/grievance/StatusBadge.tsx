import { useTranslation } from 'react-i18next';
import type { GrievanceStatus } from '@sahakar/shared';

// GOV.UK-style tags: square, uppercase, light background + dark text.
// The text label always shows, so status is never conveyed by colour alone.
const STYLE: Record<GrievanceStatus, string> = {
  SUBMITTED: 'bg-soft text-ink border-line',
  UNDER_REVIEW: 'bg-field-wash text-field-deep border-field/40',
  ASSIGNED: 'bg-[#fff2d6] text-[#5b4300] border-[#e0b970]',
  IN_PROGRESS: 'bg-[#fff2d6] text-[#5b4300] border-[#e0b970]',
  RESOLVED: 'bg-field text-white border-field',
  CLOSED: 'bg-soft text-muted border-line',
};

export function StatusBadge({ status }: { status: GrievanceStatus }) {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-block border px-2 py-1 text-xs font-bold uppercase tracking-wide ${STYLE[status]}`}
    >
      {t(`grievance.status.${status}`)}
    </span>
  );
}

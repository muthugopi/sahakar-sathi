import { useTranslation } from 'react-i18next';
import type { GrievanceStatus } from '@sahakar/shared';

// Pill with a text label — status is never conveyed by colour alone.
const TONE: Record<GrievanceStatus, string> = {
  SUBMITTED: 'text-ink-2',
  UNDER_REVIEW: 'text-primary',
  ASSIGNED: 'text-ink',
  IN_PROGRESS: 'text-ink',
  RESOLVED: 'text-ok',
  CLOSED: 'text-ink-2',
};

export function StatusBadge({ status }: { status: GrievanceStatus }) {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-flex items-center rounded-full border border-line bg-panel px-3 py-1 font-sans text-sm font-semibold ${TONE[status]}`}
    >
      {t(`grievance.status.${status}`)}
    </span>
  );
}

import { useTranslation } from 'react-i18next';
import type { GrievanceStatus } from '@sahakar/shared';

// Square tag with a coloured left keyline. The text label always shows, so
// status is never conveyed by colour alone.
const KEYLINE: Record<GrievanceStatus, string> = {
  SUBMITTED: 'border-s-line text-ink-2',
  UNDER_REVIEW: 'border-s-primary text-primary',
  ASSIGNED: 'border-s-accent text-ink',
  IN_PROGRESS: 'border-s-accent text-ink',
  RESOLVED: 'border-s-ok text-ok',
  CLOSED: 'border-s-line text-ink-2',
};

export function StatusBadge({ status }: { status: GrievanceStatus }) {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-block rounded border-s-4 bg-bg px-2 py-0.5 font-sans text-sm font-semibold ${KEYLINE[status]}`}
    >
      {t(`grievance.status.${status}`)}
    </span>
  );
}

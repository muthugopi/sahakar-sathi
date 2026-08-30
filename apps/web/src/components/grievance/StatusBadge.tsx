import { useTranslation } from 'react-i18next';
import type { GrievanceStatus } from '@sahakar/shared';

// Uses project design tokens only — the Tailwind config overrides `slate` with a
// single colour, so numbered `slate-*` shades are not available.
const STYLE: Record<GrievanceStatus, { dot: string; pill: string }> = {
  SUBMITTED: { dot: 'bg-muted', pill: 'bg-soft text-muted border-line' },
  UNDER_REVIEW: { dot: 'bg-field', pill: 'bg-field-soft text-field-deep border-field/20' },
  ASSIGNED: { dot: 'bg-marigold', pill: 'bg-marigold/15 text-ink border-marigold/40' },
  IN_PROGRESS: { dot: 'bg-marigold', pill: 'bg-marigold/15 text-ink border-marigold/40' },
  RESOLVED: { dot: 'bg-white', pill: 'bg-field text-white border-field' },
  CLOSED: { dot: 'bg-muted/60', pill: 'bg-line/40 text-muted border-line' },
};

export function StatusBadge({ status }: { status: GrievanceStatus }) {
  const { t } = useTranslation();
  const palette = STYLE[status];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] ${palette.pill}`}
    >
      <span className={`h-2 w-2 rounded-full ${palette.dot}`} aria-hidden />
      {t(`grievance.status.${status}`)}
    </span>
  );
}

import { useTranslation } from 'react-i18next';
import type { GrievanceEvent, GrievanceStatus } from '@sahakar/shared';
import { GRIEVANCE_LIFECYCLE } from '@sahakar/shared';

const CLOSED_EARLY = 'CLOSED';

export function StatusTimeline({
  status,
  timeline,
}: {
  status: GrievanceStatus;
  timeline: GrievanceEvent[];
}) {
  const { t } = useTranslation();

  const currentIndex =
    status === CLOSED_EARLY
      ? GRIEVANCE_LIFECYCLE.length - 1
      : GRIEVANCE_LIFECYCLE.indexOf(status);

  const noteByStatus = new Map<string, string>();
  for (const e of timeline) if (e.note) noteByStatus.set(e.status, e.note);
  const reachedAt = new Map<string, string>();
  for (const e of timeline) if (!reachedAt.has(e.status)) reachedAt.set(e.status, e.createdAt);

  return (
    <ol className="relative ml-3 space-y-4 before:absolute before:bottom-0 before:left-[0.55rem] before:top-1 before:w-px before:bg-line">
      {GRIEVANCE_LIFECYCLE.map((step, i) => {
        const done = i <= currentIndex;
        const current = i === currentIndex;
        const at = reachedAt.get(step);

        return (
          <li key={step} className="relative pl-8">
            <span
              className={`absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                done ? 'border-field bg-field' : 'border-line bg-panel'
              }`}
              aria-hidden
            />
            <div className={`rounded-2xl border p-3 ${done ? 'border-line bg-soft' : 'border-transparent bg-transparent'}`}>
              <div className="flex flex-wrap items-center gap-2">
                <p className={`text-sm font-semibold ${current ? 'text-field-deep' : done ? 'text-ink' : 'text-muted'}`}>
                  {t(`grievance.status.${step}`)}
                </p>
                {current && (
                  <span className="rounded-full bg-field-soft px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-field-deep">
                    {t('grievance.now')}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted">{t(`grievance.statusHelp.${step}`)}</p>
              {at && <p className="mt-1 text-xs text-muted">{new Date(at).toLocaleString()}</p>}
              {noteByStatus.get(step) && (
                <p className="mt-2 rounded-xl border border-line bg-panel px-2.5 py-2 text-sm text-ink">
                  {noteByStatus.get(step)}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

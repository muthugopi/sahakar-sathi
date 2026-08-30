import { useTranslation } from 'react-i18next';
import type { GrievanceEvent, GrievanceStatus } from '@sahakar/shared';
import { GRIEVANCE_LIFECYCLE } from '@sahakar/shared';

export function StatusTimeline({
  status,
  timeline,
}: {
  status: GrievanceStatus;
  timeline: GrievanceEvent[];
}) {
  const { t } = useTranslation();

  const currentIndex =
    status === 'CLOSED' ? GRIEVANCE_LIFECYCLE.length - 1 : GRIEVANCE_LIFECYCLE.indexOf(status);

  const noteByStatus = new Map<string, string>();
  for (const e of timeline) if (e.note) noteByStatus.set(e.status, e.note);
  const reachedAt = new Map<string, string>();
  for (const e of timeline) if (!reachedAt.has(e.status)) reachedAt.set(e.status, e.createdAt);

  return (
    <ol className="border-t border-line">
      {GRIEVANCE_LIFECYCLE.map((step, i) => {
        const done = i <= currentIndex;
        const current = i === currentIndex;
        const at = reachedAt.get(step);

        return (
          <li
            key={step}
            className={`border-b py-4 ps-4 ${current ? 'border-l-4 border-l-primary border-b-line' : 'border-line'}`}
          >
            <p className={`font-bold ${done ? 'text-ink' : 'text-ink-2'}`}>
              {t(`grievance.status.${step}`)}
              {current && (
                <span className="ms-2 font-normal text-primary">· {t('grievance.now')}</span>
              )}
            </p>
            <p className="mt-1 text-ink-2">{t(`grievance.statusHelp.${step}`)}</p>
            {at && <p className="mt-1 text-sm text-ink-2">{new Date(at).toLocaleString()}</p>}
            {noteByStatus.get(step) && (
              <p className="mt-2 inset text-ink">{noteByStatus.get(step)}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

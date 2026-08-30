import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GRIEVANCE_LIFECYCLE } from '@sahakar/shared';
import type { AdminUpdateGrievanceInput, GrievanceStatus } from '@sahakar/shared';
import { fetchGrievanceAdmin, updateGrievanceAdmin } from '../../lib/admin';
import { attachmentUrl } from '../../lib/grievance';
import { ApiRequestError } from '../../lib/api';
import { QueryBoundary } from '../../components/QueryBoundary';
import { StatusTimeline } from '../../components/grievance/StatusTimeline';

export function AdminGrievanceDetailPage() {
  const { trackingId = '' } = useParams();
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ['admin', 'grievance', trackingId],
    queryFn: () => fetchGrievanceAdmin(trackingId),
    retry: false,
  });

  const [status, setStatus] = useState<GrievanceStatus | ''>('');
  const [note, setNote] = useState('');
  const [assignee, setAssignee] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (input: AdminUpdateGrievanceInput) => updateGrievanceAdmin(trackingId, input),
    onSuccess: () => {
      setNote('');
      setStatus('');
      void qc.invalidateQueries({ queryKey: ['admin', 'grievance', trackingId] });
      void qc.invalidateQueries({ queryKey: ['admin', 'grievances'] });
    },
    onError: (e) => setError(e instanceof ApiRequestError ? e.message : 'Could not save.'),
  });

  const g = query.data?.grievance;

  return (
    <div>
      <Link to="/admin/grievances" className="text-sm text-primary underline">
        ← All grievances
      </Link>

      <QueryBoundary
        isLoading={query.isLoading}
        isError={query.isError}
        onRetry={() => void query.refetch()}
      >
        {g && (
          <div className="mt-4 grid gap-10 lg:grid-cols-[1fr_20rem]">
            <div>
              <h2 className="font-mono text-xl font-semibold text-ink">{g.trackingId}</h2>
              <p className="mt-1 text-sm text-ink-2">
                {g.category.toLowerCase().replace(/_/g, ' ')} · filed{' '}
                {new Date(g.createdAt).toLocaleDateString()}
                {g.district ? ` · ${g.district}` : ''}
                {g.state ? `, ${g.state}` : ''}
                {g.contactPhone ? ` · ${g.contactPhone}` : ''}
              </p>

              <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-ink">{g.description}</p>

              {g.attachments.length > 0 && (
                <ul className="mt-4 space-y-1 text-sm">
                  {g.attachments.map((a) => (
                    <li key={a.id}>
                      <a
                        href={attachmentUrl(a.id)}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-primary underline"
                      >
                        {a.originalName}
                      </a>{' '}
                      <span className="text-ink-2">({Math.round(a.sizeBytes / 1024)} KB)</span>
                    </li>
                  ))}
                </ul>
              )}

              <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-ink-2">
                History
              </h3>
              <div className="mt-4">
                <StatusTimeline status={g.status} timeline={g.timeline} />
              </div>
            </div>

            <aside>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-2">
                Record an update
              </h3>
              <form
                className="mt-4 space-y-4 text-sm"
                onSubmit={(e) => {
                  e.preventDefault();
                  setError(null);
                  const input: AdminUpdateGrievanceInput = {};
                  if (status) input.status = status;
                  if (note.trim()) input.note = note.trim();
                  if (assignee.trim()) input.assigneeEmail = assignee.trim();
                  if (Object.keys(input).length === 0) return;
                  mutation.mutate(input);
                }}
              >
                {error && <p className="text-error">{error}</p>}

                <label className="block">
                  Change status
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as GrievanceStatus | '')}
                    className="mt-1 min-h-[2.5rem] w-full rounded border border-line bg-panel px-2"
                  >
                    <option value="">Keep {g.status.toLowerCase().replace(/_/g, ' ')}</option>
                    {GRIEVANCE_LIFECYCLE.map((s) => (
                      <option key={s} value={s}>
                        {s.toLowerCase().replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  Note for the applicant
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    className="mt-1 w-full rounded border border-line bg-panel px-3 py-2"
                  />
                </label>

                <label className="block">
                  Assign to (admin email)
                  <input
                    type="email"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    placeholder={g.isOwner ? '' : 'officer@example.org'}
                    className="mt-1 min-h-[2.5rem] w-full rounded border border-line bg-panel px-3"
                  />
                </label>

                <button type="submit" className="btn-primary w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Saving…' : 'Save update'}
                </button>
              </form>
            </aside>
          </div>
        )}
      </QueryBoundary>
    </div>
  );
}

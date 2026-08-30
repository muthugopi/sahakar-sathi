import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { GrievanceStatus, UpdateGrievanceStatusInput } from '@sahakar/shared';
import { GRIEVANCE_LIFECYCLE } from '@sahakar/shared';
import {
  attachmentUrl,
  isDetail,
  listMyGrievances,
  trackGrievance,
  updateGrievanceStatus,
} from '../lib/grievance';
import { useAuth } from '../lib/auth';
import { QueryBoundary } from '../components/QueryBoundary';
import { StatusTimeline } from '../components/grievance/StatusTimeline';
import { StatusBadge } from '../components/grievance/StatusBadge';

export function TrackGrievancePage() {
  const { t } = useTranslation();
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const { status: authStatus } = useAuth();
  const [input, setInput] = useState('');

  if (!trackingId) {
    return (
      <div className="container-page max-w-2xl py-10 sm:py-12">
        <div className="section-shell p-6 sm:p-7">
          <h1 className="text-3xl tracking-[-0.05em] text-field-deep sm:text-4xl">{t('grievance.trackTitle')}</h1>
          <p className="mt-3 text-base text-muted">{t('grievance.trackIntro')}</p>

          <form
            className="mt-6 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              const id = input.trim().toUpperCase();
              if (id) navigate(`/track/${encodeURIComponent(id)}`);
            }}
          >
            <label htmlFor="tracking" className="sr-only">
              {t('grievance.trackingIdLabel')}
            </label>
            <input
              id="tracking"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="GRV-XXXXXXXX"
              className="min-h-[3rem] flex-1 rounded-2xl border border-line bg-panel px-3.5 py-2.5 font-mono text-base uppercase shadow-sm"
              autoComplete="off"
            />
            <button type="submit" className="btn-primary">
              {t('grievance.trackButton')}
            </button>
          </form>

          <p className="mt-6 text-sm">
            <Link to="/grievance" className="font-medium text-field-deep underline">
              {t('grievance.noIdYet')}
            </Link>
          </p>
        </div>

        {authStatus === 'authenticated' && <MyGrievances />}
      </div>
    );
  }

  return <TrackResult trackingId={trackingId} />;
}

function MyGrievances() {
  const { t } = useTranslation();
  const query = useQuery({ queryKey: ['grievances', 'mine'], queryFn: listMyGrievances });

  if (!query.data || query.data.grievances.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="eyebrow mb-3">{t('grievance.mineTitle')}</h2>
      <ul className="space-y-3">
        {query.data.grievances.map((g) => (
          <li key={g.trackingId}>
            <Link
              to={`/track/${g.trackingId}`}
              className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-line bg-panel p-4 shadow-sm transition-colors hover:border-field/20 hover:bg-soft"
            >
              <div className="min-w-0">
                <span className="font-mono text-sm font-semibold text-field-deep">{g.trackingId}</span>
                <p className="mt-1 text-sm text-muted">{t(`grievance.category.${g.category}`)}</p>
              </div>
              <StatusBadge status={g.status} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TrackResult({ trackingId }: { trackingId: string }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const query = useQuery({
    queryKey: ['grievance', trackingId],
    queryFn: () => trackGrievance(trackingId),
    retry: false,
  });

  const grievance = query.data?.grievance;

  return (
    <div className="container-page max-w-5xl py-8 sm:py-10">
      <Link to="/track" className="inline-flex items-center gap-2 text-sm font-semibold text-field-deep hover:text-field">
        ← {t('grievance.trackAnother')}
      </Link>

      <QueryBoundary
        isLoading={query.isLoading}
        isError={query.isError}
        onRetry={() => void query.refetch()}
      >
        {grievance && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="section-shell p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="font-mono text-2xl font-bold tracking-[0.12em] text-field-deep">{grievance.trackingId}</h1>
                <StatusBadge status={grievance.status} />
              </div>
              <p className="mt-3 text-base text-muted">{t(`grievance.category.${grievance.category}`)}</p>
              <p className="mt-1 text-sm text-muted">
                {t('grievance.filedOn', { date: new Date(grievance.createdAt).toLocaleDateString() })}
              </p>

              {isDetail(grievance) && (
                <div className="mt-6 rounded-[1.5rem] border border-line bg-soft p-4">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted">Description</p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-ink">{grievance.description}</p>
                  {grievance.attachments.length > 0 && (
                    <ul className="mt-4 space-y-2 text-sm">
                      {grievance.attachments.map((a) => (
                        <li key={a.id}>
                          <a
                            href={attachmentUrl(a.id)}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-2 font-medium text-field-deep underline"
                          >
                            📎 {a.originalName}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <h2 className="mt-8 mb-4 text-lg font-semibold text-field-deep">{t('grievance.progressTitle')}</h2>
              <StatusTimeline status={grievance.status} timeline={grievance.timeline} />
            </div>

            <aside className="space-y-4">
              {isAdmin && <AdminControls trackingId={grievance.trackingId} status={grievance.status} />}
            </aside>
          </div>
        )}
      </QueryBoundary>
    </div>
  );
}

function AdminControls({ trackingId, status }: { trackingId: string; status: GrievanceStatus }) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [next, setNext] = useState<GrievanceStatus>(status);
  const [note, setNote] = useState('');

  const mutation = useMutation({
    mutationFn: (input: UpdateGrievanceStatusInput) => updateGrievanceStatus(trackingId, input),
    onSuccess: () => {
      setNote('');
      void qc.invalidateQueries({ queryKey: ['grievance', trackingId] });
    },
  });

  return (
    <form
      className="section-shell p-5"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate({ status: next, ...(note.trim() ? { note: note.trim() } : {}) });
      }}
    >
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted">{t('grievance.adminTitle')}</p>
      <div className="mt-3 flex flex-col gap-3">
        <select
          value={next}
          onChange={(e) => setNext(e.target.value as GrievanceStatus)}
          className="min-h-[2.75rem] rounded-2xl border border-line bg-panel px-3 text-sm"
        >
          {GRIEVANCE_LIFECYCLE.map((s) => (
            <option key={s} value={s}>
              {t(`grievance.status.${s}`)}
            </option>
          ))}
        </select>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t('grievance.adminNote')}
          className="min-h-[2.75rem] rounded-2xl border border-line bg-panel px-3 text-sm"
        />
        <button type="submit" className="btn-primary" disabled={mutation.isPending}>
          {t('grievance.adminUpdate')}
        </button>
      </div>
      {mutation.isError && (
        <p className="mt-2 text-sm text-clay">
          {mutation.error instanceof Error ? mutation.error.message : t('common.errorTitle')}
        </p>
      )}
    </form>
  );
}

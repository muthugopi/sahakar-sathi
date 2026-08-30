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
import { Breadcrumbs } from '../components/Breadcrumbs';
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
      <div className="container-page max-w-prose">
        <Breadcrumbs trail={[{ label: t('grievance.trackTitle') }]} />
        <h1 className="text-3xl sm:text-4xl">{t('grievance.trackTitle')}</h1>
        <p className="mt-4 text-lg text-ink-2">{t('grievance.trackIntro')}</p>

        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            const id = input.trim().toUpperCase();
            if (id) navigate(`/track/${encodeURIComponent(id)}`);
          }}
        >
          <label htmlFor="tracking" className="field-label text-lg">
            {t('grievance.trackingIdLabel')}
          </label>
          <input
            id="tracking"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="GRV-XXXXXXXX"
            className="field-shell mt-2 font-mono uppercase"
            autoComplete="off"
          />
          <div className="mt-4">
            <button type="submit" className="btn-primary">
              {t('grievance.trackButton')}
            </button>
          </div>
        </form>

        <p className="mt-6">
          <Link to="/grievance" className="font-bold">
            {t('grievance.noIdYet')}
          </Link>
        </p>

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
    <section className="mt-12">
      <h2 className="text-xl">{t('grievance.mineTitle')}</h2>
      <ul className="register mt-4">
        {query.data.grievances.map((g) => (
          <li key={g.trackingId}>
            <Link to={`/track/${g.trackingId}`} className="register-row block py-4">
              <span className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono font-bold text-primary underline">{g.trackingId}</span>
                <StatusBadge status={g.status} />
              </span>
              <span className="mt-1 block text-ink-2">{t(`grievance.category.${g.category}`)}</span>
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
    <div className="container-page max-w-prose">
      <p className="mb-6">
        <Link to="/track" className="font-bold">
          {t('grievance.trackAnother')}
        </Link>
      </p>

      <QueryBoundary
        isLoading={query.isLoading}
        isError={query.isError}
        onRetry={() => void query.refetch()}
      >
        {grievance && (
          <>
            <h1 className="font-mono text-2xl font-bold tracking-widest text-ink sm:text-3xl">
              {grievance.trackingId}
            </h1>
            <p className="mt-3">
              <StatusBadge status={grievance.status} />
            </p>
            <p className="mt-3 text-ink-2">
              {t(`grievance.category.${grievance.category}`)} ·{' '}
              {t('grievance.filedOn', {
                date: new Date(grievance.createdAt).toLocaleDateString(),
              })}
            </p>

            {isDetail(grievance) && (
              <div className="inset mt-6">
                <p className="font-bold">{t('grievance.descriptionLabel')}</p>
                <p className="mt-2 whitespace-pre-wrap">{grievance.description}</p>
                {grievance.attachments.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {grievance.attachments.map((a) => (
                      <li key={a.id}>
                        <a
                          href={attachmentUrl(a.id)}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="font-bold"
                        >
                          {a.originalName}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <h2 className="mt-10 text-xl">{t('grievance.progressTitle')}</h2>
            <div className="mt-4">
              <StatusTimeline status={grievance.status} timeline={grievance.timeline} />
            </div>

            {isAdmin && <AdminControls trackingId={grievance.trackingId} status={grievance.status} />}
          </>
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
      className="mt-14 border-t border-line pt-8"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate({ status: next, ...(note.trim() ? { note: note.trim() } : {}) });
      }}
    >
      <h2 className="text-xl">{t('grievance.adminTitle')}</h2>
      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="admin-status" className="field-label">
            {t('grievance.adminSetStatus')}
          </label>
          <select
            id="admin-status"
            value={next}
            onChange={(e) => setNext(e.target.value as GrievanceStatus)}
            className="field-shell mt-2"
          >
            {GRIEVANCE_LIFECYCLE.map((s) => (
              <option key={s} value={s}>
                {t(`grievance.status.${s}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="admin-note" className="field-label">
            {t('grievance.adminNote')}
          </label>
          <input
            id="admin-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="field-shell mt-2"
          />
        </div>
        <button type="submit" className="btn-primary" disabled={mutation.isPending}>
          {t('grievance.adminUpdate')}
        </button>
      </div>
      {mutation.isError && (
        <p className="mt-2 font-bold text-error">
          {mutation.error instanceof Error ? mutation.error.message : t('common.errorTitle')}
        </p>
      )}
    </form>
  );
}

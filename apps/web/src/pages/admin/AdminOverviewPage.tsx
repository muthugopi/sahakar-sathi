import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { AdminAnalytics } from '@sahakar/shared';
import { fetchAnalytics } from '../../lib/admin';
import { QueryBoundary } from '../../components/QueryBoundary';

const LANG_NAME: Record<string, string> = { en: 'English', ta: 'Tamil', hi: 'Hindi' };

export function AdminOverviewPage() {
  const query = useQuery({ queryKey: ['admin', 'analytics'], queryFn: fetchAnalytics });

  return (
    <QueryBoundary
      isLoading={query.isLoading}
      isError={query.isError}
      onRetry={() => void query.refetch()}
    >
      {query.data && <Overview data={query.data} />}
    </QueryBoundary>
  );
}

function Overview({ data }: { data: AdminAnalytics }) {
  const figures = [
    { label: 'Members', value: data.users.total, note: `+${data.users.last7Days} this week` },
    { label: 'Conversations', value: data.conversations.total, note: `+${data.conversations.last7Days} this week` },
    { label: 'Open grievances', value: data.grievances.open, note: `${data.grievances.total} total` },
    { label: 'Knowledge documents', value: data.knowledge.total, note: `${data.knowledge.unverified} unverified` },
  ];

  const msgTotal = data.messages.total || 1;
  const langRows = Object.entries(data.messages.byLanguage).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-12">
      <section>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
          {figures.map((f) => (
            <div key={f.label}>
              <dd className="text-3xl font-semibold tabular-nums text-ink">{f.value}</dd>
              <dt className="mt-1 text-sm text-ink">{f.label}</dt>
              <p className="text-xs text-ink-2">{f.note}</p>
            </div>
          ))}
        </dl>
      </section>

      <section className="grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-2">Grievances by status</h2>
          <table className="mt-3 w-full text-sm">
            <tbody>
              {Object.entries(data.grievances.byStatus).map(([status, n]) => (
                <tr key={status} className="border-b border-line last:border-0">
                  <td className="py-2 text-ink">{status.replace(/_/g, ' ').toLowerCase()}</td>
                  <td className="py-2 text-right tabular-nums">{n}</td>
                </tr>
              ))}
              {Object.keys(data.grievances.byStatus).length === 0 && (
                <tr>
                  <td className="py-2 text-ink-2">No grievances yet.</td>
                </tr>
              )}
            </tbody>
          </table>
          <Link to="/admin/grievances" className="mt-3 inline-block text-sm text-primary underline">
            Manage grievances
          </Link>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-2">Languages used</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {langRows.map(([lang, n]) => (
              <li key={lang}>
                <div className="flex justify-between">
                  <span>{LANG_NAME[lang] ?? lang}</span>
                  <span className="tabular-nums text-ink-2">{Math.round((n / msgTotal) * 100)}%</span>
                </div>
                <div className="mt-1 h-1 bg-line">
                  <div className="h-1 bg-primary" style={{ width: `${(n / msgTotal) * 100}%` }} />
                </div>
              </li>
            ))}
            {langRows.length === 0 && <li className="text-ink-2">No messages yet.</li>}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-2">
          Most asked questions
        </h2>
        {data.topQuestions.length === 0 ? (
          <p className="mt-3 text-sm text-ink-2">Not enough conversation data yet.</p>
        ) : (
          <ol className="mt-3 space-y-2 text-sm">
            {data.topQuestions.map((q) => (
              <li key={q.text} className="flex gap-3 border-b border-line pb-2 last:border-0">
                <span className="tabular-nums text-ink-2">{q.count}×</span>
                <span className="text-ink">{q.text}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      {data.recentDownvotes.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-2">
            Recent unhelpful answers
          </h2>
          <ul className="mt-3 space-y-4 text-sm">
            {data.recentDownvotes.map((d) => (
              <li key={d.messageId} className="border-b border-line pb-3 last:border-0">
                <p className="text-ink">{d.content}</p>
                {d.comment && <p className="mt-1 text-ink-2">“{d.comment}”</p>}
                <p className="mt-1 text-xs text-ink-2">
                  {new Date(d.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="text-sm text-ink-2">
        <span className="tabular-nums">{data.feedback.up}</span> helpful ·{' '}
        <span className="tabular-nums">{data.feedback.down}</span> unhelpful ·{' '}
        <span className="tabular-nums">{data.schemes.verified}</span>/{data.schemes.total} schemes verified
      </section>
    </div>
  );
}

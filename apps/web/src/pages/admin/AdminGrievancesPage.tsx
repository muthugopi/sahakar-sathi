import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GRIEVANCE_CATEGORIES, GRIEVANCE_LIFECYCLE } from '@sahakar/shared';
import { fetchGrievancesAdmin } from '../../lib/admin';
import { QueryBoundary } from '../../components/QueryBoundary';
import { StatusBadge } from '../../components/grievance/StatusBadge';

export function AdminGrievancesPage() {
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [q, setQ] = useState('');

  const query = useQuery({
    queryKey: ['admin', 'grievances', { status, category, q }],
    queryFn: () =>
      fetchGrievancesAdmin({
        status: status || undefined,
        category: category || undefined,
        q: q || undefined,
      }),
  });

  return (
    <div>
      <h2 className="font-display text-2xl">Grievances</h2>
      <p className="mt-1 text-sm text-ink-2">
        Every grievance filed through the platform. Open one to record progress.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tracking ID, text, district"
          className="field-input min-h-[2.5rem] w-56 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="field-input min-h-[2.5rem] w-auto py-2 text-sm"
        >
          <option value="">Any status</option>
          {GRIEVANCE_LIFECYCLE.map((s) => (
            <option key={s} value={s}>
              {s.toLowerCase().replace(/_/g, ' ')}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="field-input min-h-[2.5rem] w-auto py-2 text-sm"
        >
          <option value="">Any category</option>
          {GRIEVANCE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.toLowerCase().replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      <QueryBoundary
        isLoading={query.isLoading}
        isError={query.isError}
        onRetry={() => void query.refetch()}
      >
        <div className="table-scroll mt-6">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Category</th>
                <th>District</th>
                <th>Assignee</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {query.data?.grievances.map((g) => (
                <tr key={g.trackingId} className="hover:bg-primary-tint/30">
                  <td>
                    <Link
                      to={`/admin/grievances/${g.trackingId}`}
                      className="font-mono font-semibold text-primary"
                    >
                      {g.trackingId}
                    </Link>
                  </td>
                  <td className="text-ink-2">{g.category.toLowerCase().replace(/_/g, ' ')}</td>
                  <td className="text-ink-2">{g.district ?? '—'}</td>
                  <td className="text-ink-2">{g.assignee ?? '—'}</td>
                  <td>
                    <StatusBadge status={g.status} />
                  </td>
                  <td className="whitespace-nowrap text-ink-2">
                    {new Date(g.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {query.data && query.data.grievances.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-ink-2">
                    No grievances match.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </QueryBoundary>
    </div>
  );
}

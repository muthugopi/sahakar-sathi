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
      <h2 className="text-lg font-semibold text-ink">Grievances</h2>
      <p className="mt-1 text-sm text-muted">
        Every grievance filed through the platform. Open one to record progress.
      </p>

      <div className="mt-6 flex flex-wrap gap-3 border-y border-line py-3 text-sm">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tracking ID, text, district"
          className="min-h-[2.5rem] rounded border border-line bg-panel px-3"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="min-h-[2.5rem] rounded border border-line bg-panel px-2"
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
          className="min-h-[2.5rem] rounded border border-line bg-panel px-2"
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
        <div className="overflow-x-auto">
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="py-2 pe-4 font-medium">Tracking ID</th>
                <th className="py-2 pe-4 font-medium">Category</th>
                <th className="py-2 pe-4 font-medium">District</th>
                <th className="py-2 pe-4 font-medium">Assignee</th>
                <th className="py-2 pe-4 font-medium">Status</th>
                <th className="py-2 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {query.data?.grievances.map((g) => (
                <tr key={g.trackingId} className="border-b border-line">
                  <td className="py-3 pe-4">
                    <Link
                      to={`/admin/grievances/${g.trackingId}`}
                      className="font-mono text-field-deep underline"
                    >
                      {g.trackingId}
                    </Link>
                  </td>
                  <td className="py-3 pe-4 text-muted">
                    {g.category.toLowerCase().replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 pe-4 text-muted">{g.district ?? '—'}</td>
                  <td className="py-3 pe-4 text-muted">{g.assignee ?? '—'}</td>
                  <td className="py-3 pe-4">
                    <StatusBadge status={g.status} />
                  </td>
                  <td className="py-3 text-muted">{new Date(g.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {query.data && query.data.grievances.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-muted">
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

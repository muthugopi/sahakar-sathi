import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SchemeAdmin } from '@sahakar/shared';
import { archiveScheme, fetchSchemesAdmin, verifyScheme } from '../../lib/admin';
import { QueryBoundary } from '../../components/QueryBoundary';

export function AdminSchemesPage() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['admin', 'schemes'], queryFn: fetchSchemesAdmin });
  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ['admin', 'schemes'] });
    void qc.invalidateQueries({ queryKey: ['admin', 'analytics'] });
  };

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">Schemes</h2>
          <p className="mt-1 text-sm text-ink-2">
            Structured scheme pages. Verified schemes appear in the explorer and ground the assistant.
          </p>
        </div>
        <Link to="/admin/schemes/new" className="btn-primary h-10 min-h-0 shrink-0 px-4 text-sm">
          New scheme
        </Link>
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
                <th>Title</th>
                <th>Scope</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {query.data?.schemes.map((s) => (
                <SchemeRow key={s.slug} scheme={s} onChange={invalidate} />
              ))}
              {query.data && query.data.schemes.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-ink-2">
                    No schemes yet.
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

function SchemeRow({ scheme, onChange }: { scheme: SchemeAdmin; onChange: () => void }) {
  const verify = useMutation({
    mutationFn: (v: boolean) => verifyScheme(scheme.slug, v),
    onSuccess: onChange,
  });
  const archive = useMutation({
    mutationFn: (v: boolean) => archiveScheme(scheme.slug, v),
    onSuccess: onChange,
  });

  return (
    <tr className="hover:bg-primary-tint/30">
      <td>
        <Link to={`/admin/schemes/${scheme.slug}`} className="font-medium text-ink">
          {scheme.title}
        </Link>
        {scheme.isArchived && <span className="ms-2 text-xs text-ink-2">archived</span>}
      </td>
      <td className="whitespace-nowrap text-ink-2">{scheme.state ?? 'All India'}</td>
      <td>
        {scheme.isVerified ? (
          <span className="font-medium text-ok">verified</span>
        ) : (
          <span className="font-medium text-accent">draft</span>
        )}
      </td>
      <td>
        <div className="flex gap-3 whitespace-nowrap">
          <button
            type="button"
            onClick={() => verify.mutate(!scheme.isVerified)}
            disabled={verify.isPending}
            className="text-primary underline"
          >
            {scheme.isVerified ? 'Unverify' : 'Verify'}
          </button>
          <button
            type="button"
            onClick={() => archive.mutate(!scheme.isArchived)}
            disabled={archive.isPending}
            className="text-error underline"
          >
            {scheme.isArchived ? 'Restore' : 'Archive'}
          </button>
        </div>
      </td>
    </tr>
  );
}

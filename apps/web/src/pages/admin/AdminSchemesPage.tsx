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
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink">Schemes</h2>
          <p className="mt-1 text-sm text-muted">
            Structured scheme pages. Verified schemes appear in the explorer and ground the assistant.
          </p>
        </div>
        <Link to="/admin/schemes/new" className="text-sm font-medium text-field-deep underline">
          New scheme
        </Link>
      </div>

      <QueryBoundary
        isLoading={query.isLoading}
        isError={query.isError}
        onRetry={() => void query.refetch()}
      >
        <div className="overflow-x-auto">
          <table className="mt-6 w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="py-2 pe-4 font-medium">Title</th>
                <th className="py-2 pe-4 font-medium">Scope</th>
                <th className="py-2 pe-4 font-medium">Status</th>
                <th className="py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {query.data?.schemes.map((s) => (
                <SchemeRow key={s.slug} scheme={s} onChange={invalidate} />
              ))}
              {query.data && query.data.schemes.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-muted">
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
    <tr className="border-b border-line">
      <td className="py-3 pe-4">
        <Link to={`/admin/schemes/${scheme.slug}`} className="text-ink underline">
          {scheme.title}
        </Link>
        {scheme.isArchived && <span className="ms-2 text-xs text-muted">archived</span>}
      </td>
      <td className="py-3 pe-4 text-muted">{scheme.state ?? 'All India'}</td>
      <td className="py-3 pe-4">
        {scheme.isVerified ? (
          <span className="text-field-deep">verified</span>
        ) : (
          <span className="text-clay">draft</span>
        )}
      </td>
      <td className="py-3">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => verify.mutate(!scheme.isVerified)}
            disabled={verify.isPending}
            className="text-field-deep underline"
          >
            {scheme.isVerified ? 'Unverify' : 'Verify'}
          </button>
          <button
            type="button"
            onClick={() => archive.mutate(!scheme.isArchived)}
            disabled={archive.isPending}
            className="text-clay underline"
          >
            {scheme.isArchived ? 'Restore' : 'Archive'}
          </button>
        </div>
      </td>
    </tr>
  );
}

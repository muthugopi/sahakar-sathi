import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { SchemeSummary } from '@sahakar/shared';

export function SchemeCard({ scheme }: { scheme: SchemeSummary }) {
  const { t } = useTranslation();
  return (
    <Link
      to={`/schemes/${scheme.slug}`}
      className="block rounded-lg border border-line bg-panel p-4 transition-colors hover:bg-field-wash"
    >
      <p className="font-semibold text-field-deep">{scheme.title}</p>
      <p className="mt-1 text-sm text-muted">{scheme.summary}</p>
      <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
        <span className="rounded border border-line px-2 py-0.5">
          {scheme.state ?? t('schemes.national')}
        </span>
        {scheme.targetUsers.slice(0, 3).map((u) => (
          <span key={u} className="rounded border border-line px-2 py-0.5 text-muted">
            {u}
          </span>
        ))}
      </div>
    </Link>
  );
}

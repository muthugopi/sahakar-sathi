import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { SchemeSummary } from '@sahakar/shared';

export function SchemeCard({ scheme }: { scheme: SchemeSummary }) {
  const { t } = useTranslation();
  return (
    <Link
      to={`/schemes/${scheme.slug}`}
      className="group block h-full border-t border-line bg-panel px-0 py-4 transition-colors hover:bg-soft"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
            {scheme.state ?? t('schemes.national')}
          </p>
          <p className="mt-3 text-xl font-semibold tracking-[-0.05em] text-field-deep">{scheme.title}</p>
        </div>
        <span aria-hidden className="text-xl font-medium text-field-deep transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{scheme.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {scheme.targetUsers.slice(0, 3).map((u) => (
          <span key={u} className="border-b border-line px-1.5 pb-0.5 text-[0.68rem] font-medium uppercase tracking-[0.08em] text-muted">
            {u}
          </span>
        ))}
      </div>
    </Link>
  );
}

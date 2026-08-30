import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { SchemeSummary } from '@sahakar/shared';

/** One row in the scheme list — plain flow, no card. */
export function SchemeCard({ scheme }: { scheme: SchemeSummary }) {
  const { t } = useTranslation();
  return (
    <Link to={`/schemes/${scheme.slug}`} className="register-row block py-4">
      <span className="block text-lg font-bold text-primary underline">{scheme.title}</span>
      <span className="mt-1 block text-ink-2">{scheme.summary}</span>
      <span className="mt-2 block text-sm text-ink-2">
        {scheme.state ?? t('schemes.national')} · {scheme.targetUsers.join(', ')}
      </span>
    </Link>
  );
}

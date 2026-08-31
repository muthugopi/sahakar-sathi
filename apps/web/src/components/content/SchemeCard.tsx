import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { SchemeSummary } from '@sahakar/shared';
import { Icon } from '../Icon';

/** One large row in the scheme explorer — editorial, not a card. */
export function SchemeCard({ scheme }: { scheme: SchemeSummary }) {
  const { t } = useTranslation();
  return (
    <Link
      to={`/schemes/${scheme.slug}`}
      className="group flex items-start gap-6 border-b border-line py-7 no-underline transition-colors hover:bg-primary-tint/30"
    >
      <span className="min-w-0">
        <span className="block font-display text-xl tracking-tight text-ink transition-colors group-hover:text-primary sm:text-2xl">
          {scheme.title}
        </span>
        <span className="mt-2 block max-w-prose text-ink-2">{scheme.summary}</span>
        <span className="mt-3 block text-sm text-ink-2">
          {scheme.state ?? t('schemes.national')} · {scheme.targetUsers.join(', ')}
        </span>
      </span>
      <Icon
        name="chevron"
        className="ms-auto mt-1.5 h-5 w-5 shrink-0 self-center text-ink-2 transition-transform duration-300 group-hover:translate-x-1.5"
      />
    </Link>
  );
}

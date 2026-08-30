import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Crumb {
  label: string;
  to?: string;
}

/** Quiet breadcrumb trail for inner pages. */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const { t } = useTranslation();
  const items: Crumb[] = [{ label: t('nav.home'), to: '/' }, ...trail];

  return (
    <nav aria-label="Breadcrumb" className="mb-8 text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-2">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-2">
              {c.to && !last ? (
                <Link to={c.to} className="font-medium no-underline hover:text-ink">
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined}>{c.label}</span>
              )}
              {!last && (
                <span aria-hidden className="text-ink-2/50">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Crumb {
  label: string;
  to?: string;
}

/** Simple, high-contrast breadcrumb trail for inner pages. */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const { t } = useTranslation();
  const items: Crumb[] = [{ label: t('nav.home'), to: '/' }, ...trail];

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-2">
              {c.to && !last ? (
                <Link to={c.to} className="font-bold">
                  {c.label}
                </Link>
              ) : (
                <span className={last ? 'text-muted' : ''}>{c.label}</span>
              )}
              {!last && <span aria-hidden className="text-muted">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

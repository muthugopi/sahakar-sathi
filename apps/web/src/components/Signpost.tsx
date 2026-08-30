import { Link } from 'react-router-dom';
import { Icon } from './Icon';

interface SignpostProps {
  to: string;
  label: string;
  sub?: string;
  icon?: string;
  /** Marks the recommended path — its label carries the brand colour. */
  primary?: boolean;
}

/** A quiet index row that points to a section of the service. */
export function Signpost({ to, label, sub, icon, primary }: SignpostProps) {
  const external = to.startsWith('http');
  const inner = (
    <>
      {icon && (
        <span className="mt-0.5 shrink-0 text-ink-2">
          <Icon name={icon} className="h-5 w-5" />
        </span>
      )}
      <span className="min-w-0">
        <span className="signpost-label">{label}</span>
        {sub && <span className="signpost-sub">{sub}</span>}
      </span>
      <Icon name="chevron" className="signpost-chevron h-4 w-4" />
    </>
  );
  const cls = `signpost${primary ? ' signpost--primary' : ''}`;

  return external ? (
    <a href={to} target="_blank" rel="noreferrer noopener" className={cls}>
      {inner}
    </a>
  ) : (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  );
}

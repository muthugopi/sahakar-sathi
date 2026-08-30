import { Link } from 'react-router-dom';
import { Icon } from './Icon';

interface SignpostProps {
  to: string;
  label: string;
  sub?: string;
  icon?: string;
  /** Marks the recommended path with an amber keyline. */
  primary?: boolean;
}

/** The signature element — a clear, colour-coded sign pointing to information. */
export function Signpost({ to, label, sub, icon, primary }: SignpostProps) {
  const external = to.startsWith('http');
  const inner = (
    <>
      {icon && (
        <span className="shrink-0 text-primary">
          <Icon name={icon} />
        </span>
      )}
      <span className="min-w-0">
        <span className="signpost-label block">{label}</span>
        {sub && <span className="signpost-sub block">{sub}</span>}
      </span>
      <Icon name="chevron" className="signpost-chevron h-5 w-5" />
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

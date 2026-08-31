import type { ElementType, ReactNode } from 'react';
import { useReveal } from '../lib/useReveal';

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Stagger index — each step adds ~70ms before the element eases in. */
  delay?: number;
  id?: string;
  'aria-labelledby'?: string;
}

/**
 * Wraps content in a scroll-triggered fade + rise. Purely presentational —
 * content is always in the DOM and readable with motion disabled.
 */
export function Reveal({ children, as, className = '', delay = 0, ...rest }: RevealProps) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useReveal<HTMLElement>();
  const style = delay ? { transitionDelay: `${delay * 70}ms` } : undefined;
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={style} {...rest}>
      {children}
    </Tag>
  );
}

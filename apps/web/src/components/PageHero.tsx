import type { ReactNode } from 'react';

/**
 * The opening band of an inner page: an eyebrow, a large serif title, and a
 * lead paragraph, with generous space above and below. Its job is the same on
 * every page — orient the reader — so it is deliberately reused; the pages
 * differ in what follows it.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  size = 'default',
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
  size?: 'default' | 'large';
}) {
  return (
    <header className="container-wide pb-10 pt-14 sm:pb-14 sm:pt-20">
      {eyebrow && <p className="eyebrow reveal is-revealed">{eyebrow}</p>}
      <h1
        className={`reveal is-revealed mt-4 font-display tracking-tight text-ink ${
          size === 'large'
            ? 'text-[2.5rem] leading-[1.06] sm:text-6xl lg:text-7xl'
            : 'text-4xl leading-[1.08] sm:text-5xl'
        }`}
      >
        {title}
      </h1>
      {lead && (
        <p className="measure-wide reveal is-revealed mt-6 text-lg text-ink-2 sm:text-xl">{lead}</p>
      )}
      {children && <div className="mt-8">{children}</div>}
    </header>
  );
}

import { useEffect, useRef } from 'react';

/**
 * Adds `is-revealed` to the element the first time it scrolls into view.
 * Pair with the `.reveal` class (see index.css) for a subtle fade + rise.
 * `prefers-reduced-motion` is handled in CSS — the element is simply visible.
 *
 * Belt-and-suspenders: elements already on screen at mount reveal immediately,
 * and a safety timer reveals anything still hidden after 1.5s so content is
 * never stuck invisible.
 *
 *   const ref = useReveal<HTMLDivElement>();
 *   <section ref={ref} className="reveal">…</section>
 */
export function useReveal<T extends HTMLElement = HTMLElement>(options?: {
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => el.classList.add('is-revealed');

    if (typeof IntersectionObserver === 'undefined') {
      show();
      return;
    }

    // Already visible (or above) at mount — reveal now, no animation-in needed.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      show();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: options?.threshold ?? 0.12, rootMargin: options?.rootMargin ?? '0px 0px -6% 0px' },
    );
    io.observe(el);

    const safety = window.setTimeout(show, 1000);

    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, [options?.threshold, options?.rootMargin]);

  return ref;
}

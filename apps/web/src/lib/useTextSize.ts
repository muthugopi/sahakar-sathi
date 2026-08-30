import { useCallback, useEffect, useState } from 'react';

const KEY = 'sahakar.textSize';
const STEPS = [100, 112.5, 125, 140] as const;
export type TextSizeStep = (typeof STEPS)[number];

function apply(pct: number) {
  document.documentElement.style.fontSize = `${pct}%`;
}

/**
 * A page-level text-size control for older / low-vision users. Scales the root
 * font size; everything is in rem so the whole interface grows. Persisted.
 */
export function useTextSize() {
  const [pct, setPct] = useState<number>(() => {
    try {
      const saved = Number(localStorage.getItem(KEY));
      return STEPS.includes(saved as TextSizeStep) ? saved : 100;
    } catch {
      return 100;
    }
  });

  useEffect(() => {
    apply(pct);
    try {
      localStorage.setItem(KEY, String(pct));
    } catch {
      /* ignore */
    }
  }, [pct]);

  const index = STEPS.indexOf(pct as TextSizeStep);
  const larger = useCallback(() => setPct(STEPS[Math.min(index + 1, STEPS.length - 1)]!), [index]);
  const smaller = useCallback(() => setPct(STEPS[Math.max(index - 1, 0)]!), [index]);
  const reset = useCallback(() => setPct(100), []);

  return { pct, larger, smaller, reset, canGrow: index < STEPS.length - 1, canShrink: index > 0 };
}

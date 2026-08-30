/**
 * One icon set — heavy strokes, signage weight. Used on signposts, the mobile
 * menu, and status. Not decorative, never beside a heading.
 */
const PATHS: Record<string, string> = {
  scheme: 'M4 6h16M4 12h16M4 18h10',
  assistant: 'M4 5h16v11H9l-5 4V5z',
  services: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 18l9 5 9-5',
  grievance: 'M12 3l9 16H3L12 3zm0 6v5m0 3h.01',
  knowledge: 'M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3V4zm3 5h8M8 13h8',
  track: 'M3 12h4l3-8 4 16 3-8h4',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  chevron: 'M9 5l7 7-7 7',
  check: 'M4 12l5 5L20 6',
};

export function Icon({
  name,
  className = 'h-7 w-7',
}: {
  name: keyof typeof PATHS | string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={PATHS[name] ?? PATHS.chevron} />
    </svg>
  );
}

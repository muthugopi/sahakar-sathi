/**
 * One small outline icon set (stroke 1.6, 24px). Used only on the quick-access
 * tiles and the mobile menu toggle — not beside headings.
 */
const PATHS: Record<string, string> = {
  scheme: 'M4 6h16M4 12h16M4 18h10',
  assistant: 'M4 5h16v10H8l-4 4V5z',
  services: 'M4 7l8-4 8 4-8 4-8-4zm0 5l8 4 8-4M4 17l8 4 8-4',
  grievance: 'M12 4l8 14H4L12 4zm0 6v4m0 3v.5',
  knowledge: 'M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3V4zm3 4h8M8 12h8',
  track: 'M4 12h4l3-7 4 14 3-7h2',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  chevron: 'M9 6l6 6-6 6',
};

export function Icon({ name, className = 'h-6 w-6' }: { name: keyof typeof PATHS | string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={PATHS[name] ?? PATHS.chevron} />
    </svg>
  );
}

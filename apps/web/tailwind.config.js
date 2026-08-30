/** @type {import('tailwindcss').Config}
 *
 * Premium-minimal system. Warm paper ground, one deep forest green, near-mono
 * ink. Hierarchy comes from space, type scale and a serif display voice — not
 * from borders or colour. Radii are soft; shadows are used two or three places
 * only. See docs/design-plan.md.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    borderRadius: {
      none: '0',
      sm: '6px',
      DEFAULT: '10px',
      md: '10px',
      lg: '14px',
      xl: '20px',
      full: '9999px',
    },
    boxShadow: {
      none: 'none',
      sm: '0 1px 2px 0 rgb(26 36 32 / 0.04)',
      DEFAULT: '0 1px 3px rgb(26 36 32 / 0.05), 0 14px 36px -18px rgb(26 36 32 / 0.16)',
      lg: '0 2px 6px rgb(26 36 32 / 0.05), 0 30px 60px -24px rgb(26 36 32 / 0.20)',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      bg: '#fbfbf9',
      panel: '#ffffff',
      ink: '#1a2420',
      'ink-2': '#4a5450',
      line: '#e5e6e1',
      primary: {
        DEFAULT: '#1f4d3a',
        hover: '#163a2b',
        tint: '#eef2ec',
      },
      accent: {
        DEFAULT: '#b23a1e',
        tint: '#f6eae5',
      },
      error: { DEFAULT: '#a82717', tint: '#f7e9e6' },
      ok: { DEFAULT: '#1f7a4d', tint: '#e7f1ec' },
      focus: '#3d7a5f',
    },
    fontFamily: {
      display: [
        '"Source Serif 4"',
        '"Noto Serif Devanagari"',
        '"Noto Serif Tamil"',
        'Georgia',
        'serif',
      ],
      sans: [
        '"Noto Sans"',
        '"Noto Sans Devanagari"',
        '"Noto Sans Tamil"',
        'system-ui',
        'sans-serif',
      ],
      mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    },
    fontSize: {
      xs: ['0.8125rem', { lineHeight: '1.5' }],
      sm: ['0.875rem', { lineHeight: '1.55' }],
      base: ['1.0625rem', { lineHeight: '1.65' }],
      lg: ['1.1875rem', { lineHeight: '1.6' }],
      xl: ['1.375rem', { lineHeight: '1.4' }],
      '2xl': ['1.625rem', { lineHeight: '1.25' }],
      '3xl': ['2rem', { lineHeight: '1.18' }],
      '4xl': ['2.5rem', { lineHeight: '1.1' }],
      '5xl': ['3.25rem', { lineHeight: '1.04' }],
      '6xl': ['4rem', { lineHeight: '1.02' }],
    },
    letterSpacing: {
      tighter: '-0.03em',
      tight: '-0.015em',
      normal: '0',
      wide: '0.02em',
      wider: '0.08em',
    },
    extend: {
      maxWidth: {
        container: '1120px',
        wide: '1280px',
        prose: '66ch',
        text: '36rem',
        form: '36rem',
      },
      minHeight: {
        touch: '2.75rem',
        btn: '3rem',
        row: '3.5rem',
      },
      minWidth: { touch: '2.75rem' },
      borderWidth: { 3: '3px' },
      transitionTimingFunction: {
        calm: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};

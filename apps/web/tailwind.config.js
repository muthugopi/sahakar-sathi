/** @type {import('tailwindcss').Config}
 *
 * Wayfinding system — see docs/design-plan.md. Fresh tokens, not an extension
 * of anything before. High-contrast, flat, teal + amber public-signage palette.
 * Tailwind's default 4px spacing scale is kept (it already is the restrained
 * 4·8·12·16·24·32·48·64 scale the plan calls for); the identity is colour,
 * type, the single radius, and the component primitives.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    borderRadius: {
      none: '0',
      DEFAULT: '2px',
      sm: '2px',
      md: '2px',
      lg: '2px',
      full: '9999px', // status dots only
    },
    boxShadow: { none: 'none' },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      bg: '#f3f5f4',
      panel: '#ffffff',
      ink: '#16211f',
      'ink-2': '#4c5754',
      line: '#d3d8d6',
      primary: {
        DEFAULT: '#0b4f4a',
        hover: '#083b37',
        tint: '#e7efee',
      },
      accent: {
        DEFAULT: '#c2610a',
        tint: '#f7ece0',
      },
      error: { DEFAULT: '#b42318', tint: '#fbeceb' },
      ok: { DEFAULT: '#0b7a3b', tint: '#e6f2ec' },
      focus: '#c2610a',
    },
    fontFamily: {
      display: ['"Archivo"', 'system-ui', 'sans-serif'],
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
      xs: ['0.8125rem', { lineHeight: '1.4' }],
      sm: ['0.9375rem', { lineHeight: '1.5' }],
      base: ['1.0625rem', { lineHeight: '1.6' }],
      lg: ['1.1875rem', { lineHeight: '1.5' }],
      xl: ['1.25rem', { lineHeight: '1.35' }],
      '2xl': ['1.5rem', { lineHeight: '1.25' }],
      '3xl': ['1.75rem', { lineHeight: '1.2' }],
      '4xl': ['2rem', { lineHeight: '1.15' }],
      '5xl': ['2.5rem', { lineHeight: '1.08' }],
    },
    extend: {
      maxWidth: {
        container: '1000px',
        prose: '62ch',
        form: '34rem',
      },
      minHeight: {
        touch: '3rem',
        btn: '3.25rem',
        row: '4rem',
      },
      minWidth: { touch: '3rem' },
      borderWidth: { 3: '3px' },
    },
  },
  plugins: [],
};

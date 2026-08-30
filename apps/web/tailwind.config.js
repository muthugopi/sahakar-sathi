/** @type {import('tailwindcss').Config}
 *
 * "Navy ink on paper" — the visual language of an official Indian cooperative
 * record (passbook / certificate / Registrar's notification): navy on cream-white
 * paper, gazette serif for headings, one restrained marigold accent, 4px radius,
 * flat surfaces. See docs/design-plan.md.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    borderRadius: {
      none: '0',
      DEFAULT: '4px',
      sm: '3px',
      md: '4px',
      lg: '4px',
      full: '9999px', // status dots only
    },
    boxShadow: {
      none: 'none',
      menu: '0 2px 8px rgba(23, 50, 77, 0.14)', // reserved for floating layers
    },
    extend: {
      colors: {
        ink: '#1b1b1f',
        muted: '#55565c',
        paper: '#fbfbf8',
        surface: '#f1f1ec',
        panel: '#ffffff',
        line: '#d3d3ca',
        primary: {
          DEFAULT: '#17324d',
          hover: '#0f2338',
          tint: '#eef2f6',
        },
        accent: {
          DEFAULT: '#c9772a',
          soft: '#f6ece1',
        },
        focus: '#ffdd00',
        error: '#b3261e',
        resolved: '#1f6f43',
        // aliases kept so components from the previous pass still resolve
        field: { DEFAULT: '#17324d', deep: '#17324d', text: '#0f2338', wash: '#eef2f6', soft: '#eef2f6' },
        clay: '#b3261e',
        marigold: '#c9772a',
      },
      fontFamily: {
        serif: ['"IBM Plex Serif"', 'Georgia', 'Cambria', 'serif'],
        sans: [
          '"IBM Plex Sans"',
          '"IBM Plex Sans Devanagari"',
          '"Noto Sans Tamil"',
          'system-ui',
          'sans-serif',
        ],
      },
      fontSize: {
        sm: ['0.9375rem', { lineHeight: '1.5' }],
        base: ['1.125rem', { lineHeight: '1.6' }],
        lg: ['1.1875rem', { lineHeight: '1.5' }],
        xl: ['1.25rem', { lineHeight: '1.4' }],
        '2xl': ['1.5rem', { lineHeight: '1.25' }],
        '3xl': ['1.75rem', { lineHeight: '1.2' }],
        '4xl': ['2rem', { lineHeight: '1.15' }],
        '5xl': ['2.5rem', { lineHeight: '1.1' }],
      },
      maxWidth: {
        container: '1080px',
        prose: '64ch',
        text: '38rem',
      },
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [],
};

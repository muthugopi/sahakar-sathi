/** @type {import('tailwindcss').Config}
 *
 * Government-service visual language (adapted from the GOV.UK Design System):
 * white page, near-black text, one green brand colour, yellow focus, square
 * corners, no decorative shadow. Tuned for older and low-literacy rural users —
 * large type, generous spacing, high contrast.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Deliberately small, restrained scale.
    borderRadius: {
      none: '0',
      DEFAULT: '0',
      sm: '0',
      md: '0',
      lg: '0',
      full: '9999px', // only for the language/status dots
    },
    boxShadow: {
      none: 'none',
      button: '0 3px 0 #00401d', // the pressed-button affordance
    },
    extend: {
      colors: {
        ink: '#0b0c0c', // primary text
        muted: '#505a54', // secondary text
        paper: '#ffffff', // page background
        panel: '#ffffff',
        soft: '#f3f2f1', // secondary surface / inset blocks
        line: '#a9b0ad', // borders / rules
        'line-strong': '#0b0c0c', // input borders
        field: {
          DEFAULT: '#00703c', // brand / primary button
          deep: '#005a30', // link, headings accent
          text: '#00461f', // link hover / pressed
          wash: '#e8f1ec', // faint green wash (used sparingly)
        },
        focus: '#ffdd00',
        marigold: '#d9a63a',
        clay: '#d4351c', // error / alert
        // legacy aliases still referenced by a few components
        'field-soft': '#e8f1ec',
        slate: '#eef1f0',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '"Segoe UI"',
          'Roboto',
          '"Noto Sans"',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        // base 19px / 1.32 line-height, matching GOV.UK body
        base: ['1.1875rem', { lineHeight: '1.45' }],
        lg: ['1.3125rem', { lineHeight: '1.4' }],
        xl: ['1.5rem', { lineHeight: '1.35' }],
        '2xl': ['1.6875rem', { lineHeight: '1.25' }],
        '3xl': ['2rem', { lineHeight: '1.15' }],
        '4xl': ['2.25rem', { lineHeight: '1.1' }],
      },
      maxWidth: {
        prose: '44rem', // ~66 character measure at 19px
        text: '38rem',
      },
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [],
};

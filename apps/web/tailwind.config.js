/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1c2321',
        muted: '#5b625c',
        paper: '#fbfaf6',
        panel: '#ffffff',
        line: '#ddd8c9',
        field: {
          DEFAULT: '#2f6b3f',
          deep: '#1d4429',
          wash: '#eef3ec',
        },
        marigold: '#e8a33d',
        clay: '#b5482f',
      },
      fontFamily: {
        // Rural Android ships Noto as the system UI font — no web-font download.
        sans: ['system-ui', '"Noto Sans"', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        // Slightly larger base for low-literacy / small-screen readability.
        base: ['1.0625rem', { lineHeight: '1.6' }],
        lg: ['1.1875rem', { lineHeight: '1.55' }],
      },
      borderRadius: {
        DEFAULT: '4px',
        lg: '6px',
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
};

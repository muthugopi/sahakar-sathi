/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#16201b',
        muted: '#5e6a64',
        paper: '#f4f1ea',
        panel: '#ffffff',
        soft: '#f8f6f2',
        line: '#dfe4dc',
        field: {
          DEFAULT: '#1d5d41',
          deep: '#143d2b',
          wash: '#edf5f1',
          soft: '#dfeee6',
        },
        marigold: '#d9a63a',
        clay: '#b9543c',
        slate: '#e8eef4',
        success: '#1c7a4d',
        warning: '#a9681c',
        danger: '#b84343',
      },
      fontFamily: {
        sans: ['"Inter"', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 8px 20px rgba(18, 27, 22, 0.04)',
        card: '0 10px 24px rgba(15, 27, 22, 0.05)',
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '10px',
        xl: '14px',
        '2xl': '18px',
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
};

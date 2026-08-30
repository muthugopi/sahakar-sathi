import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Low-bandwidth target: small initial chunk, offline-capable static content.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-32.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Sahakar Sathi — Cooperative Support',
        short_name: 'Sahakar Sathi',
        description:
          'Multilingual assistant for cooperative services, schemes, crop insurance and grievances.',
        lang: 'en',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#00703c',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        // Never let the SW serve a stale API response for auth/chat/grievance actions.
        navigateFallbackDenylist: [/^\/api\//],
        globPatterns: ['**/*.{js,css,html,woff2,png,svg}'],
        runtimeCaching: [
          {
            // Reference content — read after first visit, even offline.
            urlPattern: ({ url }) =>
              url.pathname.startsWith('/api/v1/content/') ||
              url.pathname.startsWith('/api/v1/schemes'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'sahakar-content',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 80, maxAgeSeconds: 7 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  optimizeDeps: { exclude: ['@sahakar/shared'] },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
});

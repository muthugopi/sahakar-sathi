import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './fonts';
import i18n from './i18n';
import './index.css';
import { App } from './App';
import { AuthProvider } from './lib/auth';
import { ensureScriptFont } from './fonts';

void ensureScriptFont(i18n.resolvedLanguage ?? 'en');
i18n.on('languageChanged', (lng) => void ensureScriptFont(lng));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);

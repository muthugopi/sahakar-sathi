import type { ReactNode } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';
import { useOnlineStatus } from '../lib/useOnlineStatus';

const NAV = [
  { to: '/assistant', key: 'nav.assistant' },
  { to: '/schemes', key: 'nav.schemes' },
  { to: '/cooperative', key: 'nav.cooperative' },
  { to: '/pmfby', key: 'nav.pmfby' },
  { to: '/money', key: 'nav.money' },
  { to: '/grievance', key: 'nav.grievance' },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const online = useOnlineStatus();

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50
                   focus:rounded focus:bg-field focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      {!online && (
        <div
          role="status"
          className="bg-marigold/25 px-4 py-2 text-center text-sm font-medium text-ink"
        >
          {t('common.offlineTitle')} — {t('common.offlineBody')}
        </div>
      )}

      <header className="border-b border-line bg-panel">
        <div className="container-page flex flex-wrap items-center gap-x-6 gap-y-3 py-3">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="text-xl font-semibold tracking-tight text-field-deep">
              {t('app.name')}
            </span>
            <span className="hidden text-xs uppercase tracking-[0.14em] text-muted sm:inline">
              Cooperative Support
            </span>
          </Link>
          <div className="ms-auto">
            <LanguageSelector id="lang-header" />
          </div>
        </div>

        <nav
          aria-label="Primary"
          className="border-t border-line bg-paper"
        >
          <ul className="container-page flex gap-1 overflow-x-auto py-1 text-[0.95rem]">
            {NAV.map((item) => (
              <li key={item.to} className="shrink-0">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `block rounded px-3 py-2 font-medium transition-colors ${
                      isActive
                        ? 'bg-field-wash text-field-deep'
                        : 'text-ink hover:bg-field-wash'
                    }`
                  }
                >
                  {t(item.key)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="mt-16 border-t border-line bg-panel">
        <div className="container-page grid gap-6 py-8 text-sm text-muted sm:grid-cols-[1fr_auto]">
          <p className="max-w-prose">{t('footer.disclaimer')}</p>
          <nav aria-label="Footer" className="flex gap-4">
            <Link to="/schemes" className="underline hover:text-field-deep">
              {t('footer.sources')}
            </Link>
            <Link to="/track" className="underline hover:text-field-deep">
              {t('nav.track')}
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

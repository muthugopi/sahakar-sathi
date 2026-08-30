import type { ReactNode } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';
import { useOnlineStatus } from '../lib/useOnlineStatus';
import { useAuth } from '../lib/auth';

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
  const { status, user, logout } = useAuth();

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-field focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      {!online && (
        <div role="status" className="border-b border-line bg-[#fff8ea] px-4 py-2 text-center text-sm font-medium text-ink">
          {t('common.offlineTitle')} — {t('common.offlineBody')}
        </div>
      )}

      <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur-sm">
        <div className="container-page flex items-center justify-between gap-4 py-4">
          <Link to="/" className="flex items-center gap-3 text-ink no-underline">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-field text-sm font-bold text-white">
              S
            </span>
            <span className="leading-none">
              <span className="block text-lg font-semibold tracking-[-0.04em] text-field-deep">{t('app.name')}</span>
              <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.16em] text-muted">Cooperative support</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-field-deep' : 'text-muted hover:text-field-deep'
                  }`
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <LanguageSelector id="lang-header" />
            {status === 'authenticated' && user ? (
              <div className="flex items-center gap-2 border-l border-line pl-2">
                <span className="hidden text-sm font-medium text-ink sm:inline">{t('auth.greeting', { name: user.name })}</span>
                <button type="button" onClick={() => void logout()} className="btn-secondary px-2.5 py-1.5 text-xs">
                  {t('auth.signOut')}
                </button>
              </div>
            ) : (
              status === 'anonymous' && (
                <Link to="/signin" className="btn-secondary px-3 py-2 text-sm">
                  {t('nav.signIn')}
                </Link>
              )
            )}
          </div>
        </div>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="mt-16 border-t border-line bg-panel/80">
        <div className="container-page grid gap-6 py-8 text-sm text-muted sm:grid-cols-[1fr_auto]">
          <p className="max-w-prose">{t('footer.disclaimer')}</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-4">
            <Link to="/schemes" className="font-medium text-field-deep hover:text-field">
              {t('footer.sources')}
            </Link>
            <Link to="/track" className="font-medium text-field-deep hover:text-field">
              {t('nav.track')}
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

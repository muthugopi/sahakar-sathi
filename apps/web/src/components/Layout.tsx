import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';
import { TextSizeControl } from './TextSizeControl';
import { useOnlineStatus } from '../lib/useOnlineStatus';
import { useAuth } from '../lib/auth';

const NAV = [
  { to: '/assistant', key: 'nav.assistant' },
  { to: '/schemes', key: 'nav.schemes' },
  { to: '/cooperative', key: 'nav.cooperative' },
  { to: '/pacs', key: 'nav.pacs' },
  { to: '/pmfby', key: 'nav.pmfby' },
  { to: '/money', key: 'nav.money' },
  { to: '/grievance', key: 'nav.grievance' },
  { to: '/track', key: 'nav.track' },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const online = useOnlineStatus();
  const { status, user, logout } = useAuth();

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only bg-white px-4 py-3 font-bold text-ink underline focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50"
      >
        {t('a11y.skip')}
      </a>

      {!online && (
        <div role="status" className="border-b-4 border-clay bg-white px-4 py-3 text-center font-bold text-ink">
          {t('common.offlineTitle')} — {t('common.offlineBody')}
        </div>
      )}

      <header className="bg-field-deep text-white">
        <div className="container-page flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <Link to="/" className="text-white no-underline">
            <span className="block text-2xl font-bold leading-tight">{t('app.name')}</span>
            <span className="block text-sm text-white/85">{t('app.department')}</span>
          </Link>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <TextSizeControl />
            <LanguageSelector id="lang-header" />
          </div>
        </div>
      </header>

      {/* account bar */}
      <div className="border-b border-line bg-soft">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-2 text-sm">
          <span className="phase-banner border-0 py-0">
            <span className="phase-tag">{t('app.phase')}</span>
            <span>{t('app.phaseNote')}</span>
          </span>
          <span className="flex items-center gap-4">
            {status === 'authenticated' && user ? (
              <>
                {user.role === 'ADMIN' && (
                  <NavLink to="/admin" className="font-bold">
                    {t('nav.admin')}
                  </NavLink>
                )}
                <span className="text-muted">{t('auth.greeting', { name: user.name })}</span>
                <button type="button" onClick={() => void logout()} className="btn-ghost min-h-0 p-0 font-bold">
                  {t('auth.signOut')}
                </button>
              </>
            ) : (
              status === 'anonymous' && (
                <Link to="/signin" className="font-bold">
                  {t('nav.signIn')}
                </Link>
              )
            )}
          </span>
        </div>
      </div>

      <nav aria-label="Primary" className="border-b border-line bg-white">
        <ul className="container-page flex flex-wrap">
          {NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex min-h-[3rem] items-center px-3 py-2 font-bold no-underline ${
                    isActive
                      ? 'border-b-4 border-field text-ink'
                      : 'border-b-4 border-transparent text-field-deep hover:bg-soft'
                  }`
                }
              >
                {t(item.key)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <main id="main" className="flex-1 py-8">
        {children}
      </main>

      <footer className="border-t-4 border-field bg-soft">
        <div className="container-page py-8 text-sm">
          <p className="max-w-prose text-muted">{t('footer.disclaimer')}</p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link to="/schemes" className="font-bold">
                {t('footer.sources')}
              </Link>
            </li>
            <li>
              <Link to="/track" className="font-bold">
                {t('nav.track')}
              </Link>
            </li>
            <li>
              <Link to="/grievance" className="font-bold">
                {t('nav.grievance')}
              </Link>
            </li>
          </ul>
          <p className="mt-4 text-muted">{t('footer.builtFor')}</p>
        </div>
      </footer>
    </div>
  );
}

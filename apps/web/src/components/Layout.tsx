import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';
import { TextSizeControl } from './TextSizeControl';
import { Icon } from './Icon';
import { useOnlineStatus } from '../lib/useOnlineStatus';
import { useAuth } from '../lib/auth';

const NAV: { to: string; key: string; end?: boolean }[] = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/services', key: 'nav.services' },
  { to: '/schemes', key: 'nav.schemes' },
  { to: '/knowledge', key: 'nav.knowledge' },
  { to: '/grievance', key: 'nav.grievances' },
  { to: '/about', key: 'nav.about' },
];

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const online = useOnlineStatus();
  const { status, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex min-h-12 items-center px-3 font-sans font-semibold no-underline ${
      isActive
        ? 'border-b-[3px] border-accent text-ink'
        : 'border-b-[3px] border-transparent text-primary hover:bg-surface'
    }`;

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only rounded bg-white px-4 py-3 font-semibold text-ink underline focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50"
      >
        {t('a11y.skip')}
      </a>

      {!online && (
        <div role="status" className="border-b-4 border-error bg-white px-4 py-3 text-center font-semibold">
          {t('common.offlineTitle')} — {t('common.offlineBody')}
        </div>
      )}

      <header className="bg-primary text-white">
        <div className="container-page flex items-center justify-between gap-4 py-3">
          <Link to="/" className="text-white no-underline">
            <span className="block font-serif text-xl font-semibold leading-tight sm:text-2xl">
              {t('app.name')}
            </span>
            <span className="block text-sm text-white/80">{t('app.department')}</span>
          </Link>

          <div className="hidden items-center gap-5 lg:flex">
            <TextSizeControl />
            <LanguageSelector id="lang-header" />
            <Link
              to="/assistant"
              className="rounded border-2 border-white bg-white px-4 py-2.5 font-sans font-semibold text-primary no-underline hover:bg-primary-tint"
            >
              {t('nav.askAssistant')}
            </Link>
          </div>

          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded border-2 border-white lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
            <span className="sr-only">{t('nav.menu')}</span>
          </button>
        </div>
      </header>

      <div className="civic-rule" />

      {/* desktop nav */}
      <nav aria-label="Primary" className="hidden border-b border-line bg-white lg:block">
        <ul className="container-page flex flex-wrap">
          {NAV.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.end} className={navLinkClass}>
                {t(item.key)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* mobile menu */}
      {menuOpen && (
        <nav id="mobile-menu" aria-label="Primary" className="border-b border-line bg-white lg:hidden">
          <ul className="container-page divide-y divide-line py-2">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex min-h-12 items-center font-sans font-semibold no-underline ${
                      isActive ? 'text-ink' : 'text-primary'
                    }`
                  }
                >
                  {t(item.key)}
                </NavLink>
              </li>
            ))}
            <li>
              <Link to="/assistant" className="flex min-h-12 items-center font-sans font-semibold text-primary no-underline">
                {t('nav.askAssistant')}
              </Link>
            </li>
            <li>
              <Link to="/track" className="flex min-h-12 items-center font-sans font-semibold text-primary no-underline">
                {t('nav.track')}
              </Link>
            </li>
          </ul>
          <div className="container-page flex flex-wrap items-center gap-4 border-t border-line py-3">
            <TextSizeControl />
            <LanguageSelector id="lang-mobile" />
          </div>
        </nav>
      )}

      {/* account + phase bar */}
      <div className="border-b border-line bg-surface">
        <div className="container-page flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2 text-sm">
          <span className="flex flex-wrap items-baseline gap-2 text-muted">
            <span className="rounded bg-accent px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
              {t('app.phase')}
            </span>
            {t('app.phaseNote')}
          </span>
          <span className="flex items-center gap-4">
            {status === 'authenticated' && user ? (
              <>
                {user.role === 'ADMIN' && (
                  <NavLink to="/admin" className="font-semibold">
                    {t('nav.admin')}
                  </NavLink>
                )}
                <span className="text-muted">{t('auth.greeting', { name: user.name })}</span>
                <button type="button" onClick={() => void logout()} className="btn-ghost">
                  {t('auth.signOut')}
                </button>
              </>
            ) : (
              status === 'anonymous' && (
                <Link to="/signin" className="font-semibold">
                  {t('nav.signIn')}
                </Link>
              )
            )}
          </span>
        </div>
      </div>

      <main id="main" className="flex-1 py-10">
        {children}
      </main>

      <footer className="border-t-4 border-primary bg-surface">
        <div className="container-page grid gap-8 py-10 text-sm sm:grid-cols-[1fr_auto]">
          <div className="max-w-prose">
            <p className="font-serif text-lg text-ink">{t('app.name')}</p>
            <p className="mt-2 text-muted">{t('footer.disclaimer')}</p>
            <p className="mt-3 text-muted">{t('footer.builtFor')}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="space-y-2">
              <li><Link to="/about" className="font-semibold">{t('nav.about')}</Link></li>
              <li><Link to="/services" className="font-semibold">{t('nav.services')}</Link></li>
              <li><Link to="/track" className="font-semibold">{t('nav.track')}</Link></li>
              <li><Link to="/grievance" className="font-semibold">{t('nav.grievances')}</Link></li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}

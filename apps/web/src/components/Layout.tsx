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
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const desktopLink = ({ isActive }: { isActive: boolean }) =>
    `flex min-h-touch items-center border-b-4 px-3 font-display font-semibold no-underline ${
      isActive ? 'border-accent text-ink' : 'border-transparent text-primary hover:bg-primary-tint'
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
        <div role="status" className="bg-error px-4 py-3 text-center font-semibold text-white">
          {t('common.offlineTitle')} — {t('common.offlineBody')}
        </div>
      )}

      <header className="bg-primary text-white">
        <div className="container-page flex items-center justify-between gap-4 py-4">
          <Link to="/" className="text-white no-underline">
            <span className="block font-display text-xl font-bold leading-none sm:text-2xl">
              {t('app.name')}
            </span>
            <span className="mt-1 block text-sm text-white/85">{t('app.department')}</span>
          </Link>

          <div className="hidden items-center gap-5 lg:flex">
            <TextSizeControl />
            <LanguageSelector id="lang-header" />
            <Link
              to="/assistant"
              className="inline-flex min-h-touch items-center rounded border-2 border-white bg-white px-4 font-display font-semibold text-primary no-underline hover:bg-primary-tint"
            >
              {t('nav.askAssistant')}
            </Link>
          </div>

          <button
            type="button"
            className="flex min-h-touch min-w-touch items-center justify-center rounded border-2 border-white lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
            <span className="sr-only">{t('nav.menu')}</span>
          </button>
        </div>
      </header>

      <nav aria-label="Primary" className="hidden border-b border-line bg-white lg:block">
        <ul className="container-page flex flex-wrap">
          {NAV.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.end} className={desktopLink}>
                {t(item.key)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="fixed inset-0 z-40 flex flex-col bg-white lg:hidden">
          <div className="flex items-center justify-between bg-primary px-5 py-4 text-white">
            <span className="font-display text-lg font-bold">{t('nav.menu')}</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex min-h-touch min-w-touch items-center justify-center rounded border-2 border-white"
            >
              <Icon name="close" />
              <span className="sr-only">{t('common.backHome')}</span>
            </button>
          </div>
          <nav aria-label="Primary" className="flex-1 overflow-y-auto px-5 py-2">
            <ul className="divide-y divide-line">
              {[...NAV, { to: '/assistant', key: 'nav.askAssistant' }, { to: '/track', key: 'nav.track' }].map(
                (item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={'end' in item ? (item as { end?: boolean }).end : undefined}
                      className={({ isActive }) =>
                        `flex min-h-btn items-center justify-between font-display text-lg font-semibold no-underline ${
                          isActive ? 'text-ink' : 'text-primary'
                        }`
                      }
                    >
                      {t(item.key)}
                      <Icon name="chevron" className="h-5 w-5" />
                    </NavLink>
                  </li>
                ),
              )}
            </ul>
          </nav>
          <div className="flex flex-wrap items-center gap-4 border-t border-line px-5 py-4">
            <TextSizeControl />
            <LanguageSelector id="lang-mobile" />
          </div>
        </div>
      )}

      <div className="border-b border-line bg-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2 text-sm">
          <span className="flex flex-wrap items-baseline gap-2 text-ink-2">
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
                <span className="text-ink-2">{t('auth.greeting', { name: user.name })}</span>
                <button type="button" onClick={() => void logout()} className="btn-link">
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

      <main id="main" className="flex-1 py-7">
        {children}
      </main>

      <footer className="border-t-4 border-primary bg-white">
        <div className="container-page grid gap-6 py-7 text-sm sm:grid-cols-[1fr_auto]">
          <div className="max-w-prose">
            <p className="font-display text-lg font-semibold text-ink">{t('app.name')}</p>
            <p className="mt-2 text-ink-2">{t('footer.disclaimer')}</p>
            <p className="mt-3 text-ink-2">{t('footer.builtFor')}</p>
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

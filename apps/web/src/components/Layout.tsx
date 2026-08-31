import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';
import { Icon } from './Icon';
import { useOnlineStatus } from '../lib/useOnlineStatus';
import { useAuth } from '../lib/auth';

const NAV: { to: string; key: string }[] = [
  { to: '/schemes', key: 'nav.short.schemes' },
  { to: '/cooperative', key: 'nav.short.cooperative' },
  { to: '/pacs', key: 'nav.short.pacs' },
  { to: '/pmfby', key: 'nav.short.pmfby' },
  { to: '/money', key: 'nav.short.money' },
  { to: '/grievance', key: 'nav.short.grievance' },
];

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const online = useOnlineStatus();
  const { status, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const desktopLink = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap text-sm no-underline transition-colors ${
      isActive ? 'font-semibold text-ink' : 'font-medium text-ink-2 hover:text-ink'
    }`;

  const account =
    status === 'authenticated' && user ? (
      <span className="flex items-center gap-3 whitespace-nowrap text-sm">
        {user.role === 'ADMIN' && (
          <NavLink to="/admin" className="font-medium text-ink-2 no-underline hover:text-ink">
            {t('nav.admin')}
          </NavLink>
        )}
        <button
          type="button"
          onClick={() => void logout()}
          className="font-medium text-ink-2 no-underline hover:text-ink"
        >
          {t('auth.signOut')}
        </button>
      </span>
    ) : status === 'anonymous' ? (
      <Link
        to="/signin"
        className="whitespace-nowrap text-sm font-medium text-ink-2 no-underline hover:text-ink"
      >
        {t('nav.signIn')}
      </Link>
    ) : null;

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only rounded-lg bg-panel px-4 py-3 font-semibold text-ink shadow focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]"
      >
        {t('a11y.skip')}
      </a>

      {!online && (
        <div role="status" className="bg-error px-4 py-2 text-center text-sm font-medium text-white">
          {t('common.offlineTitle')} — {t('common.offlineBody')}
        </div>
      )}

      <header
        className={`sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-300 ${
          scrolled
            ? 'border-b border-line bg-bg/90 shadow-[0_1px_0_rgba(26,36,32,0.04),0_10px_30px_-24px_rgba(26,36,32,0.25)] backdrop-blur-md'
            : 'border-b border-transparent bg-bg/60 backdrop-blur-sm'
        }`}
      >
        <div className="container-wide flex h-16 items-center justify-between gap-4">
          <Link
            to="/"
            className="shrink-0 whitespace-nowrap font-display text-lg font-semibold tracking-tight text-ink no-underline"
          >
            {t('app.name')}
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex xl:gap-8">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className={desktopLink}>
                {t(item.key)}
              </NavLink>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-4 lg:flex">
            {account}
            <LanguageSelector id="lang-header" hideLabel />
            <Link to="/assistant" className="btn-primary h-10 min-h-0 whitespace-nowrap px-4 text-sm">
              {t('nav.askSathi')}
            </Link>
          </div>

          <button
            type="button"
            className="-me-2 flex h-11 w-11 items-center justify-center rounded-lg text-ink lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} className="h-6 w-6" />
            <span className="sr-only">{t('nav.menu')}</span>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-50 flex flex-col bg-bg lg:hidden motion-safe:animate-fade-up"
        >
          <div className="container-page flex h-16 shrink-0 items-center justify-between">
            <span className="font-display text-lg font-semibold tracking-tight text-ink">
              {t('app.name')}
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="-me-2 flex h-11 w-11 items-center justify-center rounded-lg text-ink"
            >
              <Icon name="close" className="h-6 w-6" />
              <span className="sr-only">{t('common.backHome')}</span>
            </button>
          </div>

          <nav
            aria-label="Primary"
            className="container-page flex-1 overflow-y-auto border-t border-line py-2"
          >
            {[
              { to: '/assistant', key: 'nav.askSathi' },
              ...NAV,
              { to: '/track', key: 'nav.track' },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between border-b border-line py-4 font-display text-xl no-underline ${
                    isActive ? 'font-semibold text-ink' : 'font-normal text-ink-2'
                  }`
                }
              >
                {t(item.key)}
                <Icon name="chevron" className="h-4 w-4 text-ink-2" />
              </NavLink>
            ))}
          </nav>

          <div className="container-page flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line py-4">
            <LanguageSelector id="lang-mobile" />
            {account}
          </div>
        </div>
      )}

      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>

      <footer className="section-divide mt-24">
        <div className="container-wide py-16 sm:py-20">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
            <div className="max-w-prose">
              <p className="font-display text-xl tracking-tight text-ink">{t('app.name')}</p>
              <p className="mt-1 text-sm text-ink-2">{t('app.department')}</p>
              <p className="mt-4 text-sm text-ink-2">{t('footer.disclaimer')}</p>
              <p className="mt-2 text-sm text-ink-2">{t('footer.builtFor')}</p>
            </div>
            <nav aria-label="Knowledge" className="text-sm">
              <p className="font-semibold text-ink">{t('nav.resources')}</p>
              <ul className="mt-3 space-y-2.5">
                <li>
                  <Link to="/schemes" className="text-ink-2 no-underline hover:text-ink">
                    {t('nav.schemes')}
                  </Link>
                </li>
                <li>
                  <Link to="/cooperative" className="text-ink-2 no-underline hover:text-ink">
                    {t('sections.cooperative_law.title')}
                  </Link>
                </li>
                <li>
                  <Link to="/pacs" className="text-ink-2 no-underline hover:text-ink">
                    {t('sections.pacs.title')}
                  </Link>
                </li>
                <li>
                  <Link to="/pmfby" className="text-ink-2 no-underline hover:text-ink">
                    {t('sections.pmfby.title')}
                  </Link>
                </li>
                <li>
                  <Link to="/money" className="text-ink-2 no-underline hover:text-ink">
                    {t('sections.financial_literacy.title')}
                  </Link>
                </li>
              </ul>
            </nav>
            <nav aria-label="Help" className="text-sm">
              <p className="font-semibold text-ink">{t('nav.grievances')}</p>
              <ul className="mt-3 space-y-2.5">
                <li>
                  <Link to="/grievance" className="text-ink-2 no-underline hover:text-ink">
                    {t('grievance.title')}
                  </Link>
                </li>
                <li>
                  <Link to="/track" className="text-ink-2 no-underline hover:text-ink">
                    {t('nav.track')}
                  </Link>
                </li>
                <li>
                  <Link to="/assistant" className="text-ink-2 no-underline hover:text-ink">
                    {t('nav.askSathi')}
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-ink-2 no-underline hover:text-ink">
                    {t('nav.about')}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <p className="mt-14 border-t border-line pt-6 text-xs text-ink-2">
            <span className="font-semibold text-ink">{t('app.phase')}</span> — {t('app.phaseNote')}
          </p>
        </div>
      </footer>
    </div>
  );
}

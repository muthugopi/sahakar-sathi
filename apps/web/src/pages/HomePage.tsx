import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchSchemes } from '../lib/content';

const QUICK_HELP = [
  { key: 'schemes', to: '/schemes' },
  { key: 'pmfby', to: '/pmfby' },
  { key: 'pacs', to: '/pacs' },
  { key: 'cooperative', to: '/cooperative' },
  { key: 'money', to: '/money' },
  { key: 'grievance', to: '/grievance' },
] as const;

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');

  const popularSchemes = useQuery({
    queryKey: ['schemes', {}],
    queryFn: () => fetchSchemes(),
    staleTime: 30 * 60_000,
  });

  const ask = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    navigate(`/assistant?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="container-page py-8 sm:py-12">
      <section className="border-b border-line pb-10 pt-3 sm:pb-14">
        <div className="max-w-5xl">
          <p className="eyebrow">{t('app.name')}</p>
          <h1 className="mt-5 max-w-3xl text-5xl leading-[0.92] tracking-[-0.07em] text-field-deep sm:text-6xl">
            {t('home.heroHeading')}
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-muted">{t('home.heroSub')}</p>

          <form
            className="mt-8 flex max-w-4xl flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              ask(question);
            }}
          >
            <label htmlFor="home-ask" className="sr-only">
              {t('home.askPlaceholder')}
            </label>
            <input
              id="home-ask"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t('home.askPlaceholder')}
              className="field-shell flex-1 bg-soft"
              autoComplete="off"
            />
            <button type="submit" className="btn-primary min-w-[12rem]">
              {t('home.askButton')}
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => navigate('/assistant?voice=1')} className="btn-voice">
              <span aria-hidden>🎙</span>
              {t('home.speakButton')}
            </button>
            <Link to="/schemes" className="btn-secondary">
              Explore schemes
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-12 border-t border-line pt-10" aria-labelledby="quick-help-heading">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">{t('home.quickHelpLabel')}</p>
            <h2 id="quick-help-heading" className="mt-3 text-3xl tracking-[-0.06em] text-field-deep">
              Start with what you need
            </h2>
          </div>
          <Link to="/assistant" className="text-sm font-semibold text-field-deep hover:text-field">
            Ask the assistant →
          </Link>
        </div>

        <div className="space-y-3">
          {QUICK_HELP.map((item, index) => (
            <Link
              key={item.key}
              to={item.to}
              className="flex items-start justify-between gap-4 border-t border-line py-4 text-left transition-colors hover:bg-soft"
            >
              <div className="flex items-start gap-4">
                <span className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-xl font-semibold tracking-[-0.05em] text-ink">{t(`quickHelp.${item.key}.title`)}</p>
                  <p className="mt-2 max-w-3xl text-base text-muted">{t(`quickHelp.${item.key}.desc`)}</p>
                </div>
              </div>
              <span className="mt-1 text-2xl text-field-deep" aria-hidden>→</span>
            </Link>
          ))}
        </div>
      </section>

      {popularSchemes.data && popularSchemes.data.schemes.length > 0 && (
        <section className="mt-14 border-t border-line pt-10" aria-labelledby="popular-schemes-heading">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">{t('home.schemesLabel')}</p>
              <h2 id="popular-schemes-heading" className="mt-3 text-3xl tracking-[-0.06em] text-field-deep">
                Popular schemes
              </h2>
            </div>
            <Link to="/schemes" className="text-sm font-semibold text-field-deep hover:text-field">
              {t('schemes.backToAll')} →
            </Link>
          </div>

          <div className="space-y-2">
            {popularSchemes.data.schemes.slice(0, 4).map((s, index) => (
              <Link
                key={s.slug}
                to={`/schemes/${s.slug}`}
                className="flex items-start justify-between gap-4 border-t border-line py-4 text-left transition-colors hover:bg-soft"
              >
                <div className="flex items-start gap-4">
                  <span className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-xl font-semibold tracking-[-0.05em] text-ink">{s.title}</p>
                    <p className="mt-2 max-w-3xl text-base text-muted">{s.summary}</p>
                  </div>
                </div>
                <span className="mt-1 text-2xl text-field-deep" aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14 border-t border-line pt-10">
        <div className="max-w-4xl">
          <p className="eyebrow">Support when it matters</p>
          <h2 className="mt-3 text-3xl tracking-[-0.06em] text-field-deep">{t('home.grievanceCalloutTitle')}</h2>
          <p className="mt-4 text-xl leading-8 text-muted">{t('home.grievanceCalloutBody')}</p>
          <div className="mt-6">
            <Link to="/grievance" className="btn-primary">
              {t('home.grievanceCalloutAction')}
            </Link>
          </div>
        </div>
      </section>

      <p className="mb-12 mt-14 max-w-3xl border-l-2 border-field bg-panel px-4 py-4 text-base leading-7 text-muted">
        {t('home.trustNote')}
      </p>
    </div>
  );
}

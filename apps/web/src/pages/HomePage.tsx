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

  const examples = t('home.examples', { returnObjects: true }) as string[];
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
    <div className="container-page">
      {/* Hero: the assistant itself is the hero, not a marketing banner. */}
      <section className="border-b border-line py-10 sm:py-14">
        <p className="eyebrow">{t('app.name')}</p>
        <h1 className="mt-3 max-w-prose text-3xl leading-tight sm:text-4xl">
          {t('home.heroHeading')}
        </h1>
        <p className="mt-4 max-w-prose text-lg text-muted">{t('home.heroSub')}</p>

        <form
          className="mt-7 flex max-w-2xl flex-col gap-3 sm:flex-row"
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
            className="min-h-[3rem] flex-1 rounded border border-line bg-panel px-4 py-3 text-base
                       placeholder:text-muted"
            autoComplete="off"
          />
          <button type="submit" className="btn-primary">
            {t('home.askButton')}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate('/assistant?voice=1')}
          className="btn-voice mt-3"
        >
          <span aria-hidden>🎙</span>
          {t('home.speakButton')}
        </button>

        <div className="mt-6">
          <p className="eyebrow">{t('home.examplesLabel')}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {examples.map((ex) => (
              <li key={ex}>
                <button
                  type="button"
                  onClick={() => ask(ex)}
                  className="rounded border border-line bg-panel px-3 py-2 text-sm hover:bg-field-wash"
                >
                  {ex}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Quick help — a register of topics, not a grid of cards. */}
      <section className="py-10" aria-labelledby="quick-help-heading">
        <h2 id="quick-help-heading" className="eyebrow mb-3">
          {t('home.quickHelpLabel')}
        </h2>
        <ul className="register">
          {QUICK_HELP.map((item, i) => (
            <li key={item.key}>
              <Link to={item.to} className="register-row">
                <span className="register-index" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold">
                    {t(`quickHelp.${item.key}.title`)}
                  </span>
                  <span className="block text-sm text-muted">
                    {t(`quickHelp.${item.key}.desc`)}
                  </span>
                </span>
                <span className="ms-auto shrink-0 text-field-deep" aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Popular schemes */}
      {popularSchemes.data && popularSchemes.data.schemes.length > 0 && (
        <section className="mb-12" aria-labelledby="popular-schemes-heading">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 id="popular-schemes-heading" className="eyebrow">
              {t('home.schemesLabel')}
            </h2>
            <Link to="/schemes" className="text-sm font-medium text-field-deep underline">
              {t('schemes.backToAll')} →
            </Link>
          </div>
          <ul className="register">
            {popularSchemes.data.schemes.slice(0, 4).map((s, i) => (
              <li key={s.slug}>
                <Link to={`/schemes/${s.slug}`} className="register-row">
                  <span className="register-index" aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold">{s.title}</span>
                    <span className="block text-sm text-muted">{s.summary}</span>
                  </span>
                  <span className="ms-auto shrink-0 text-field-deep" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Grievance callout */}
      <section className="mb-12 rounded-lg border border-clay/30 bg-clay/5 p-6">
        <h2 className="text-xl">{t('home.grievanceCalloutTitle')}</h2>
        <p className="mt-2 max-w-prose text-muted">{t('home.grievanceCalloutBody')}</p>
        <Link to="/grievance" className="btn-outline mt-4 border-clay text-clay hover:bg-clay/10">
          {t('home.grievanceCalloutAction')}
        </Link>
      </section>

      <p className="mb-12 max-w-prose border-l-4 border-field pl-4 text-sm text-muted">
        {t('home.trustNote')}
      </p>
    </div>
  );
}

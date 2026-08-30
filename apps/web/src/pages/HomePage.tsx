import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchUpdates } from '../lib/content';
import { Signpost } from '../components/Signpost';

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');

  const examples = t('home.examples', { returnObjects: true }) as string[];
  const updates = useQuery({ queryKey: ['updates'], queryFn: fetchUpdates, staleTime: 30 * 60_000 });

  const ask = (q: string) => {
    const trimmed = q.trim();
    if (trimmed) navigate(`/assistant?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="container-page">
      {/* Hero — ask a question */}
      <section className="pb-12 pt-2 motion-safe:animate-fade-up sm:pb-16">
        <p className="eyebrow">{t('app.department')}</p>
        <h1 className="mt-4 max-w-3xl text-[2rem] leading-[1.12] tracking-tight sm:text-5xl">
          {t('home.heroHeading')}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-2 sm:text-xl">{t('home.heroSub')}</p>

        <form
          className="mt-9 max-w-2xl"
          onSubmit={(e) => {
            e.preventDefault();
            ask(question);
          }}
        >
          <label htmlFor="home-ask" className="sr-only">
            {t('home.askLabel')}
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="home-ask"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t('home.askPlaceholder')}
              className="field-input flex-1 text-lg"
              autoComplete="off"
            />
            <button type="submit" className="btn-primary btn-block px-6 text-lg">
              {t('home.askButton')}
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <button type="button" onClick={() => navigate('/assistant?voice=1')} className="btn-link">
              {t('home.speakButton')}
            </button>
            <Link to="/schemes" className="font-medium text-ink-2 no-underline hover:text-ink">
              {t('home.browseSchemes')}
            </Link>
            <Link to="/track" className="font-medium text-ink-2 no-underline hover:text-ink">
              {t('home.trackGrievance')}
            </Link>
          </div>
        </form>

        <div className="mt-8 max-w-2xl text-sm">
          <span className="font-semibold text-ink">{t('home.examplesLabel')}</span>{' '}
          <span className="text-ink-2">
            {examples.slice(0, 3).map((ex, i) => (
              <span key={ex}>
                {i > 0 && <span aria-hidden className="mx-2 text-ink-2/40">·</span>}
                <button
                  type="button"
                  onClick={() => ask(ex)}
                  className="text-left underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-ink-2"
                >
                  {ex}
                </button>
              </span>
            ))}
          </span>
        </div>
      </section>

      {/* Explore — one section, not five cards */}
      <section className="border-t border-line py-12 sm:py-16" aria-labelledby="explore-heading">
        <div className="max-w-prose">
          <h2 id="explore-heading" className="text-2xl sm:text-3xl">
            {t('home.exploreHeading')}
          </h2>
          <p className="mt-3 text-ink-2">{t('home.exploreSub')}</p>
        </div>
        <div className="signpost-grid mt-8 border-t border-line">
          <Signpost
            icon="scheme"
            to="/schemes"
            label={t('quickHelp.schemes.title')}
            sub={t('quickHelp.schemes.desc')}
          />
          <Signpost
            icon="knowledge"
            to="/cooperative"
            label={t('sections.cooperative_law.title')}
            sub={t('quickHelp.cooperative.desc')}
          />
          <Signpost
            icon="services"
            to="/pacs"
            label={t('quickHelp.pacs.title')}
            sub={t('quickHelp.pacs.desc')}
          />
          <Signpost
            icon="track"
            to="/money"
            label={t('quickHelp.money.title')}
            sub={t('quickHelp.money.desc')}
          />
          <Signpost
            icon="grievance"
            to="/grievance"
            label={t('quickHelp.grievance.title')}
            sub={t('quickHelp.grievance.desc')}
          />
          <Signpost
            icon="assistant"
            primary
            to="/assistant"
            label={t('quickHelp.assistant.title')}
            sub={t('quickHelp.assistant.desc')}
          />
        </div>
      </section>

      {/* Recently updated (real data) */}
      {updates.data && updates.data.updates.length > 0 && (
        <section className="border-t border-line py-12 sm:py-16" aria-labelledby="updates-heading">
          <div className="max-w-prose">
            <h2 id="updates-heading" className="text-2xl sm:text-3xl">
              {t('home.updatesHeading')}
            </h2>
            <p className="mt-3 text-ink-2">{t('home.updatesSub')}</p>
          </div>
          <ul className="mt-8 max-w-prose border-t border-line">
            {updates.data.updates.map((u) => (
              <li key={u.href + u.title}>
                <Link
                  to={u.href}
                  className="flex flex-col gap-1 border-b border-line py-4 no-underline transition-colors hover:bg-primary-tint/40 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <span className="font-semibold text-ink">{u.title}</span>
                  <span className="shrink-0 text-sm text-ink-2">
                    {new Date(u.date).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                    {' · '}
                    {u.category}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Link to="/knowledge" className="font-semibold">
              {t('home.seeAllUpdates')}
            </Link>
          </p>
        </section>
      )}

      {/* Where the information comes from */}
      <section className="border-t border-line py-12 sm:py-16" aria-labelledby="trust-heading">
        <div className="max-w-prose">
          <h2 id="trust-heading" className="text-2xl sm:text-3xl">
            {t('home.trustHeading')}
          </h2>
          <p className="mt-4 text-ink-2">{t('home.trustBody')}</p>
          <p className="mt-6">
            <Link to="/about" className="font-semibold">
              {t('home.trustLink')}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

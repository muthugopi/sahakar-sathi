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
      {/* Hero — one thing to do */}
      <section className="pb-14 pt-2 motion-safe:animate-fade-up sm:pb-24">
        <p className="eyebrow">{t('app.department')}</p>
        <h1 className="mt-4 max-w-4xl text-[2rem] leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
          {t('home.heroHeading')}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-2 sm:mt-6 sm:text-xl">{t('home.heroSub')}</p>

        <form
          className="mt-10 max-w-2xl"
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
          <button
            type="button"
            onClick={() => navigate('/assistant?voice=1')}
            className="btn-link mt-4 text-base"
          >
            {t('home.speakButton')}
          </button>
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

      {/* Start with what you need */}
      <section className="border-t border-line py-14 sm:py-20" aria-labelledby="quick-heading">
        <h2 id="quick-heading" className="text-2xl sm:text-3xl">
          {t('home.quickHeading')}
        </h2>
        <div className="signpost-grid mt-8 border-t border-line">
          <Signpost
            icon="assistant"
            primary
            to="/assistant"
            label={t('quickHelp.assistant.title')}
            sub={t('quickHelp.assistant.desc')}
          />
          <Signpost
            icon="scheme"
            to="/schemes"
            label={t('quickHelp.schemes.title')}
            sub={t('quickHelp.schemes.desc')}
          />
          <Signpost
            icon="services"
            to="/pacs"
            label={t('quickHelp.pacs.title')}
            sub={t('quickHelp.pacs.desc')}
          />
          <Signpost
            icon="grievance"
            to="/grievance"
            label={t('quickHelp.grievance.title')}
            sub={t('quickHelp.grievance.desc')}
          />
        </div>
      </section>

      {/* The assistant, explained */}
      <section
        className="grid gap-10 border-t border-line py-14 sm:py-20 lg:grid-cols-2 lg:gap-16"
        aria-labelledby="assistant-heading"
      >
        <div>
          <h2 id="assistant-heading" className="text-2xl sm:text-3xl">
            {t('home.assistantHeading')}
          </h2>
          <p className="mt-4 text-ink-2">{t('home.assistantBody1')}</p>
          <p className="mt-4 text-ink-2">{t('home.assistantBody2')}</p>
          <Link to="/assistant" className="btn-primary mt-8">
            {t('nav.askAssistant')}
          </Link>
        </div>
        <ul className="space-y-4 lg:mt-1">
          {[t('home.assistantPoint1'), t('home.assistantPoint2'), t('home.assistantPoint3')].map(
            (point) => (
              <li key={point} className="flex gap-3 border-b border-line pb-4 text-ink-2">
                <span aria-hidden className="mt-0.5 shrink-0 font-semibold text-primary">
                  —
                </span>
                {point}
              </li>
            ),
          )}
        </ul>
      </section>

      {/* Services directory */}
      <section className="border-t border-line py-14 sm:py-20" aria-labelledby="directory-heading">
        <h2 id="directory-heading" className="text-2xl sm:text-3xl">
          {t('home.directoryHeading')}
        </h2>
        <div className="mt-8 grid gap-x-14 gap-y-8 sm:grid-cols-2">
          <DirGroup
            title={t('home.dir.cooperative')}
            links={[
              ['/cooperative', t('sections.cooperative_law.title')],
              ['/pacs', t('sections.pacs.title')],
            ]}
          />
          <DirGroup title={t('home.dir.schemes')} links={[['/schemes', t('sections.schemes.title')]]} />
          <DirGroup
            title={t('home.dir.money')}
            links={[['/money', t('sections.financial_literacy.title')]]}
          />
          <DirGroup title={t('home.dir.pmfby')} links={[['/pmfby', t('sections.pmfby.title')]]} />
          <DirGroup
            title={t('home.dir.grievance')}
            links={[
              ['/grievance', t('grievance.title')],
              ['/track', t('grievance.trackTitle')],
            ]}
          />
        </div>
        <p className="mt-10">
          <Link to="/services" className="font-semibold">
            {t('home.seeAllServices')}
          </Link>
        </p>
      </section>

      {/* Recently updated (real data) */}
      {updates.data && updates.data.updates.length > 0 && (
        <section className="border-t border-line py-14 sm:py-20" aria-labelledby="updates-heading">
          <h2 id="updates-heading" className="text-2xl sm:text-3xl">
            {t('home.updatesHeading')}
          </h2>
          <ul className="mt-8 max-w-prose border-t border-line">
            {updates.data.updates.map((u) => (
              <li key={u.href + u.title}>
                <Link
                  to={u.href}
                  className="block border-b border-line py-4 no-underline transition-colors hover:bg-primary-tint/40"
                >
                  <span className="block text-sm text-ink-2">
                    {new Date(u.date).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}{' '}
                    · {u.category}
                  </span>
                  <span className="mt-1 block font-semibold text-ink">{u.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* About */}
      <section className="border-t border-line py-14 sm:py-20" aria-labelledby="about-heading">
        <h2 id="about-heading" className="text-2xl sm:text-3xl">
          {t('home.aboutHeading')}
        </h2>
        <p className="mt-4 max-w-prose text-ink-2">{t('home.aboutBody')}</p>
        <p className="mt-6">
          <Link to="/about" className="font-semibold">
            {t('home.aboutMore')}
          </Link>
        </p>
      </section>
    </div>
  );
}

function DirGroup({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h3 className="text-base">{title}</h3>
      <ul className="mt-2 space-y-1.5">
        {links.map(([to, label]) => (
          <li key={to + label}>
            <Link to={to} className="text-ink-2 no-underline hover:text-ink">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

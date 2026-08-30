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
      {/* 1 — Hero: one thing to do */}
      <section className="prose-block">
        <h1 className="text-4xl sm:text-5xl">{t('home.heroHeading')}</h1>
        <p className="mt-4 text-lg text-ink-2">{t('home.heroSub')}</p>

        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            ask(question);
          }}
        >
          <label htmlFor="home-ask" className="field-label">
            {t('home.askLabel')}
          </label>
          <p id="home-ask-hint" className="field-hint">
            {t('home.askHint')}
          </p>
          <input
            id="home-ask"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            aria-describedby="home-ask-hint"
            className="field-input mt-2"
            autoComplete="off"
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button type="submit" className="btn-primary btn-block">
              {t('home.askButton')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/assistant?voice=1')}
              className="btn-secondary btn-block"
            >
              {t('home.speakButton')}
            </button>
          </div>
        </form>

        <div className="mt-5">
          <p className="eyebrow">{t('home.examplesLabel')}</p>
          <ul className="mt-2 flex flex-col gap-2">
            {examples.slice(0, 3).map((ex) => (
              <li key={ex}>
                <button
                  type="button"
                  onClick={() => ask(ex)}
                  className="w-full rounded border border-line bg-white px-3 py-3 text-left hover:border-primary"
                >
                  {ex}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 2 — Quick access: the main destinations as signs */}
      <section className="mt-8" aria-labelledby="quick-heading">
        <h2 id="quick-heading" className="text-2xl sm:text-3xl">
          {t('home.quickHeading')}
        </h2>
        <div className="signpost-grid mt-4">
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

      {/* 3 — The assistant, explained */}
      <section className="prose-block mt-8 border-t border-line pt-7" aria-labelledby="assistant-heading">
        <h2 id="assistant-heading" className="text-2xl sm:text-3xl">
          {t('home.assistantHeading')}
        </h2>
        <p className="mt-3 text-ink-2">{t('home.assistantBody1')}</p>
        <p className="mt-3 text-ink-2">{t('home.assistantBody2')}</p>
        <ul className="mt-3 list-disc space-y-1 ps-6 text-ink-2">
          <li>{t('home.assistantPoint1')}</li>
          <li>{t('home.assistantPoint2')}</li>
          <li>{t('home.assistantPoint3')}</li>
        </ul>
        <div className="mt-5">
          <Link to="/assistant" className="btn-primary btn-block">
            {t('nav.askAssistant')}
          </Link>
        </div>
      </section>

      {/* 4 — Services directory */}
      <section className="mt-8 border-t border-line pt-7" aria-labelledby="directory-heading">
        <h2 id="directory-heading" className="text-2xl sm:text-3xl">
          {t('home.directoryHeading')}
        </h2>
        <div className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2">
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
        <p className="mt-5">
          <Link to="/services" className="font-semibold">
            {t('home.seeAllServices')}
          </Link>
        </p>
      </section>

      {/* 5 — Recently updated (real data) */}
      {updates.data && updates.data.updates.length > 0 && (
        <section className="prose-block mt-8 border-t border-line pt-7" aria-labelledby="updates-heading">
          <h2 id="updates-heading" className="text-2xl sm:text-3xl">
            {t('home.updatesHeading')}
          </h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {updates.data.updates.map((u) => (
              <li key={u.href + u.title}>
                <Link to={u.href} className="block py-3">
                  <span className="block text-sm text-ink-2">
                    {new Date(u.date).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}{' '}
                    · {u.category}
                  </span>
                  <span className="mt-0.5 block font-semibold text-primary">{u.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 6 — About */}
      <section className="prose-block mt-8 border-t border-line pt-7" aria-labelledby="about-heading">
        <h2 id="about-heading" className="text-2xl sm:text-3xl">
          {t('home.aboutHeading')}
        </h2>
        <p className="mt-3 text-ink-2">{t('home.aboutBody')}</p>
        <p className="mt-4">
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
      <h3 className="text-lg">{title}</h3>
      <ul className="mt-1.5 space-y-1">
        {links.map(([to, label]) => (
          <li key={to + label}>
            <Link to={to} className="font-semibold">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

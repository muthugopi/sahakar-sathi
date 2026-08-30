import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchUpdates } from '../lib/content';
import { Icon } from '../components/Icon';

const QUICK = [
  { icon: 'scheme', key: 'schemes', to: '/schemes' },
  { icon: 'assistant', key: 'assistant', to: '/assistant' },
  { icon: 'services', key: 'pacs', to: '/pacs' },
  { icon: 'grievance', key: 'grievance', to: '/grievance' },
] as const;

const DIRECTORY = [
  { key: 'cooperative', links: [['/cooperative', 'nav.cooperative'], ['/pacs', 'nav.pacs']] },
  { key: 'schemes', links: [['/schemes', 'sections.schemes.title']] },
  { key: 'money', links: [['/money', 'sections.financial_literacy.title']] },
  { key: 'pmfby', links: [['/pmfby', 'sections.pmfby.title']] },
  { key: 'law', links: [['/cooperative', 'sections.cooperative_law.title']] },
  { key: 'grievance', links: [['/grievance', 'nav.grievances'], ['/track', 'nav.track']] },
] as const;

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
      {/* 1 — Hero */}
      <section className="max-w-prose">
        <h1 className="text-4xl sm:text-5xl">{t('home.heroHeading')}</h1>
        <p className="mt-4 text-lg text-muted">{t('home.heroSub')}</p>

        <form
          className="mt-8"
          onSubmit={(e) => {
            e.preventDefault();
            ask(question);
          }}
        >
          <label htmlFor="home-ask" className="field-label text-lg">
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
            className="field-shell mt-2"
            autoComplete="off"
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button type="submit" className="btn-start">
              {t('home.askButton')}
            </button>
            <button type="button" onClick={() => navigate('/assistant?voice=1')} className="btn-voice">
              {t('home.speakButton')}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <p className="eyebrow">{t('home.examplesLabel')}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {examples.map((ex) => (
              <li key={ex}>
                <button
                  type="button"
                  onClick={() => ask(ex)}
                  className="rounded border border-line bg-white px-3 py-2 text-left hover:border-primary"
                >
                  {ex}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 2 — Quick access */}
      <section className="mt-16" aria-labelledby="quick-heading">
        <h2 id="quick-heading" className="text-2xl sm:text-3xl">
          {t('home.quickHeading')}
        </h2>
        <ul className="card-grid mt-5 lg:grid-cols-4">
          {QUICK.map((item) => (
            <li key={item.key}>
              <Link to={item.to} className="card flex h-full flex-col gap-3">
                <span className="text-primary">
                  <Icon name={item.icon} className="h-7 w-7" />
                </span>
                <span className="font-sans text-lg font-semibold text-primary underline">
                  {t(`quickHelp.${item.key}.title`)}
                </span>
                <span className="text-sm text-muted">{t(`quickHelp.${item.key}.desc`)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 3 — The assistant */}
      <section className="mt-16 max-w-prose border-t border-line pt-10" aria-labelledby="assistant-heading">
        <h2 id="assistant-heading" className="text-2xl sm:text-3xl">
          {t('home.assistantHeading')}
        </h2>
        <p className="mt-3 text-muted">{t('home.assistantBody1')}</p>
        <p className="mt-3 text-muted">{t('home.assistantBody2')}</p>
        <ul className="mt-4 list-disc space-y-1 ps-6 text-muted">
          <li>{t('home.assistantPoint1')}</li>
          <li>{t('home.assistantPoint2')}</li>
          <li>{t('home.assistantPoint3')}</li>
        </ul>
        <div className="mt-5">
          <Link to="/assistant" className="btn-primary">
            {t('nav.askAssistant')}
          </Link>
        </div>
      </section>

      {/* 4 — Services directory */}
      <section className="mt-16 border-t border-line pt-10" aria-labelledby="directory-heading">
        <h2 id="directory-heading" className="text-2xl sm:text-3xl">
          {t('home.directoryHeading')}
        </h2>
        <div className="mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {DIRECTORY.map((group) => (
            <div key={group.key}>
              <h3 className="text-lg">{t(`home.dir.${group.key}`)}</h3>
              <ul className="mt-2 space-y-1">
                {group.links.map(([to, labelKey]) => (
                  <li key={to + labelKey}>
                    <Link to={to} className="font-semibold">
                      {t(labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6">
          <Link to="/services" className="font-semibold">
            {t('home.seeAllServices')}
          </Link>
        </p>
      </section>

      {/* 5 — Recently updated */}
      {updates.data && updates.data.updates.length > 0 && (
        <section className="mt-16 max-w-prose border-t border-line pt-10" aria-labelledby="updates-heading">
          <h2 id="updates-heading" className="text-2xl sm:text-3xl">
            {t('home.updatesHeading')}
          </h2>
          <ul className="record-list mt-5">
            {updates.data.updates.map((u) => (
              <li key={u.href + u.title}>
                <Link to={u.href} className="record-row">
                  <span className="block text-sm text-muted">
                    {new Date(u.date).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}{' '}
                    · {u.category}
                  </span>
                  <span className="mt-1 block font-semibold text-primary underline">{u.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 6 — About */}
      <section className="mt-16 max-w-prose border-t border-line pt-10" aria-labelledby="about-heading">
        <h2 id="about-heading" className="text-2xl sm:text-3xl">
          {t('home.aboutHeading')}
        </h2>
        <p className="mt-3 text-muted">{t('home.aboutBody')}</p>
        <p className="mt-4">
          <Link to="/about" className="font-semibold">
            {t('home.aboutMore')}
          </Link>
        </p>
      </section>
    </div>
  );
}

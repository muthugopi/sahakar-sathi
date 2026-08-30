import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchSchemes } from '../lib/content';

const TASKS = [
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
    if (trimmed) navigate(`/assistant?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="container-page">
      <div className="max-w-prose">
        <h1 className="text-3xl sm:text-4xl">{t('home.heroHeading')}</h1>
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
            <button
              type="button"
              onClick={() => navigate('/assistant?voice=1')}
              className="btn-voice"
            >
              <span aria-hidden>🎙</span> {t('home.speakButton')}
            </button>
          </div>
        </form>
      </div>

      <section className="mt-14 max-w-prose" aria-labelledby="tasks-heading">
        <h2 id="tasks-heading" className="text-xl">
          {t('home.tasksHeading')}
        </h2>
        <ul className="register mt-4">
          {TASKS.map((item) => (
            <li key={item.key}>
              <Link to={item.to} className="register-row block py-4">
                <span className="block text-lg font-bold text-field-deep underline">
                  {t(`quickHelp.${item.key}.title`)}
                </span>
                <span className="mt-1 block text-muted">{t(`quickHelp.${item.key}.desc`)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {popularSchemes.data && popularSchemes.data.schemes.length > 0 && (
        <section className="mt-14 max-w-prose" aria-labelledby="schemes-heading">
          <h2 id="schemes-heading" className="text-xl">
            {t('home.schemesLabel')}
          </h2>
          <ul className="register mt-4">
            {popularSchemes.data.schemes.slice(0, 4).map((s) => (
              <li key={s.slug}>
                <Link to={`/schemes/${s.slug}`} className="register-row block py-4">
                  <span className="block text-lg font-bold text-field-deep underline">{s.title}</span>
                  <span className="mt-1 block text-muted">{s.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            <Link to="/schemes" className="font-bold">
              {t('schemes.backToAll')}
            </Link>
          </p>
        </section>
      )}

      <section className="mt-14 max-w-prose" aria-labelledby="grievance-heading">
        <h2 id="grievance-heading" className="text-xl">
          {t('home.grievanceCalloutTitle')}
        </h2>
        <p className="mt-3 text-muted">{t('home.grievanceCalloutBody')}</p>
        <div className="mt-4">
          <Link to="/grievance" className="btn-primary">
            {t('home.grievanceCalloutAction')}
          </Link>
        </div>
      </section>

      <div className="mt-14 max-w-prose">
        <p className="inset-brand">{t('home.trustNote')}</p>
      </div>
    </div>
  );
}

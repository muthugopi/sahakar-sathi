import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import type { ContentSectionCode } from '@sahakar/shared';
import { fetchContentSection } from '../lib/content';
import { QueryBoundary } from '../components/QueryBoundary';
import { TopicList } from '../components/content/TopicList';
import { AskAssistantLink } from '../components/AskAssistantLink';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';

const RESOURCE_SECTIONS: { to: string; key: string }[] = [
  { to: '/cooperative', key: 'cooperative_law' },
  { to: '/pacs', key: 'pacs' },
  { to: '/money', key: 'financial_literacy' },
  { to: '/pmfby', key: 'pmfby' },
];

/** A digital reference book: a sticky section rail beside a spacious topic list. */
export function ContentSectionPage({ section }: { section: ContentSectionCode }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? i18n.language ?? 'en';
  const query = useQuery({
    queryKey: ['content', section, lang],
    queryFn: () => fetchContentSection(section, lang),
    staleTime: 30 * 60_000,
  });

  const key = section.toLowerCase();
  const steps =
    section === 'PMFBY'
      ? (t('sections.pmfby.steps', { returnObjects: true }) as string[])
      : null;

  return (
    <>
      <PageHero
        eyebrow={t('nav.resources')}
        title={t(`sections.${key}.title`)}
        lead={t(`sections.${key}.intro`)}
        size="large"
      />

      {/* PMFBY only: a numbered step-by-step journey */}
      {steps && Array.isArray(steps) && (
        <section className="container-wide section-tight section-divide">
          <Reveal>
            <h2 className="font-display text-2xl font-normal tracking-tight text-ink sm:text-3xl">
              {t('sections.pmfby.journeyTitle')}
            </h2>
          </Reveal>
          <ol className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal as="li" key={i} delay={i}>
                <p className="font-mono text-sm text-primary">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="mt-2 text-ink">{step}</p>
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      <div className="container-wide section section-divide">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="Resource sections" className="min-w-0">
            <p className="eyebrow">{t('nav.resources')}</p>
            <ul className="mt-4 flex gap-x-5 gap-y-1 overflow-x-auto border-b border-line pb-3 lg:sticky lg:top-28 lg:flex-col lg:gap-2 lg:overflow-visible lg:border-b-0 lg:pb-0">
              {RESOURCE_SECTIONS.map((s) => (
                <li key={s.to} className="shrink-0">
                  <NavLink
                    to={s.to}
                    className={({ isActive }) =>
                      `block whitespace-nowrap py-1 text-sm no-underline transition-colors lg:whitespace-normal ${
                        isActive
                          ? 'font-semibold text-ink'
                          : 'font-medium text-ink-2 hover:text-ink'
                      }`
                    }
                  >
                    {t(`sections.${s.key}.title`)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            <QueryBoundary
              isLoading={query.isLoading}
              isError={query.isError}
              onRetry={() => void query.refetch()}
            >
              {query.data && <TopicList topics={query.data.topics} uiLang={lang} />}
            </QueryBoundary>

            <div className="mt-16 border-t border-line pt-10">
              <h2 className="font-display text-xl font-normal text-ink">
                {t('content.stillNeedHelpTitle')}
              </h2>
              <p className="mt-3 max-w-prose text-ink-2">{t('content.stillNeedHelpBody')}</p>
              <div className="mt-5">
                <AskAssistantLink question={t(`sections.${key}.askExample`)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

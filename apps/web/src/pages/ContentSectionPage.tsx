import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import type { ContentSectionCode } from '@sahakar/shared';
import { fetchContentSection } from '../lib/content';
import { QueryBoundary } from '../components/QueryBoundary';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { TopicList } from '../components/content/TopicList';
import { AskAssistantLink } from '../components/AskAssistantLink';

const RESOURCE_TABS: { to: string; section: ContentSectionCode; key: string }[] = [
  { to: '/cooperative', section: 'COOPERATIVE_LAW', key: 'cooperative_law' },
  { to: '/pacs', section: 'PACS', key: 'pacs' },
  { to: '/money', section: 'FINANCIAL_LITERACY', key: 'financial_literacy' },
  { to: '/pmfby', section: 'PMFBY', key: 'pmfby' },
];

/** One layout for Cooperative Law, PACS, Financial Literacy and PMFBY FAQ. */
export function ContentSectionPage({ section }: { section: ContentSectionCode }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? i18n.language ?? 'en';
  const query = useQuery({
    queryKey: ['content', section, lang],
    queryFn: () => fetchContentSection(section, lang),
    staleTime: 30 * 60_000,
  });

  const key = section.toLowerCase();

  return (
    <div className="container-page max-w-prose">
      <Breadcrumbs
        trail={[{ label: t('nav.resources'), to: '/cooperative' }, { label: t(`sections.${key}.title`) }]}
      />

      <h1 className="text-3xl sm:text-4xl">{t(`sections.${key}.title`)}</h1>
      <p className="mt-4 text-lg text-ink-2">{t(`sections.${key}.intro`)}</p>

      <nav aria-label="Resource sections" className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-b border-line">
        {RESOURCE_TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `-mb-px whitespace-nowrap border-b-2 pb-3 text-sm font-semibold no-underline transition-colors ${
                isActive
                  ? 'border-primary text-ink'
                  : 'border-transparent text-ink-2 hover:text-ink'
              }`
            }
          >
            {t(`sections.${tab.key}.eyebrow`)}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8">
        <QueryBoundary
          isLoading={query.isLoading}
          isError={query.isError}
          onRetry={() => void query.refetch()}
        >
          {query.data && <TopicList topics={query.data.topics} uiLang={lang} />}
        </QueryBoundary>
      </div>

      <div className="mt-16 border-t border-line pt-8">
        <h2 className="text-xl">{t('content.stillNeedHelpTitle')}</h2>
        <p className="mt-3 text-ink-2">{t('content.stillNeedHelpBody')}</p>
        <div className="mt-4">
          <AskAssistantLink question={t(`sections.${key}.askExample`)} />
        </div>
      </div>
    </div>
  );
}

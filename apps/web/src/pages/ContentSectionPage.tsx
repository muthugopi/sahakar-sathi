import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { ContentSectionCode } from '@sahakar/shared';
import { fetchContentSection } from '../lib/content';
import { QueryBoundary } from '../components/QueryBoundary';
import { TopicList } from '../components/content/TopicList';
import { AskAssistantLink } from '../components/AskAssistantLink';

/** One layout for Cooperative Law, PACS, Financial Literacy and PMFBY FAQ. */
export function ContentSectionPage({ section }: { section: ContentSectionCode }) {
  const { t } = useTranslation();
  const query = useQuery({
    queryKey: ['content', section],
    queryFn: () => fetchContentSection(section),
    staleTime: 30 * 60_000,
  });

  const key = section.toLowerCase();

  return (
    <div className="container-page max-w-6xl py-8 sm:py-12">
      <div className="border-b border-line pb-9">
        <p className="eyebrow">{t(`sections.${key}.eyebrow`)}</p>
        <h1 className="mt-4 text-5xl tracking-[-0.07em] text-field-deep sm:text-6xl">{t(`sections.${key}.title`)}</h1>
        <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">{t(`sections.${key}.intro`)}</p>
      </div>

      <div className="mt-10">
        <QueryBoundary
          isLoading={query.isLoading}
          isError={query.isError}
          onRetry={() => void query.refetch()}
        >
          {query.data && <TopicList topics={query.data.topics} />}
        </QueryBoundary>
      </div>

      <div className="mt-12 border-t border-line pt-8">
        <p className="text-2xl font-semibold tracking-[-0.05em] text-field-deep">{t('content.stillNeedHelpTitle')}</p>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-muted">{t('content.stillNeedHelpBody')}</p>
        <div className="mt-5">
          <AskAssistantLink question={t(`sections.${key}.askExample`)} />
        </div>
      </div>
    </div>
  );
}

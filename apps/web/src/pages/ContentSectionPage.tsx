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
    <div className="container-page max-w-3xl py-8">
      <p className="eyebrow">{t(`sections.${key}.eyebrow`)}</p>
      <h1 className="mt-2 text-2xl sm:text-3xl">{t(`sections.${key}.title`)}</h1>
      <p className="mt-3 max-w-prose text-lg text-muted">{t(`sections.${key}.intro`)}</p>

      <div className="mt-8">
        <QueryBoundary
          isLoading={query.isLoading}
          isError={query.isError}
          onRetry={() => void query.refetch()}
        >
          {query.data && <TopicList topics={query.data.topics} />}
        </QueryBoundary>
      </div>

      <div className="mt-10 rounded-lg border border-line bg-field-wash p-5">
        <p className="font-semibold">{t('content.stillNeedHelpTitle')}</p>
        <p className="mt-1 text-sm text-muted">{t('content.stillNeedHelpBody')}</p>
        <div className="mt-3">
          <AskAssistantLink question={t(`sections.${key}.askExample`)} />
        </div>
      </div>
    </div>
  );
}

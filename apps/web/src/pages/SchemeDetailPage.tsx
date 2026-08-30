import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchScheme } from '../lib/content';
import { QueryBoundary } from '../components/QueryBoundary';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RichText } from '../components/RichText';
import { AskAssistantLink } from '../components/AskAssistantLink';

export function SchemeDetailPage() {
  const { t } = useTranslation();
  const { slug = '' } = useParams();
  const query = useQuery({
    queryKey: ['scheme', slug],
    queryFn: () => fetchScheme(slug),
    staleTime: 30 * 60_000,
  });

  const scheme = query.data?.scheme;

  return (
    <div className="container-page max-w-prose">
      <Breadcrumbs
        trail={[
          { label: t('sections.schemes.title'), to: '/schemes' },
          { label: scheme?.title ?? '…' },
        ]}
      />

      <QueryBoundary
        isLoading={query.isLoading}
        isError={query.isError}
        onRetry={() => void query.refetch()}
      >
        {scheme && (
          <article>
            <h1 className="text-3xl sm:text-4xl">{scheme.title}</h1>
            <p className="mt-4 text-lg text-muted">{scheme.summary}</p>
            <p className="mt-2 text-sm text-muted">
              {scheme.state ?? t('schemes.national')} · {scheme.targetUsers.join(', ')}
            </p>

            <p className="inset mt-6">{t('schemes.disclaimer')}</p>

            <Section heading={t('schemes.field.purpose')}>{scheme.purpose}</Section>
            <Section heading={t('schemes.field.eligibility')}>{scheme.eligibility}</Section>
            <Section heading={t('schemes.field.benefits')}>{scheme.benefits}</Section>

            <h2 className="mt-8 text-xl">{t('schemes.field.documents')}</h2>
            <ul className="mt-2 list-disc space-y-1 ps-6">
              {scheme.requiredDocuments.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>

            <Section heading={t('schemes.field.process')}>{scheme.applicationProcess}</Section>

            <div className="mt-10 border-t-4 border-field pt-6">
              <h2 className="text-xl">{t('schemes.field.source')}</h2>
              <p className="mt-2">{scheme.officialSource}</p>
              {scheme.officialUrl && (
                <p className="mt-1">
                  <a href={scheme.officialUrl} target="_blank" rel="noreferrer noopener" className="font-bold">
                    {t('content.officialSource')}
                  </a>
                </p>
              )}
              {scheme.verifiedAt && (
                <p className="mt-1 text-sm text-muted">
                  {t('assistant.verifiedOn', { date: scheme.verifiedAt.slice(0, 10) })}
                </p>
              )}
            </div>

            <div className="mt-8">
              <AskAssistantLink question={t('schemes.askExample', { title: scheme.title })} />
            </div>
          </article>
        )}
      </QueryBoundary>
    </div>
  );
}

function Section({ heading, children }: { heading: string; children: string }) {
  return (
    <>
      <h2 className="mt-8 text-xl">{heading}</h2>
      <div className="mt-2">
        <RichText text={children} />
      </div>
    </>
  );
}

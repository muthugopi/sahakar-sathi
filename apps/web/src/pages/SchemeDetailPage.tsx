import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchScheme } from '../lib/content';
import { QueryBoundary } from '../components/QueryBoundary';
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
    <div className="container-page max-w-3xl py-8">
      <Link to="/schemes" className="text-sm font-medium text-field-deep underline">
        ← {t('schemes.backToAll')}
      </Link>

      <QueryBoundary
        isLoading={query.isLoading}
        isError={query.isError}
        onRetry={() => void query.refetch()}
      >
        {scheme && (
          <article className="mt-4">
            <h1 className="text-2xl sm:text-3xl">{scheme.title}</h1>
            <p className="mt-3 text-lg text-muted">{scheme.summary}</p>

            <div className="mt-4 flex flex-wrap gap-1.5 text-xs">
              <span className="rounded border border-line px-2 py-0.5">
                {scheme.state ?? t('schemes.national')}
              </span>
              {scheme.targetUsers.map((u) => (
                <span key={u} className="rounded border border-line px-2 py-0.5 text-muted">
                  {u}
                </span>
              ))}
            </div>

            <dl className="mt-6 space-y-6">
              <Section term={t('schemes.field.purpose')}>{scheme.purpose}</Section>
              <Section term={t('schemes.field.eligibility')}>{scheme.eligibility}</Section>
              <Section term={t('schemes.field.benefits')}>{scheme.benefits}</Section>
              <div>
                <dt className="font-semibold">{t('schemes.field.documents')}</dt>
                <dd>
                  <ul className="mt-1 list-disc space-y-1 ps-5">
                    {scheme.requiredDocuments.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <Section term={t('schemes.field.process')}>{scheme.applicationProcess}</Section>
            </dl>

            <div className="mt-8 rounded-lg border border-line bg-panel p-4 text-sm">
              <p>
                <span className="font-semibold">{t('schemes.field.source')}: </span>
                {scheme.officialSource}
              </p>
              {scheme.officialUrl && (
                <a
                  href={scheme.officialUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-1 inline-block font-medium text-field-deep underline"
                >
                  {t('content.officialSource')} ↗
                </a>
              )}
              {scheme.verifiedAt && (
                <p className="mt-1 text-muted">
                  {t('assistant.verifiedOn', { date: scheme.verifiedAt.slice(0, 10) })}
                </p>
              )}
            </div>

            <p className="mt-4 border-s-4 border-marigold ps-3 text-sm text-muted">
              {t('schemes.disclaimer')}
            </p>

            <div className="mt-6">
              <AskAssistantLink question={t('schemes.askExample', { title: scheme.title })} />
            </div>
          </article>
        )}
      </QueryBoundary>
    </div>
  );
}

function Section({ term, children }: { term: string; children: string }) {
  return (
    <div>
      <dt className="font-semibold">{term}</dt>
      <dd className="mt-1">
        <RichText text={children} />
      </dd>
    </div>
  );
}

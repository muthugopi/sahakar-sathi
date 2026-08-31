import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchScheme } from '../lib/content';
import { Link } from 'react-router-dom';
import { QueryBoundary } from '../components/QueryBoundary';
import { RichText } from '../components/RichText';
import { AskAssistantLink } from '../components/AskAssistantLink';
import { Icon } from '../components/Icon';

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
    <div className="container-wide max-w-prose pb-20 pt-14 sm:pt-20">
      <Link
        to="/schemes"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink-2 no-underline hover:text-ink"
      >
        <Icon name="chevron" className="h-4 w-4 rotate-180" />
        {t('sections.schemes.title')}
      </Link>

      <QueryBoundary
        isLoading={query.isLoading}
        isError={query.isError}
        onRetry={() => void query.refetch()}
      >
        {scheme && (
          <article className="mt-8">
            <p className="eyebrow">{t('sections.schemes.eyebrow')}</p>
            <h1 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              {scheme.title}
            </h1>
            <p className="mt-5 text-lg text-ink-2">{scheme.summary}</p>
            <p className="mt-3 text-sm text-ink-2">
              {scheme.state ?? t('schemes.national')} · {scheme.targetUsers.join(', ')}
            </p>

            <p className="inset mt-8">{t('schemes.disclaimer')}</p>

            <Section heading={t('schemes.field.purpose')}>{scheme.purpose}</Section>
            <Section heading={t('schemes.field.eligibility')}>{scheme.eligibility}</Section>
            <Section heading={t('schemes.field.benefits')}>{scheme.benefits}</Section>

            <h2 className="mt-10 font-display text-xl font-normal text-ink">
              {t('schemes.field.documents')}
            </h2>
            <ul className="mt-2 list-disc space-y-1 ps-6">
              {scheme.requiredDocuments.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>

            <Section heading={t('schemes.field.process')}>{scheme.applicationProcess}</Section>

            <div className="mt-14 border-t border-line pt-8">
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
                <p className="mt-1 text-sm text-ink-2">
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
      <h2 className="mt-10 font-display text-xl font-normal text-ink">{heading}</h2>
      <div className="mt-3">
        <RichText text={children} />
      </div>
    </>
  );
}

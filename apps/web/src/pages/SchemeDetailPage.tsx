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
    <div className="container-page max-w-5xl py-8 sm:py-10">
      <Link to="/schemes" className="inline-flex items-center gap-2 text-sm font-semibold text-field-deep hover:text-field">
        ← {t('schemes.backToAll')}
      </Link>

      <QueryBoundary
        isLoading={query.isLoading}
        isError={query.isError}
        onRetry={() => void query.refetch()}
      >
        {scheme && (
          <article className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="section-shell p-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badged">{scheme.state ?? t('schemes.national')}</span>
                {scheme.targetUsers.map((u) => (
                  <span key={u} className="rounded-full border border-line bg-soft px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-muted">
                    {u}
                  </span>
                ))}
              </div>

              <h1 className="mt-5 text-3xl tracking-[-0.05em] text-field-deep sm:text-4xl">{scheme.title}</h1>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-muted">{scheme.summary}</p>

              <dl className="mt-8 space-y-7">
                <Section term={t('schemes.field.purpose')}>{scheme.purpose}</Section>
                <Section term={t('schemes.field.eligibility')}>{scheme.eligibility}</Section>
                <Section term={t('schemes.field.benefits')}>{scheme.benefits}</Section>
                <div>
                  <dt className="text-sm font-semibold uppercase tracking-[0.1em] text-muted">{t('schemes.field.documents')}</dt>
                  <dd className="mt-2">
                    <ul className="space-y-2 pl-5 text-[0.98rem] text-ink">
                      {scheme.requiredDocuments.map((d) => (
                        <li key={d} className="list-disc leading-7">
                          {d}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <Section term={t('schemes.field.process')}>{scheme.applicationProcess}</Section>
              </dl>
            </div>

            <aside className="space-y-4">
              <div className="section-shell p-5">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted">Official source</p>
                <p className="mt-3 text-base font-medium text-ink">{scheme.officialSource}</p>
                {scheme.officialUrl && (
                  <a
                    href={scheme.officialUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-field-deep hover:text-field"
                  >
                    {t('content.officialSource')} ↗
                  </a>
                )}
                {scheme.verifiedAt && (
                  <p className="mt-3 text-sm text-muted">
                    {t('assistant.verifiedOn', { date: scheme.verifiedAt.slice(0, 10) })}
                  </p>
                )}
              </div>

              <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-amber-800">Disclaimer</p>
                <p className="mt-2 text-sm leading-6 text-amber-900">{t('schemes.disclaimer')}</p>
              </div>

              <div className="section-shell p-5">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted">Need more clarity?</p>
                <div className="mt-4">
                  <AskAssistantLink question={t('schemes.askExample', { title: scheme.title })} />
                </div>
              </div>
            </aside>
          </article>
        )}
      </QueryBoundary>
    </div>
  );
}

function Section({ term, children }: { term: string; children: string }) {
  return (
    <div>
      <dt className="text-sm font-semibold uppercase tracking-[0.1em] text-muted">{term}</dt>
      <dd className="mt-2">
        <RichText text={children} />
      </dd>
    </div>
  );
}

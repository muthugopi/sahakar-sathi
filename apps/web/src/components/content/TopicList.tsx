import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ContentTopic } from '@sahakar/shared';
import { RichText } from '../RichText';
import { AskAssistantLink } from '../AskAssistantLink';

export function TopicList({ topics }: { topics: ContentTopic[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(topics[0]?.slug ?? null);

  return (
    <div className="space-y-4">
      {topics.map((topic) => (
        <TopicRow
          key={topic.slug}
          topic={topic}
          open={openSlug === topic.slug}
          onToggle={() => setOpenSlug((s) => (s === topic.slug ? null : topic.slug))}
        />
      ))}
    </div>
  );
}

function TopicRow({
  topic,
  open,
  onToggle,
}: {
  topic: ContentTopic;
  open: boolean;
  onToggle: () => void;
}) {
  const { t } = useTranslation();
  const [view, setView] = useState<'simple' | 'detailed'>('simple');
  const hasDetailed = Boolean(topic.detailedExplanation);
  const panelId = `topic-${topic.slug}`;

  return (
    <article className={`rounded-[1.5rem] border p-4 sm:p-5 ${open ? 'border-field/20 bg-panel shadow-subtle' : 'border-line bg-soft/60'}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted">{topic.topic}</p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-field-deep">{topic.title}</h3>
        </div>
        <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-line bg-panel text-xl text-field-deep">
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div id={panelId} className="mt-5 border-t border-line pt-4">
          {hasDetailed && (
            <div
              role="tablist"
              aria-label={topic.title}
              className="mb-4 inline-flex rounded-full border border-line bg-soft p-1 text-sm"
            >
              <button
                role="tab"
                aria-selected={view === 'simple'}
                onClick={() => setView('simple')}
                className={`rounded-full px-3 py-1.5 font-medium ${
                  view === 'simple' ? 'bg-field text-white' : 'text-muted'
                }`}
              >
                {t('content.simple')}
              </button>
              <button
                role="tab"
                aria-selected={view === 'detailed'}
                onClick={() => setView('detailed')}
                className={`rounded-full px-3 py-1.5 font-medium ${
                  view === 'detailed' ? 'bg-field text-white' : 'text-muted'
                }`}
              >
                {t('content.detailed')}
              </button>
            </div>
          )}

          <div className="space-y-4">
            <RichText
              text={
                view === 'detailed' && topic.detailedExplanation
                  ? topic.detailedExplanation
                  : topic.simpleExplanation
              }
            />

            {topic.example && (
              <div className="rounded-2xl border border-field/10 bg-field-soft p-4">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-field-deep">{t('content.example')}</p>
                <div className="mt-2">
                  <RichText text={topic.example} />
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            <span>{topic.authority}</span>
            {topic.sourceUrl && (
              <a
                href={topic.sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-field-deep underline"
              >
                {t('content.officialSource')} ↗
              </a>
            )}
            {topic.verifiedAt && (
              <span>{t('assistant.verifiedOn', { date: topic.verifiedAt.slice(0, 10) })}</span>
            )}
          </div>

          <div className="mt-4">
            <AskAssistantLink question={topic.title} variant="plain" />
          </div>
        </div>
      )}
    </article>
  );
}

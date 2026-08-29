import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ContentTopic } from '@sahakar/shared';
import { RichText } from '../RichText';
import { AskAssistantLink } from '../AskAssistantLink';

export function TopicList({ topics }: { topics: ContentTopic[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(topics[0]?.slug ?? null);

  return (
    <div className="register">
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
    <div className="py-1">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-baseline gap-3 py-3 text-start"
        >
          <span className="eyebrow shrink-0">{topic.topic}</span>
          <span className="min-w-0 flex-1 font-semibold">{topic.title}</span>
          <span aria-hidden className="shrink-0 text-field-deep">
            {open ? '−' : '+'}
          </span>
        </button>
      </h3>

      {open && (
        <div id={panelId} className="pb-5 ps-1">
          {hasDetailed && (
            <div
              role="tablist"
              aria-label={topic.title}
              className="mb-3 inline-flex rounded border border-line bg-paper p-0.5 text-sm"
            >
              <button
                role="tab"
                aria-selected={view === 'simple'}
                onClick={() => setView('simple')}
                className={`rounded px-3 py-1.5 font-medium ${
                  view === 'simple' ? 'bg-field text-white' : 'text-ink'
                }`}
              >
                {t('content.simple')}
              </button>
              <button
                role="tab"
                aria-selected={view === 'detailed'}
                onClick={() => setView('detailed')}
                className={`rounded px-3 py-1.5 font-medium ${
                  view === 'detailed' ? 'bg-field text-white' : 'text-ink'
                }`}
              >
                {t('content.detailed')}
              </button>
            </div>
          )}

          <RichText
            text={
              view === 'detailed' && topic.detailedExplanation
                ? topic.detailedExplanation
                : topic.simpleExplanation
            }
          />

          {topic.example && (
            <div className="mt-4 rounded border border-field/30 bg-field-wash p-3">
              <p className="eyebrow mb-1">{t('content.example')}</p>
              <RichText text={topic.example} />
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
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

          <div className="mt-3">
            <AskAssistantLink question={topic.title} variant="plain" />
          </div>
        </div>
      )}
    </div>
  );
}

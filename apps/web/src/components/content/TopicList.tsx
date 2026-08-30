import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ContentTopic } from '@sahakar/shared';
import { RichText } from '../RichText';
import { AskAssistantLink } from '../AskAssistantLink';

/** GOV.UK-style accordion: a bordered list of topics, each expandable. */
export function TopicList({ topics }: { topics: ContentTopic[] }) {
  const [open, setOpen] = useState<Set<string>>(new Set(topics[0] ? [topics[0].slug] : []));

  const toggle = (slug: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });

  return (
    <div className="border-t border-line">
      {topics.map((topic) => (
        <TopicRow key={topic.slug} topic={topic} open={open.has(topic.slug)} onToggle={() => toggle(topic.slug)} />
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
    <div className="border-b border-line">
      <h3 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-baseline justify-between gap-4 py-4 text-left"
        >
          <span className="text-lg font-bold text-field-deep underline">{topic.title}</span>
          <span className="shrink-0 font-bold text-field-deep">
            {open ? t('content.hide') : t('content.show')}
          </span>
        </button>
      </h3>

      {open && (
        <div id={panelId} className="pb-6">
          {hasDetailed && (
            <div className="mb-4 flex gap-4 text-base" role="group" aria-label={topic.title}>
              <button
                type="button"
                aria-pressed={view === 'simple'}
                onClick={() => setView('simple')}
                className={view === 'simple' ? 'font-bold text-ink underline' : 'text-field-deep underline'}
              >
                {t('content.simple')}
              </button>
              <button
                type="button"
                aria-pressed={view === 'detailed'}
                onClick={() => setView('detailed')}
                className={view === 'detailed' ? 'font-bold text-ink underline' : 'text-field-deep underline'}
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
            <div className="mt-4 inset">
              <p className="font-bold">{t('content.example')}</p>
              <div className="mt-2">
                <RichText text={topic.example} />
              </div>
            </div>
          )}

          <p className="mt-5 text-muted">
            {t('content.sourceLine', { authority: topic.authority })}
            {topic.sourceUrl && (
              <>
                {' — '}
                <a href={topic.sourceUrl} target="_blank" rel="noreferrer noopener" className="font-bold">
                  {t('content.officialSource')}
                </a>
              </>
            )}
            {topic.verifiedAt && (
              <>
                {'. '}
                {t('assistant.verifiedOn', { date: topic.verifiedAt.slice(0, 10) })}
              </>
            )}
          </p>

          <p className="mt-3">
            <AskAssistantLink question={topic.title} variant="plain" />
          </p>
        </div>
      )}
    </div>
  );
}

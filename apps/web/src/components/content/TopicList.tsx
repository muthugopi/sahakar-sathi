import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ContentTopic } from '@sahakar/shared';
import { RichText } from '../RichText';
import { AskAssistantLink } from '../AskAssistantLink';

/** A reference accordion — large serif topic titles, one open at a time to start. */
export function TopicList({ topics, uiLang = 'en' }: { topics: ContentTopic[]; uiLang?: string }) {
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
        <TopicRow
          key={topic.slug}
          topic={topic}
          uiLang={uiLang}
          open={open.has(topic.slug)}
          onToggle={() => toggle(topic.slug)}
        />
      ))}
    </div>
  );
}

function TopicRow({
  topic,
  uiLang,
  open,
  onToggle,
}: {
  topic: ContentTopic;
  uiLang: string;
  open: boolean;
  onToggle: () => void;
}) {
  const { t } = useTranslation();
  const [view, setView] = useState<'simple' | 'detailed'>('simple');
  const hasDetailed = Boolean(topic.detailedExplanation);
  const untranslated = uiLang !== 'en' && !topic.translated;
  const panelId = `topic-${topic.slug}`;

  return (
    <div className="border-b border-line" id={topic.slug}>
      <h3 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-start justify-between gap-6 py-6 text-left transition-colors hover:text-primary"
        >
          <span
            className={`font-display text-xl tracking-tight sm:text-2xl ${
              open ? 'text-primary' : 'text-ink'
            }`}
          >
            {topic.title}
          </span>
          <span
            aria-hidden
            className="mt-1 shrink-0 text-2xl font-light leading-none text-ink-2"
          >
            {open ? '−' : '+'}
          </span>
        </button>
      </h3>

      {open && (
        <div id={panelId} className="prose-block max-w-prose pb-9">
          {untranslated && (
            <div className="notice notice--warn mb-5">
              <p>{t('content.notTranslated')}</p>
              <p className="mt-2">
                <AskAssistantLink question={topic.title} variant="plain" />
              </p>
            </div>
          )}

          {hasDetailed && (
            <div className="mb-5 flex gap-5 text-sm" role="group" aria-label={topic.title}>
              <button
                type="button"
                aria-pressed={view === 'simple'}
                onClick={() => setView('simple')}
                className={
                  view === 'simple'
                    ? 'font-semibold text-ink underline underline-offset-4'
                    : 'text-ink-2 underline underline-offset-4 hover:text-ink'
                }
              >
                {t('content.simple')}
              </button>
              <button
                type="button"
                aria-pressed={view === 'detailed'}
                onClick={() => setView('detailed')}
                className={
                  view === 'detailed'
                    ? 'font-semibold text-ink underline underline-offset-4'
                    : 'text-ink-2 underline underline-offset-4 hover:text-ink'
                }
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
            <div className="inset mt-5">
              <p className="font-semibold">{t('content.example')}</p>
              <div className="mt-2">
                <RichText text={topic.example} />
              </div>
            </div>
          )}

          <p className="mt-6 text-sm text-ink-2">
            {t('content.sourceLine', { authority: topic.authority })}
            {topic.sourceUrl && (
              <>
                {' — '}
                <a
                  href={topic.sourceUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-semibold"
                >
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

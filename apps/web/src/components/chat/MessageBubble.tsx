import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ChatMessage } from '@sahakar/shared';
import { sendFeedback } from '../../lib/chat';
import { ConfidenceTag } from './ConfidenceTag';
import { SourceList } from './SourceList';
import { RichText } from '../RichText';
import { ListenButton } from './ListenButton';

export function MessageBubble({ message }: { message: ChatMessage }) {
  const { t } = useTranslation();
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex flex-col items-end">
        <span className="mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted">
          {t('assistant.you')}
        </span>
        <div className="max-w-[85%] rounded-[1.35rem] rounded-tr-sm bg-field px-4 py-2.5 text-sm leading-6 text-white shadow-sm">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start">
      <span className="mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-field-deep">
        {t('assistant.assistantName')}
      </span>
      <div className="max-w-[92%] rounded-[1.5rem] border border-line bg-panel p-4 shadow-sm">
        {message.confidence && (
          <div className="mb-3">
            <ConfidenceTag value={message.confidence} />
          </div>
        )}

        <div className="text-[0.98rem] leading-7 text-ink">
          <RichText text={message.content} />
        </div>

        {message.disclaimers?.map((d, i) => (
          <p
            key={i}
            className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
          >
            {d}
          </p>
        ))}

        {message.sources && message.sources.length > 0 && (
          <div className="mt-3">
            <SourceList sources={message.sources} />
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <ListenButton id={message.id} text={message.content} language={message.language} />
        </div>

        <FeedbackRow messageId={message.id} />
      </div>
    </div>
  );
}

function FeedbackRow({ messageId }: { messageId: string }) {
  const { t } = useTranslation();
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');

  const rate = async (rating: 'UP' | 'DOWN') => {
    setState('sending');
    try {
      await sendFeedback({ messageId, rating });
    } catch {
      /* non-critical — swallow */
    }
    setState('done');
  };

  if (state === 'done') {
    return <p className="mt-3 text-sm text-muted">{t('assistant.feedbackThanks')}</p>;
  }

  return (
    <div className="mt-3 flex items-center gap-2 text-sm">
      <span className="text-muted">{t('assistant.helpful')}</span>
      <button
        type="button"
        disabled={state === 'sending'}
        onClick={() => void rate('UP')}
        className="rounded-full border border-line bg-soft px-2.5 py-1 text-xs font-medium text-ink hover:bg-field-soft disabled:opacity-50"
      >
        {t('assistant.yes')}
      </button>
      <button
        type="button"
        disabled={state === 'sending'}
        onClick={() => void rate('DOWN')}
        className="rounded-full border border-line bg-soft px-2.5 py-1 text-xs font-medium text-ink hover:bg-field-soft disabled:opacity-50"
      >
        {t('assistant.no')}
      </button>
    </div>
  );
}

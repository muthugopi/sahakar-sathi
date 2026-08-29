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
        <span className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">
          {t('assistant.you')}
        </span>
        <div className="max-w-[85%] rounded-lg rounded-tr-sm bg-field text-white px-4 py-2.5">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start">
      <span className="mb-1 text-xs font-medium uppercase tracking-wide text-field-deep">
        {t('assistant.assistantName')}
      </span>
      <div className="max-w-[92%] border-s-2 border-field bg-panel ps-4 pe-3 py-3">
        {message.confidence && (
          <div className="mb-2">
            <ConfidenceTag value={message.confidence} />
          </div>
        )}

        <RichText text={message.content} />

        {message.disclaimers?.map((d, i) => (
          <p
            key={i}
            className="mt-3 rounded border border-marigold/40 bg-marigold/10 px-3 py-2 text-sm text-ink"
          >
            {d}
          </p>
        ))}

        {message.sources && message.sources.length > 0 && (
          <SourceList sources={message.sources} />
        )}

        <ListenButton id={message.id} text={message.content} language={message.language} />

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
        className="rounded border border-line px-2 py-1 hover:bg-field-wash disabled:opacity-50"
      >
        {t('assistant.yes')}
      </button>
      <button
        type="button"
        disabled={state === 'sending'}
        onClick={() => void rate('DOWN')}
        className="rounded border border-line px-2 py-1 hover:bg-field-wash disabled:opacity-50"
      >
        {t('assistant.no')}
      </button>
    </div>
  );
}

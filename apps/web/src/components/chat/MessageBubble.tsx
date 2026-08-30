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

  if (message.role === 'user') {
    return (
      <div>
        <p className="eyebrow">{t('assistant.you')}</p>
        <p className="mt-1 whitespace-pre-wrap bg-soft p-3">{message.content}</p>
      </div>
    );
  }

  return (
    <div className="border-l-4 border-field ps-4">
      <p className="eyebrow text-field-deep">{t('assistant.assistantName')}</p>

      {message.confidence && (
        <p className="mt-1">
          <ConfidenceTag value={message.confidence} />
        </p>
      )}

      <div className="mt-2">
        <RichText text={message.content} />
      </div>

      {message.disclaimers?.map((d, i) => (
        <p key={i} className="mt-3 border-l-4 border-clay bg-soft p-3 text-ink">
          {d}
        </p>
      ))}

      {message.sources && message.sources.length > 0 && (
        <div className="mt-3">
          <SourceList sources={message.sources} />
        </div>
      )}

      <div className="mt-3">
        <ListenButton id={message.id} text={message.content} language={message.language} />
      </div>

      <FeedbackRow messageId={message.id} />
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
      /* non-critical */
    }
    setState('done');
  };

  if (state === 'done') {
    return <p className="mt-3 text-muted">{t('assistant.feedbackThanks')}</p>;
  }

  return (
    <p className="mt-3 flex items-center gap-4">
      <span className="text-muted">{t('assistant.helpful')}</span>
      <button
        type="button"
        disabled={state === 'sending'}
        onClick={() => void rate('UP')}
        className="font-bold text-field-deep underline disabled:opacity-50"
      >
        {t('assistant.yes')}
      </button>
      <button
        type="button"
        disabled={state === 'sending'}
        onClick={() => void rate('DOWN')}
        className="font-bold text-field-deep underline disabled:opacity-50"
      >
        {t('assistant.no')}
      </button>
    </p>
  );
}

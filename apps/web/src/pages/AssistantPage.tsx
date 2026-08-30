import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ChatMessage, KnowledgeCategory, LanguageCode } from '@sahakar/shared';
import { ApiRequestError } from '../lib/api';
import {
  clearConversationId,
  getHistory,
  loadConversationId,
  saveConversationId,
  sendMessage,
} from '../lib/chat';
import { useOnlineStatus } from '../lib/useOnlineStatus';
import { MessageBubble } from '../components/chat/MessageBubble';
import { Composer } from '../components/chat/Composer';
import { SpeechProvider, useSpeech } from '../components/chat/SpeechContext';

const CATEGORIES: KnowledgeCategory[] = [
  'MINISTRY_SCHEME',
  'PMFBY_AGRICULTURE',
  'PACS_SERVICE',
  'COOPERATIVE_LAW',
  'FINANCIAL_LITERACY',
  'GRIEVANCE_PROCESS',
];

const AUTO_READ_KEY = 'sahakar.autoRead';

let tempId = 0;
const nextTempId = () => `local-${++tempId}`;

export function AssistantPage() {
  return (
    <SpeechProvider>
      <AssistantView />
    </SpeechProvider>
  );
}

function AssistantView() {
  const { t, i18n } = useTranslation();
  const online = useOnlineStatus();
  const [params, setParams] = useSearchParams();
  const speech = useSpeech();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(() => loadConversationId());
  const [category, setCategory] = useState<KnowledgeCategory | ''>('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRead, setAutoRead] = useState(() => {
    try {
      return localStorage.getItem(AUTO_READ_KEY) === '1';
    } catch {
      return false;
    }
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const bootstrapped = useRef(false);

  const language = (i18n.resolvedLanguage ?? 'en') as LanguageCode;

  const toggleAutoRead = () => {
    setAutoRead((v) => {
      const next = !v;
      try {
        localStorage.setItem(AUTO_READ_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      if (!next) speech.stop();
      return next;
    });
  };

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    });
  }, []);

  const submit = useCallback(
    async (text: string) => {
      setError(null);
      setBusy(true);
      const userMsg: ChatMessage = {
        id: nextTempId(),
        role: 'user',
        content: text,
        language,
        createdAt: new Date().toISOString(),
      };
      setMessages((m) => [...m, userMsg]);
      scrollToEnd();

      try {
        const res = await sendMessage({
          message: text,
          conversationId: conversationId ?? undefined,
          language,
          category: category || undefined,
        });
        setConversationId(res.conversationId);
        saveConversationId(res.conversationId);
        setMessages((m) => [...m, res.reply]);
        scrollToEnd();
        if (autoRead) speech.speak(res.reply.id, res.reply.content, res.reply.language);
      } catch (err) {
        setMessages((m) => m.filter((x) => x.id !== userMsg.id));
        setError(err instanceof ApiRequestError ? err.message : t('assistant.errorSend'));
      } finally {
        setBusy(false);
      }
    },
    [autoRead, category, conversationId, language, scrollToEnd, speech, t],
  );

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    const q = params.get('q');
    const startFresh = async () => {
      if (q) {
        setParams({}, { replace: true });
        await submit(q);
      }
    };

    if (conversationId) {
      getHistory(conversationId)
        .then((h) => setMessages(h.messages))
        .catch(() => {
          clearConversationId();
          setConversationId(null);
        })
        .finally(() => void startFresh());
    } else {
      void startFresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const newChat = () => {
    speech.stop();
    clearConversationId();
    setConversationId(null);
    setMessages([]);
    setError(null);
  };

  const suggestions = t('home.examples', { returnObjects: true }) as string[];

  return (
    <div className="container-page flex max-w-prose flex-col">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl sm:text-4xl">{t('assistant.title')}</h1>
        {messages.length > 0 && (
          <button type="button" onClick={newChat} className="btn-link shrink-0 text-sm">
            {t('assistant.newChat')}
          </button>
        )}
      </div>
      <p className="mt-3 max-w-prose text-ink-2">{t('assistant.intro')}</p>

      <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-3">
        <div>
          <label htmlFor="focus" className="field-label">
            {t('assistant.categoriesLabel')}
          </label>
          <select
            id="focus"
            value={category}
            onChange={(e) => setCategory(e.target.value as KnowledgeCategory | '')}
            className="field-shell mt-1"
          >
            <option value="">{t('assistant.anyTopic')}</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(`assistant.category.${c}`)}
              </option>
            ))}
          </select>
        </div>
        {speech.supported && (
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={autoRead}
              onChange={toggleAutoRead}
              className="h-5 w-5"
            />
            {t('voice.autoRead')}
          </label>
        )}
      </div>

      <div
        ref={scrollRef}
        className="mt-5 max-h-[70vh] min-h-[18rem] flex-1 space-y-5 overflow-y-auto py-1"
        aria-live="polite"
      >
        {messages.length === 0 && !busy && (
          <div>
            <p className="field-label">{t('home.examplesLabel')}</p>
            <ul className="mt-2 space-y-2">
              {suggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => void submit(s)}
                    disabled={!online}
                    className="text-start font-bold text-primary underline disabled:opacity-50"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}

        {busy && (
          <p className="text-ink-2" role="status">
            {t('assistant.thinking')}
          </p>
        )}

        {error && (
          <div role="alert" className="notice notice--error">
            <p className="font-semibold">{error}</p>
            <button
              type="button"
              onClick={() => {
                const lastUser = [...messages].reverse().find((m) => m.role === 'user');
                if (lastUser) void submit(lastUser.content);
                else setError(null);
              }}
              className="btn-secondary mt-3"
            >
              {t('assistant.retry')}
            </button>
          </div>
        )}
      </div>

      {!online && (
        <div className="notice notice--warn mt-3">
          <p>{t('assistant.offlineNote')}</p>
        </div>
      )}

      <div className="mt-3">
        <Composer
          onSend={(text) => void submit(text)}
          language={language}
          disabled={!online || busy}
          busy={busy}
          autoListen={params.get('voice') === '1'}
        />
      </div>
    </div>
  );
}

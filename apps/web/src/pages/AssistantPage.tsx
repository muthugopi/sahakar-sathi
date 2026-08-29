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

const CATEGORIES: KnowledgeCategory[] = [
  'MINISTRY_SCHEME',
  'PMFBY_AGRICULTURE',
  'PACS_SERVICE',
  'COOPERATIVE_LAW',
  'FINANCIAL_LITERACY',
  'GRIEVANCE_PROCESS',
];

let tempId = 0;
const nextTempId = () => `local-${++tempId}`;

export function AssistantPage() {
  const { t, i18n } = useTranslation();
  const online = useOnlineStatus();
  const [params, setParams] = useSearchParams();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(() => loadConversationId());
  const [category, setCategory] = useState<KnowledgeCategory | undefined>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bootstrapped = useRef(false);

  const language = (i18n.resolvedLanguage ?? 'en') as LanguageCode;

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
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
          category,
        });
        setConversationId(res.conversationId);
        saveConversationId(res.conversationId);
        setMessages((m) => [...m, res.reply]);
        scrollToEnd();
      } catch (err) {
        setMessages((m) => m.filter((x) => x.id !== userMsg.id));
        setError(err instanceof ApiRequestError ? err.message : t('assistant.errorSend'));
      } finally {
        setBusy(false);
      }
    },
    [category, conversationId, language, scrollToEnd, t],
  );

  // Load prior conversation, then act on ?q= from the home page.
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
    clearConversationId();
    setConversationId(null);
    setMessages([]);
    setError(null);
  };

  const suggestions = t('home.examples', { returnObjects: true }) as string[];

  return (
    <div className="container-page flex min-h-[calc(100dvh-8rem)] max-w-3xl flex-col py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl">{t('assistant.title')}</h1>
          <p className="mt-1 max-w-prose text-muted">{t('assistant.intro')}</p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={newChat}
            className="shrink-0 rounded border border-line px-3 py-1.5 text-sm font-medium hover:bg-field-wash"
          >
            {t('assistant.newChat')}
          </button>
        )}
      </div>

      {/* Category focus */}
      <div className="mt-4">
        <p className="eyebrow mb-2">{t('assistant.categoriesLabel')}</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory((cur) => (cur === c ? undefined : c))}
              className={`rounded border px-3 py-1.5 text-sm transition-colors ${
                category === c
                  ? 'border-field bg-field text-white'
                  : 'border-line bg-panel hover:bg-field-wash'
              }`}
            >
              {t(`assistant.category.${c}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation */}
      <div
        ref={scrollRef}
        className="mt-4 flex-1 space-y-5 overflow-y-auto rounded-lg border border-line bg-paper p-4"
        aria-live="polite"
      >
        {messages.length === 0 && !busy && (
          <div>
            <p className="text-muted">{t('home.examplesLabel')}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => void submit(s)}
                    disabled={!online}
                    className="rounded border border-line bg-panel px-3 py-2 text-sm hover:bg-field-wash disabled:opacity-50"
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
          <div className="flex items-center gap-2 text-muted" role="status">
            <span className="inline-flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-field [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-field [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-field" />
            </span>
            {t('assistant.thinking')}
          </div>
        )}

        {error && (
          <div role="alert" className="rounded border border-clay/40 bg-clay/5 p-3 text-clay">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => {
                const lastUser = [...messages].reverse().find((m) => m.role === 'user');
                if (lastUser) void submit(lastUser.content);
                else setError(null);
              }}
              className="mt-2 rounded border border-clay px-3 py-1.5 text-sm font-medium hover:bg-clay/10"
            >
              {t('assistant.retry')}
            </button>
          </div>
        )}
      </div>

      {!online && (
        <p className="mt-2 rounded border border-marigold/40 bg-marigold/10 px-3 py-2 text-sm">
          {t('assistant.offlineNote')}
        </p>
      )}

      <div className="mt-2">
        <Composer onSend={(text) => void submit(text)} disabled={!online || busy} busy={busy} />
      </div>
    </div>
  );
}

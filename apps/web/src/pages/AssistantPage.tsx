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
  const [category, setCategory] = useState<KnowledgeCategory | undefined>();
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
    <div className="container-page flex min-h-[calc(100dvh-8rem)] max-w-4xl flex-col py-6 sm:py-8">
      <div className="section-shell p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{t('assistant.title')}</p>
            <h1 className="mt-3 text-3xl tracking-[-0.05em] text-field-deep sm:text-4xl">{t('assistant.title')}</h1>
            <p className="mt-2 max-w-2xl text-muted">{t('assistant.intro')}</p>
          </div>
          {messages.length > 0 && (
            <button type="button" onClick={newChat} className="btn-secondary shrink-0 px-3 py-2 text-sm">
              {t('assistant.newChat')}
            </button>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">{t('assistant.categoriesLabel')}</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={category === c}
                  onClick={() => setCategory((cur) => (cur === c ? undefined : c))}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    category === c ? 'border-field bg-field text-white' : 'border-line bg-panel text-ink hover:bg-field-soft'
                  }`}
                >
                  {t(`assistant.category.${c}`)}
                </button>
              ))}
            </div>
          </div>

          {speech.supported && (
            <label className="flex cursor-pointer items-center gap-2 rounded-full border border-line bg-soft px-3 py-1.5 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={autoRead}
                onChange={toggleAutoRead}
                className="h-4 w-4 rounded border-line text-field"
              />
              {t('voice.autoRead')}
            </label>
          )}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="mt-4 flex-1 space-y-5 overflow-y-auto rounded-[1.75rem] border border-line bg-panel/80 p-4 shadow-subtle sm:p-5"
        aria-live="polite"
      >
        {messages.length === 0 && !busy && (
          <div className="rounded-[1.5rem] border border-dashed border-line bg-soft p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">{t('home.examplesLabel')}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => void submit(s)}
                    disabled={!online}
                    className="rounded-full border border-line bg-panel px-3 py-2 text-sm font-medium text-ink hover:bg-field-soft disabled:opacity-50"
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
            <span className="inline-flex gap-1.5">
              <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-field [animation-delay:-0.3s]" />
              <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-field [animation-delay:-0.15s]" />
              <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-field" />
            </span>
            {t('assistant.thinking')}
          </div>
        )}

        {error && (
          <div role="alert" className="rounded-2xl border border-clay/30 bg-[#fffaf7] p-3 text-clay">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => {
                const lastUser = [...messages].reverse().find((m) => m.role === 'user');
                if (lastUser) void submit(lastUser.content);
                else setError(null);
              }}
              className="mt-3 btn-secondary px-3 py-2 text-sm"
            >
              {t('assistant.retry')}
            </button>
          </div>
        )}
      </div>

      {!online && (
        <p className="mt-3 rounded-2xl border border-marigold/40 bg-[#fff8ea] px-3 py-2 text-sm text-ink">
          {t('assistant.offlineNote')}
        </p>
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

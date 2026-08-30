import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LanguageCode } from '@sahakar/shared';
import { useSpeechRecognition } from '../../lib/speech';

interface ComposerProps {
  onSend: (text: string) => void;
  language: LanguageCode;
  disabled?: boolean;
  busy?: boolean;
  /** Start listening on mount (from the home page "Speak your question" button). */
  autoListen?: boolean;
}

export function Composer({ onSend, language, disabled, busy, autoListen }: ComposerProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const taRef = useRef<HTMLTextAreaElement>(null);
  const baseRef = useRef('');
  const autoListenDone = useRef(false);

  const speech = useSpeechRecognition(language);

  useEffect(() => {
    if (autoListen && !autoListenDone.current && speech.supported && !disabled) {
      autoListenDone.current = true;
      baseRef.current = '';
      speech.start();
    }
  }, [autoListen, disabled, speech.supported, speech.start]);

  useEffect(() => {
    if (!speech.listening && !speech.transcript) return;
    const dictated = [speech.transcript, speech.interim].filter(Boolean).join(' ');
    setValue([baseRef.current, dictated].filter(Boolean).join(' '));
    grow();
  }, [speech.transcript, speech.interim, speech.listening]);

  const grow = () => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const submit = () => {
    const text = value.trim();
    if (!text || disabled || busy) return;
    if (speech.listening) speech.stop();
    onSend(text);
    setValue('');
    baseRef.current = '';
    speech.reset();
    if (taRef.current) taRef.current.style.height = 'auto';
  };

  const toggleMic = () => {
    if (speech.listening) {
      speech.stop();
      return;
    }
    baseRef.current = value.trim();
    speech.start();
  };

  const micError =
    speech.error === 'microphone-denied'
      ? t('voice.micDenied')
      : speech.error === 'no-speech'
        ? t('voice.noSpeech')
        : speech.error
          ? t('voice.error')
          : null;

  return (
    <div className="border-t-2 border-ink pt-3">
      {speech.listening && (
        <p className="mb-2 font-bold text-error" role="status">
          {t('voice.listening')}
        </p>
      )}
      {micError && (
        <p className="mb-2 font-bold text-error" role="alert">
          {micError}
        </p>
      )}

      <form
        className="flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label htmlFor="composer" className="sr-only">
          {t('assistant.placeholder')}
        </label>
        <textarea
          id="composer"
          ref={taRef}
          rows={1}
          value={value}
          disabled={disabled}
          onChange={(e) => {
            setValue(e.target.value);
            baseRef.current = e.target.value;
            grow();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={t('assistant.placeholder')}
          className="field-shell flex-1 resize-none"
        />

        {speech.supported && (
          <button
            type="button"
            onClick={toggleMic}
            disabled={disabled}
            aria-pressed={speech.listening}
            aria-label={speech.listening ? t('voice.stopListening') : t('voice.speak')}
            className={`flex h-12 w-12 shrink-0 items-center justify-center border-2 text-lg ${
              speech.listening ? 'border-error bg-error text-white' : 'border-ink bg-white'
            }`}
          >
            <span aria-hidden>{speech.listening ? '■' : '🎙'}</span>
          </button>
        )}

        <button
          type="submit"
          className="btn-primary shrink-0"
          disabled={disabled || busy || !value.trim()}
        >
          {busy ? '…' : t('assistant.send')}
        </button>
      </form>
    </div>
  );
}

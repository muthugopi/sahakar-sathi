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
  const baseRef = useRef(''); // text captured before the current dictation started
  const autoListenDone = useRef(false);

  const speech = useSpeechRecognition(language);

  useEffect(() => {
    if (autoListen && !autoListenDone.current && speech.supported && !disabled) {
      autoListenDone.current = true;
      baseRef.current = '';
      speech.start();
    }
  }, [autoListen, disabled, speech.supported, speech.start]);

  // Fold dictated text into the field as it finalises.
  useEffect(() => {
    if (!speech.listening && !speech.transcript) return;
    const dictated = [speech.transcript, speech.interim].filter(Boolean).join(' ');
    const combined = [baseRef.current, dictated].filter(Boolean).join(' ');
    setValue(combined);
    grow();
  }, [speech.transcript, speech.interim, speech.listening]);

  const grow = () => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
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
    <div className="border-t border-line bg-panel p-3">
      {speech.listening && (
        <p className="mb-2 flex items-center gap-2 text-sm font-medium text-clay" role="status">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-clay" aria-hidden />
          {t('voice.listening')}
        </p>
      )}
      {micError && (
        <p className="mb-2 text-sm text-clay" role="alert">
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
          className="min-h-[3rem] flex-1 resize-none rounded border border-line bg-paper px-3 py-2.5 text-base
                     focus-visible:outline-field disabled:opacity-60"
        />

        {speech.supported && (
          <button
            type="button"
            onClick={toggleMic}
            disabled={disabled}
            aria-pressed={speech.listening}
            aria-label={speech.listening ? t('voice.stopListening') : t('voice.speak')}
            className={`btn h-12 w-12 shrink-0 rounded border p-0 text-lg ${
              speech.listening
                ? 'border-clay bg-clay text-white'
                : 'border-line bg-paper hover:bg-field-wash'
            }`}
          >
            <span aria-hidden>{speech.listening ? '■' : '🎙'}</span>
          </button>
        )}

        <button
          type="submit"
          className="btn-primary h-12 shrink-0"
          disabled={disabled || busy || !value.trim()}
        >
          {busy ? '…' : t('assistant.send')}
        </button>
      </form>
    </div>
  );
}

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { LanguageCode } from '@sahakar/shared';
import { useSpeechRecognition } from '../lib/speech';

interface Props {
  id: string;
  value: string;
  onChange: (v: string) => void;
  language: LanguageCode;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
}

/** Textarea with an optional microphone that appends dictated speech. */
export function DictationTextarea({
  id,
  value,
  onChange,
  language,
  rows = 5,
  placeholder,
  required,
  maxLength,
}: Props) {
  const { t } = useTranslation();
  const speech = useSpeechRecognition(language);
  const baseRef = useRef('');

  useEffect(() => {
    if (!speech.listening && !speech.transcript) return;
    const dictated = [speech.transcript, speech.interim].filter(Boolean).join(' ');
    onChange([baseRef.current, dictated].filter(Boolean).join(' ').slice(0, maxLength));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech.transcript, speech.interim, speech.listening]);

  const toggle = () => {
    if (speech.listening) {
      speech.stop();
      return;
    }
    baseRef.current = value.trim();
    speech.start();
  };

  return (
    <div>
      <div className="relative">
        <textarea
          id={id}
          rows={rows}
          value={value}
          required={required}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e.target.value);
            baseRef.current = e.target.value;
          }}
          className="field-shell w-full"
        />
        {speech.supported && (
          <button
            type="button"
            onClick={toggle}
            aria-pressed={speech.listening}
            aria-label={speech.listening ? t('voice.stopListening') : t('voice.speak')}
            className={`absolute end-2 top-2 flex h-11 w-11 items-center justify-center rounded-lg border text-lg transition-colors ${
              speech.listening
                ? 'border-error bg-error text-white'
                : 'border-line bg-panel hover:border-ink/25'
            }`}
          >
            <span aria-hidden>{speech.listening ? '■' : '🎙'}</span>
          </button>
        )}
      </div>
      {speech.listening && (
        <p className="mt-1 font-bold text-error" role="status">
          {t('voice.listening')}
        </p>
      )}
      {speech.error === 'microphone-denied' && (
        <p className="mt-1 font-bold text-error">{t('voice.micDenied')}</p>
      )}
    </div>
  );
}

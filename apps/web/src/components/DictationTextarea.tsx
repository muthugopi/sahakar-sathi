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
          className="w-full rounded border border-line bg-panel px-3 py-2.5 text-base focus-visible:outline-field"
        />
        {speech.supported && (
          <button
            type="button"
            onClick={toggle}
            aria-pressed={speech.listening}
            aria-label={speech.listening ? t('voice.stopListening') : t('voice.speak')}
            className={`absolute end-2 top-2 flex h-10 w-10 items-center justify-center rounded border ${
              speech.listening ? 'border-clay bg-clay text-white' : 'border-line bg-paper'
            }`}
          >
            <span aria-hidden>{speech.listening ? '■' : '🎙'}</span>
          </button>
        )}
      </div>
      {speech.listening && (
        <p className="mt-1 text-sm font-medium text-clay" role="status">
          {t('voice.listening')}
        </p>
      )}
      {speech.error === 'microphone-denied' && (
        <p className="mt-1 text-sm text-clay">{t('voice.micDenied')}</p>
      )}
    </div>
  );
}

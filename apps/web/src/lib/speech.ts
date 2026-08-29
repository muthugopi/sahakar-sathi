import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LanguageCode } from '@sahakar/shared';

/* -------------------------------------------------------------------------- */
/*  Minimal Web Speech API typings (not in the standard DOM lib)               */
/* -------------------------------------------------------------------------- */

interface SpeechRecognitionAlternative {
  transcript: string;
}
interface SpeechRecognitionResult {
  0: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}
interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEventLike extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}
interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}
interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** BCP-47 tags for the supported languages. Kept in sync with the API's /voice/config. */
export const LANGUAGE_TAG: Record<LanguageCode, string> = {
  en: 'en-IN',
  ta: 'ta-IN',
  hi: 'hi-IN',
};

/* -------------------------------------------------------------------------- */
/*  Speech-to-text                                                             */
/* -------------------------------------------------------------------------- */

export interface UseSpeechRecognition {
  supported: boolean;
  listening: boolean;
  /** Finalised text since the last start(). */
  transcript: string;
  /** Words currently being recognised (not yet final). */
  interim: string;
  error: string | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useSpeechRecognition(language: LanguageCode): UseSpeechRecognition {
  const Ctor = useMemo(getRecognitionCtor, []);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [error, setError] = useState<string | null>(null);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const reset = useCallback(() => {
    setTranscript('');
    setInterim('');
    setError(null);
  }, []);

  const start = useCallback(() => {
    if (!Ctor) return;
    reset();
    const recognition = new Ctor();
    recognition.lang = LANGUAGE_TAG[language];
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => {
      setListening(false);
      setInterim('');
      recognitionRef.current = null;
    };
    recognition.onerror = (e) => {
      setError(
        e.error === 'not-allowed'
          ? 'microphone-denied'
          : e.error === 'no-speech'
            ? 'no-speech'
            : 'speech-error',
      );
    };
    recognition.onresult = (e) => {
      let finalChunk = '';
      let interimChunk = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        if (!result) continue;
        if (result.isFinal) finalChunk += result[0].transcript;
        else interimChunk += result[0].transcript;
      }
      if (finalChunk) setTranscript((t) => (t ? `${t} ${finalChunk}` : finalChunk).trim());
      setInterim(interimChunk);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      /* start() throws if called while already active — ignore */
    }
  }, [Ctor, language, reset]);

  useEffect(() => () => recognitionRef.current?.abort(), []);

  return { supported: Ctor !== null, listening, transcript, interim, error, start, stop, reset };
}

/* -------------------------------------------------------------------------- */
/*  Text-to-speech                                                             */
/* -------------------------------------------------------------------------- */

export type SpeechState = 'idle' | 'speaking' | 'paused';

export interface UseSpeechSynthesis {
  supported: boolean;
  state: SpeechState;
  /** Id of the utterance currently loaded (so a component knows if it's "the one"). */
  activeId: string | null;
  speak: (id: string, text: string, language: LanguageCode) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

/** Strip Markdown, citation markers and stray symbols so speech sounds natural. */
export function plainForSpeech(text: string): string {
  return text
    .replace(/\[\d+(?:\s*,\s*\d+)*\]/g, '')
    .replace(/[*_`#>]/g, '')
    .replace(/\s*↗\s*/g, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\s+/g, ' ')
    .trim();
}

function pickVoice(language: LanguageCode): SpeechSynthesisVoice | undefined {
  const tag = LANGUAGE_TAG[language].toLowerCase();
  const base = tag.split('-')[0]!;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.toLowerCase() === tag) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(base))
  );
}

export function useSpeechSynthesis(): UseSpeechSynthesis {
  const supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const [state, setState] = useState<SpeechState>('idle');
  const [activeId, setActiveId] = useState<string | null>(null);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setState('idle');
    setActiveId(null);
  }, [supported]);

  const speak = useCallback(
    (id: string, text: string, language: LanguageCode) => {
      if (!supported) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(plainForSpeech(text));
      utterance.lang = LANGUAGE_TAG[language];
      const voice = pickVoice(language);
      if (voice) utterance.voice = voice;
      utterance.rate = 0.95;
      utterance.onend = () => {
        setState('idle');
        setActiveId(null);
      };
      utterance.onerror = () => {
        setState('idle');
        setActiveId(null);
      };

      setActiveId(id);
      setState('speaking');
      window.speechSynthesis.speak(utterance);
    },
    [supported],
  );

  const pause = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setState('paused');
  }, [supported]);

  const resume = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.resume();
    setState('speaking');
  }, [supported]);

  useEffect(() => {
    if (!supported) return;
    // Some browsers populate voices asynchronously.
    const handler = () => void window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener('voiceschanged', handler);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      window.speechSynthesis.cancel();
    };
  }, [supported]);

  return { supported, state, activeId, speak, pause, resume, stop };
}

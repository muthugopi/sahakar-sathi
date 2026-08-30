import { useTranslation } from 'react-i18next';
import type { LanguageCode } from '@sahakar/shared';
import { useSpeech } from './SpeechContext';

/** Play / pause / stop / replay controls for reading an answer aloud. */
export function ListenButton({
  id,
  text,
  language,
}: {
  id: string;
  text: string;
  language: LanguageCode;
}) {
  const { t } = useTranslation();
  const { supported, state, activeId, speak, pause, resume, stop } = useSpeech();

  if (!supported) return null;

  const isActive = activeId === id;
  const speaking = isActive && state === 'speaking';
  const paused = isActive && state === 'paused';

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!isActive && (
        <button type="button" onClick={() => speak(id, text, language)} className="voice-ctrl">
          <span aria-hidden>▶</span> {t('voice.listen')}
        </button>
      )}

      {speaking && (
        <button type="button" onClick={pause} className="voice-ctrl">
          <span aria-hidden>⏸</span> {t('voice.pause')}
        </button>
      )}

      {paused && (
        <button type="button" onClick={resume} className="voice-ctrl">
          <span aria-hidden>▶</span> {t('voice.resume')}
        </button>
      )}

      {isActive && (
        <>
          <button type="button" onClick={stop} className="voice-ctrl">
            <span aria-hidden>⏹</span> {t('voice.stop')}
          </button>
          <button
            type="button"
            onClick={() => speak(id, text, language)}
            className="voice-ctrl"
          >
            <span aria-hidden>↻</span> {t('voice.replay')}
          </button>
        </>
      )}
    </div>
  );
}

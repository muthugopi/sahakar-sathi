import { createContext, useContext, type ReactNode } from 'react';
import { useSpeechSynthesis, type UseSpeechSynthesis } from '../../lib/speech';

/**
 * One shared text-to-speech engine for the whole conversation, so starting
 * playback on one answer stops any other that is speaking.
 */
const SpeechContext = createContext<UseSpeechSynthesis | null>(null);

export function SpeechProvider({ children }: { children: ReactNode }) {
  const synthesis = useSpeechSynthesis();
  return <SpeechContext.Provider value={synthesis}>{children}</SpeechContext.Provider>;
}

export function useSpeech(): UseSpeechSynthesis {
  const ctx = useContext(SpeechContext);
  if (!ctx) throw new Error('useSpeech must be used within <SpeechProvider>');
  return ctx;
}

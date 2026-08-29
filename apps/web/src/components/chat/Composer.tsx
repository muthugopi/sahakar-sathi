import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ComposerProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  busy?: boolean;
}

export function Composer({ onSend, disabled, busy }: ComposerProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const taRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    const text = value.trim();
    if (!text || disabled || busy) return;
    onSend(text);
    setValue('');
    if (taRef.current) taRef.current.style.height = 'auto';
  };

  const grow = () => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <form
      className="flex items-end gap-2 border-t border-line bg-panel p-3"
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
      <button
        type="button"
        title={t('assistant.voiceComingSoon')}
        aria-label={t('assistant.voiceComingSoon')}
        disabled
        className="btn h-12 w-12 shrink-0 rounded border border-line bg-paper p-0 text-lg opacity-50"
      >
        <span aria-hidden>🎙</span>
      </button>
      <button
        type="submit"
        className="btn-primary h-12 shrink-0"
        disabled={disabled || busy || !value.trim()}
      >
        {busy ? '…' : t('assistant.send')}
      </button>
    </form>
  );
}

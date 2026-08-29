import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SourceRef } from '@sahakar/shared';

export function SourceList({ sources }: { sources: SourceRef[] }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  if (sources.length === 0) return null;

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-field-deep underline"
      >
        {open ? t('assistant.hideSources') : t('assistant.showSources')}
        <span aria-hidden>· {t('assistant.sourcesLabel', { count: sources.length })}</span>
      </button>

      {open && (
        <ul className="mt-2 space-y-2">
          {sources.map((s) => (
            <li key={s.id} className="rounded border border-line bg-paper p-3 text-sm">
              <p className="font-semibold">{s.title}</p>
              <p className="text-muted">{s.authority}</p>
              <p className="mt-1 text-ink/80">{s.snippet}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                {s.verifiedAt && (
                  <span>{t('assistant.verifiedOn', { date: s.verifiedAt.slice(0, 10) })}</span>
                )}
                {s.sourceUrl && (
                  <a
                    href={s.sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-medium text-field-deep underline"
                  >
                    {t('assistant.openSource')} ↗
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

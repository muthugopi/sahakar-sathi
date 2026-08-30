import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SourceRef } from '@sahakar/shared';

export function SourceList({ sources }: { sources: SourceRef[] }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  if (sources.length === 0) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="font-bold text-primary underline"
      >
        {open ? t('assistant.hideSources') : t('assistant.showSources')} ·{' '}
        {t('assistant.sourcesLabel', { count: sources.length })}
      </button>

      {open && (
        <ul className="mt-2 border-t border-line">
          {sources.map((s) => (
            <li key={s.id} className="border-b border-line py-3">
              <p className="font-bold">{s.title}</p>
              <p className="text-ink-2">{s.authority}</p>
              <p className="mt-1">{s.snippet}</p>
              <p className="mt-1 text-sm text-ink-2">
                {s.verifiedAt && t('assistant.verifiedOn', { date: s.verifiedAt.slice(0, 10) })}
                {s.sourceUrl && (
                  <>
                    {s.verifiedAt ? ' · ' : ''}
                    <a
                      href={s.sourceUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="font-bold"
                    >
                      {t('assistant.openSource')}
                    </a>
                  </>
                )}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

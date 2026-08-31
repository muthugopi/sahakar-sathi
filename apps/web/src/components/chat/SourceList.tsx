import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SOURCE_TIERS, type SourceRef, type SourceTier } from '@sahakar/shared';

export function SourceList({ sources }: { sources: SourceRef[] }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  if (sources.length === 0) return null;

  // Group by trust tier, most trusted first.
  const groups = SOURCE_TIERS.map((tier) => ({
    tier,
    items: sources.filter((s) => (s.tier ?? 'OFFICIAL') === tier),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="font-semibold text-primary underline underline-offset-4"
      >
        {open ? t('assistant.hideSources') : t('assistant.showSources')} ·{' '}
        {t('assistant.sourcesLabel', { count: sources.length })}
      </button>

      {open && (
        <div className="mt-3 space-y-5">
          {groups.map((g) => (
            <div key={g.tier}>
              <p className="eyebrow">{t(`assistant.tierGroup.${g.tier}`)}</p>
              <ul className="mt-2 border-t border-line">
                {g.items.map((s) => (
                  <SourceItem key={s.id} source={s} tier={g.tier} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SourceItem({ source: s, tier }: { source: SourceRef; tier: SourceTier }) {
  const { t } = useTranslation();
  const date = s.verifiedAt
    ? t('assistant.verifiedOn', { date: s.verifiedAt.slice(0, 10) })
    : s.publishedAt
      ? t('assistant.publishedOn', { date: s.publishedAt.slice(0, 10) })
      : null;

  return (
    <li className="border-b border-line py-3">
      <p className="font-semibold text-ink">{s.title}</p>
      <p className="text-sm text-ink-2">
        {tier === 'OFFICIAL'
          ? s.authority
          : s.authority.toLowerCase() === t(`assistant.tier.${tier}`).toLowerCase()
            ? t(`assistant.tier.${tier}`)
            : `${t(`assistant.tier.${tier}`)} · ${s.authority}`}
      </p>
      <p className="mt-1 text-sm text-ink-2">{s.snippet}</p>
      <p className="mt-1 text-xs text-ink-2">
        {date}
        {s.sourceUrl && (
          <>
            {date ? ' · ' : ''}
            <a
              href={s.sourceUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="font-semibold"
            >
              {t('assistant.openSource')}
            </a>
          </>
        )}
      </p>
    </li>
  );
}

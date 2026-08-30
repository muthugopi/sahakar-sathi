import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { KnowledgeCategory } from '@sahakar/shared';
import { fetchSchemes, type SchemeFilters } from '../lib/content';
import { QueryBoundary } from '../components/QueryBoundary';
import { SchemeCard } from '../components/content/SchemeCard';

export function SchemesPage() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();

  const filters: SchemeFilters = useMemo(
    () => ({
      category: (params.get('category') as KnowledgeCategory) || undefined,
      state: params.get('state') || undefined,
      targetUser: params.get('targetUser') || undefined,
      q: params.get('q') || undefined,
    }),
    [params],
  );

  const query = useQuery({
    queryKey: ['schemes', filters],
    queryFn: () => fetchSchemes(filters),
    staleTime: 30 * 60_000,
  });

  const setFilter = (key: keyof SchemeFilters, value: string | undefined) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const facets = query.data?.facets;
  const active = Object.values(filters).some(Boolean);

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="border-b border-line pb-10">
        <p className="eyebrow">{t('sections.schemes.eyebrow')}</p>
        <h1 className="mt-4 text-5xl tracking-[-0.07em] text-field-deep sm:text-6xl">{t('sections.schemes.title')}</h1>
        <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">{t('sections.schemes.intro')}</p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="space-y-6 border-r border-line pr-0 lg:pr-8">
          <div>
            <label htmlFor="scheme-q" className="mb-2 block text-sm font-semibold text-ink">
              {t('schemes.search')}
            </label>
            <input
              id="scheme-q"
              type="search"
              defaultValue={filters.q ?? ''}
              onChange={(e) => setFilter('q', e.target.value.trim() || undefined)}
              className="field-shell bg-panel"
            />
          </div>

          <FilterGroup
            label={t('schemes.forWhom')}
            options={facets?.targetUsers ?? []}
            value={filters.targetUser}
            onChange={(v) => setFilter('targetUser', v)}
          />
          <FilterGroup
            label={t('schemes.category')}
            options={facets?.categories ?? []}
            value={filters.category}
            onChange={(v) => setFilter('category', v)}
            renderOption={(o) => t(`assistant.category.${o}`, { defaultValue: o })}
          />
          {(facets?.states.length ?? 0) > 0 && (
            <FilterGroup
              label={t('schemes.state')}
              options={facets?.states ?? []}
              value={filters.state}
              onChange={(v) => setFilter('state', v)}
            />
          )}

          {active && (
            <button
              type="button"
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
              className="btn-secondary w-full justify-center"
            >
              {t('schemes.clearFilters')}
            </button>
          )}
        </aside>

        <div>
          <QueryBoundary
            isLoading={query.isLoading}
            isError={query.isError}
            onRetry={() => void query.refetch()}
          >
            {query.data && query.data.schemes.length === 0 ? (
              <div className="border border-line bg-panel p-8 text-center">
                <p className="text-lg font-medium text-ink">{t('schemes.none')}</p>
              </div>
            ) : (
              <div className="space-y-0 border-t border-line">
                {query.data?.schemes.map((s) => (
                  <SchemeCard key={s.slug} scheme={s} />
                ))}
              </div>
            )}
          </QueryBoundary>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
  renderOption,
}: {
  label: string;
  options: string[];
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  renderOption?: (o: string) => string;
}) {
  if (options.length === 0) return null;
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-ink">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const selected = value === o;
          return (
            <button
              key={o}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? undefined : o)}
              className={`rounded-full border px-2.5 py-1.5 text-xs font-medium uppercase tracking-[0.08em] transition-colors ${
                selected ? 'border-field bg-field text-white' : 'border-line bg-panel text-muted hover:bg-field-soft hover:text-field-deep'
              }`}
            >
              {renderOption ? renderOption(o) : o}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

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
    <div className="container-page py-8">
      <p className="eyebrow">{t('sections.schemes.eyebrow')}</p>
      <h1 className="mt-2 text-2xl sm:text-3xl">{t('sections.schemes.title')}</h1>
      <p className="mt-3 max-w-prose text-lg text-muted">{t('sections.schemes.intro')}</p>

      <div className="mt-6 grid gap-6 md:grid-cols-[16rem_1fr]">
        <aside className="space-y-5">
          <div>
            <label htmlFor="scheme-q" className="mb-1 block text-sm font-medium">
              {t('schemes.search')}
            </label>
            <input
              id="scheme-q"
              type="search"
              defaultValue={filters.q ?? ''}
              onChange={(e) => setFilter('q', e.target.value.trim() || undefined)}
              className="min-h-[2.75rem] w-full rounded border border-line bg-panel px-3 py-2"
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
              className="text-sm font-medium text-field-deep underline"
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
              <p className="py-8 text-muted">{t('schemes.none')}</p>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2">
                {query.data?.schemes.map((s) => (
                  <li key={s.slug}>
                    <SchemeCard scheme={s} />
                  </li>
                ))}
              </ul>
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
      <legend className="mb-1.5 text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const selected = value === o;
          return (
            <button
              key={o}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? undefined : o)}
              className={`rounded border px-2.5 py-1.5 text-sm ${
                selected ? 'border-field bg-field text-white' : 'border-line bg-panel hover:bg-field-wash'
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

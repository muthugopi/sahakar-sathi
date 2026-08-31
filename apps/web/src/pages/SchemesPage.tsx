import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { KnowledgeCategory } from '@sahakar/shared';
import { fetchSchemes, type SchemeFilters } from '../lib/content';
import { QueryBoundary } from '../components/QueryBoundary';
import { PageHero } from '../components/PageHero';
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
  const count = query.data?.schemes.length ?? 0;

  return (
    <>
      <PageHero
        eyebrow={t('sections.schemes.eyebrow')}
        title={t('schemes.heroTitle')}
        lead={t('sections.schemes.intro')}
        size="large"
      />

      <div className="container-wide section-tight section-divide grid grid-cols-1 gap-12 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16">
        <aside>
          <h2 className="text-xl">{t('schemes.filterHeading')}</h2>

          <div className="mt-4">
            <label htmlFor="scheme-q" className="field-label">
              {t('schemes.search')}
            </label>
            <input
              id="scheme-q"
              type="search"
              defaultValue={filters.q ?? ''}
              onChange={(e) => setFilter('q', e.target.value.trim() || undefined)}
              className="field-shell mt-2"
            />
          </div>

          <FilterGroup
            legend={t('schemes.forWhom')}
            name="targetUser"
            options={facets?.targetUsers ?? []}
            value={filters.targetUser}
            onChange={(v) => setFilter('targetUser', v)}
            allLabel={t('schemes.anyone')}
          />
          <FilterGroup
            legend={t('schemes.category')}
            name="category"
            options={facets?.categories ?? []}
            value={filters.category}
            onChange={(v) => setFilter('category', v)}
            allLabel={t('schemes.anyCategory')}
            renderOption={(o) => t(`assistant.category.${o}`, { defaultValue: humanize(o) })}
          />
          {(facets?.states.length ?? 0) > 0 && (
            <FilterGroup
              legend={t('schemes.state')}
              name="state"
              options={facets?.states ?? []}
              value={filters.state}
              onChange={(v) => setFilter('state', v)}
              allLabel={t('schemes.anyState')}
            />
          )}

          {active && (
            <button
              type="button"
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
              className="btn-ghost mt-4 p-0"
            >
              {t('schemes.clearFilters')}
            </button>
          )}
        </aside>

        <div className="min-w-0">
          <QueryBoundary
            isLoading={query.isLoading}
            isError={query.isError}
            onRetry={() => void query.refetch()}
          >
            {query.data && (
              <>
                <p className="text-sm text-ink-2">{t('schemes.resultCount', { count })}</p>
                {count === 0 ? (
                  <div className="notice notice--warn mt-6">
                    <p>{t('schemes.none')}</p>
                    <p className="mt-3">
                      <button
                        type="button"
                        onClick={() => setParams(new URLSearchParams(), { replace: true })}
                        className="btn-link"
                      >
                        {t('schemes.clearFilters')}
                      </button>
                    </p>
                  </div>
                ) : (
                  <ul className="mt-4 border-t border-line">
                    {query.data.schemes.map((s) => (
                      <li key={s.slug}>
                        <SchemeCard scheme={s} />
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </QueryBoundary>
        </div>
      </div>
    </>
  );
}

function humanize(s: string) {
  return s.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

function FilterGroup({
  legend,
  name,
  options,
  value,
  onChange,
  allLabel,
  renderOption,
}: {
  legend: string;
  name: string;
  options: string[];
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  allLabel: string;
  renderOption?: (o: string) => string;
}) {
  if (options.length === 0) return null;
  return (
    <fieldset className="mt-6">
      <legend className="field-label">{legend}</legend>
      <div className="mt-2 space-y-2">
        <label className="flex items-center gap-3">
          <input
            type="radio"
            name={name}
            checked={!value}
            onChange={() => onChange(undefined)}
            className="h-5 w-5"
          />
          {allLabel}
        </label>
        {options.map((o) => (
          <label key={o} className="flex items-center gap-3">
            <input
              type="radio"
              name={name}
              checked={value === o}
              onChange={() => onChange(o)}
              className="h-5 w-5"
            />
            {renderOption ? renderOption(o) : o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

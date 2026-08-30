import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { KNOWLEDGE_CATEGORIES } from '@sahakar/shared';
import type { KnowledgeCategory, SchemeInput } from '@sahakar/shared';
import { createScheme, fetchSchemeAdmin, updateScheme } from '../../lib/admin';
import { ApiRequestError } from '../../lib/api';

const EMPTY: SchemeInput = {
  slug: '',
  title: '',
  category: 'MINISTRY_SCHEME',
  summary: '',
  purpose: '',
  targetUsers: [],
  eligibility: '',
  benefits: '',
  requiredDocuments: [],
  applicationProcess: '',
  officialSource: '',
  officialUrl: '',
  state: null,
};

export function AdminSchemeEditPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isNew = !slug || slug === 'new';

  const existing = useQuery({
    queryKey: ['admin', 'scheme', slug],
    queryFn: () => fetchSchemeAdmin(slug!),
    enabled: !isNew,
  });

  const [form, setForm] = useState<SchemeInput>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existing.data) {
      const s = existing.data.scheme;
      setForm({
        slug: s.slug,
        title: s.title,
        category: s.category as KnowledgeCategory,
        summary: s.summary,
        purpose: s.purpose,
        targetUsers: s.targetUsers,
        eligibility: s.eligibility,
        benefits: s.benefits,
        requiredDocuments: s.requiredDocuments,
        applicationProcess: s.applicationProcess,
        officialSource: s.officialSource,
        officialUrl: s.officialUrl ?? '',
        state: s.state,
      });
    }
  }, [existing.data]);

  const mutation = useMutation({
    mutationFn: () => (isNew ? createScheme(form) : updateScheme(slug!, form)),
    onSuccess: () => navigate('/admin/schemes'),
    onError: (e) => setError(e instanceof ApiRequestError ? e.message : 'Could not save.'),
  });

  const set = <K extends keyof SchemeInput>(k: K, v: SchemeInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  if (!isNew && existing.isLoading) return <p className="text-ink-2">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <Link to="/admin/schemes" className="text-sm text-primary underline">
        ← All schemes
      </Link>
      <h2 className="mt-3 text-lg font-semibold text-ink">
        {isNew ? 'New scheme' : `Edit: ${form.title}`}
      </h2>
      {!isNew && (
        <p className="mt-1 text-sm text-ink-2">
          Saving re-indexes the scheme for the assistant if it is verified.
        </p>
      )}

      <form
        className="mt-6 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          mutation.mutate();
        }}
      >
        {error && <p className="text-sm text-error">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <Text label="URL slug" value={form.slug} onChange={(v) => set('slug', v)} disabled={!isNew} />
          <Select
            label="Category"
            value={form.category}
            onChange={(v) => set('category', v as KnowledgeCategory)}
            options={KNOWLEDGE_CATEGORIES}
          />
        </div>
        <Text label="Title" value={form.title} onChange={(v) => set('title', v)} />
        <Text label="One-line summary" value={form.summary} onChange={(v) => set('summary', v)} />
        <Area label="Purpose" value={form.purpose} onChange={(v) => set('purpose', v)} />
        <Text
          label="Who can apply (comma separated)"
          value={form.targetUsers.join(', ')}
          onChange={(v) => set('targetUsers', splitList(v))}
        />
        <Area label="Eligibility" value={form.eligibility} onChange={(v) => set('eligibility', v)} />
        <Area label="Benefits" value={form.benefits} onChange={(v) => set('benefits', v)} />
        <Text
          label="Required documents (comma separated)"
          value={form.requiredDocuments.join(', ')}
          onChange={(v) => set('requiredDocuments', splitList(v))}
        />
        <Area
          label="How to apply"
          value={form.applicationProcess}
          onChange={(v) => set('applicationProcess', v)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Text
            label="Official source"
            value={form.officialSource}
            onChange={(v) => set('officialSource', v)}
          />
          <Text
            label="Official URL"
            value={form.officialUrl ?? ''}
            onChange={(v) => set('officialUrl', v)}
          />
        </div>
        <Text
          label="State (leave blank for national)"
          value={form.state ?? ''}
          onChange={(v) => set('state', v || null)}
        />

        <button type="submit" className="btn-primary" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving…' : 'Save scheme'}
        </button>
      </form>
    </div>
  );
}

const splitList = (v: string) =>
  v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

function Text({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block text-sm">
      {label}
      <input
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 min-h-[2.5rem] w-full rounded border border-line bg-panel px-3 disabled:opacity-50"
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      {label}
      <textarea
        value={value}
        rows={3}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded border border-line bg-panel px-3 py-2"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <label className="block text-sm">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 min-h-[2.5rem] w-full rounded border border-line bg-panel px-2"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o.toLowerCase().replace(/_/g, ' ')}
          </option>
        ))}
      </select>
    </label>
  );
}

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KNOWLEDGE_CATEGORIES } from '@sahakar/shared';
import type { AdminDocument, CreateDocumentInput, KnowledgeCategory } from '@sahakar/shared';
import {
  createDocument,
  deleteDocument,
  fetchDocuments,
  verifyDocument,
} from '../../lib/admin';
import { ApiRequestError } from '../../lib/api';
import { QueryBoundary } from '../../components/QueryBoundary';

export function AdminKnowledgePage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState('');
  const [filterVerified, setFilterVerified] = useState('');
  const [q, setQ] = useState('');

  const query = useQuery({
    queryKey: ['admin', 'documents', { filterCat, filterVerified, q }],
    queryFn: () =>
      fetchDocuments({
        category: filterCat || undefined,
        verified: filterVerified || undefined,
        q: q || undefined,
      }),
  });

  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ['admin', 'documents'] });
    void qc.invalidateQueries({ queryKey: ['admin', 'analytics'] });
  };

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink">Knowledge documents</h2>
          <p className="mt-1 text-sm text-ink-2">
            Sources the assistant is allowed to quote. Only verified documents are used in answers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="text-sm font-medium text-primary underline"
        >
          {showForm ? 'Cancel' : 'Add document'}
        </button>
      </div>

      {showForm && (
        <NewDocumentForm
          onDone={() => {
            setShowForm(false);
            invalidate();
          }}
        />
      )}

      <div className="mt-6 flex flex-wrap gap-3 border-y border-line py-3 text-sm">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search titles"
          className="min-h-[2.5rem] rounded border border-line bg-panel px-3"
        />
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="min-h-[2.5rem] rounded border border-line bg-panel px-2"
        >
          <option value="">All categories</option>
          {KNOWLEDGE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {label(c)}
            </option>
          ))}
        </select>
        <select
          value={filterVerified}
          onChange={(e) => setFilterVerified(e.target.value)}
          className="min-h-[2.5rem] rounded border border-line bg-panel px-2"
        >
          <option value="">Any status</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
      </div>

      <QueryBoundary
        isLoading={query.isLoading}
        isError={query.isError}
        onRetry={() => void query.refetch()}
      >
        <div className="overflow-x-auto">
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-2">
                <th className="py-2 pe-4 font-medium">Title</th>
                <th className="py-2 pe-4 font-medium">Category</th>
                <th className="py-2 pe-4 font-medium">Authority</th>
                <th className="py-2 pe-4 font-medium">Status</th>
                <th className="py-2 pe-4 text-right font-medium">Chunks</th>
                <th className="py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {query.data?.documents.map((d) => (
                <DocumentRow key={d.id} doc={d} onChange={invalidate} />
              ))}
              {query.data && query.data.documents.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-ink-2">
                    No documents match.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </QueryBoundary>
    </div>
  );
}

function DocumentRow({ doc, onChange }: { doc: AdminDocument; onChange: () => void }) {
  const verify = useMutation({
    mutationFn: (v: boolean) => verifyDocument(doc.id, v),
    onSuccess: onChange,
  });
  const remove = useMutation({ mutationFn: () => deleteDocument(doc.id), onSuccess: onChange });

  return (
    <tr className="border-b border-line align-top">
      <td className="py-3 pe-4 text-ink">
        {doc.title}
        {doc.sourceUrl && (
          <a
            href={doc.sourceUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="ms-2 text-xs text-primary underline"
          >
            source
          </a>
        )}
      </td>
      <td className="py-3 pe-4 text-ink-2">{label(doc.category)}</td>
      <td className="py-3 pe-4 text-ink-2">{doc.authority}</td>
      <td className="py-3 pe-4">
        {doc.isVerified ? (
          <span className="text-primary">verified</span>
        ) : (
          <span className="text-error">unverified</span>
        )}
        {!doc.isPublished && <span className="ms-1 text-ink-2">· hidden</span>}
      </td>
      <td className="py-3 pe-4 text-right tabular-nums text-ink-2">{doc.chunkCount}</td>
      <td className="py-3">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => verify.mutate(!doc.isVerified)}
            disabled={verify.isPending}
            className="text-primary underline"
          >
            {doc.isVerified ? 'Unverify' : 'Verify'}
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete “${doc.title}”? This cannot be undone.`)) remove.mutate();
            }}
            disabled={remove.isPending}
            className="text-error underline"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

function NewDocumentForm({ onDone }: { onDone: () => void }) {
  const [form, setForm] = useState({
    title: '',
    category: 'FAQ' as KnowledgeCategory,
    authority: '',
    sourceUrl: '',
    language: 'en' as CreateDocumentInput['language'],
    text: '',
    publish: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      createDocument(
        {
          title: form.title.trim(),
          category: form.category,
          authority: form.authority.trim(),
          sourceUrl: form.sourceUrl.trim() || undefined,
          language: form.language,
          text: file ? undefined : form.text.trim(),
          publish: form.publish,
        },
        file ?? undefined,
      ),
    onSuccess: onDone,
    onError: (e) => setError(e instanceof ApiRequestError ? e.message : 'Could not save.'),
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <form
      className="mt-4 space-y-4 border border-line bg-bg p-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        mutation.mutate();
      }}
    >
      {error && <p className="text-sm text-error">{error}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          Title
          <input
            required
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            className="mt-1 min-h-[2.5rem] w-full rounded border border-line bg-panel px-3"
          />
        </label>
        <label className="text-sm">
          Issuing authority
          <input
            required
            value={form.authority}
            onChange={(e) => set('authority', e.target.value)}
            className="mt-1 min-h-[2.5rem] w-full rounded border border-line bg-panel px-3"
          />
        </label>
        <label className="text-sm">
          Category
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value as KnowledgeCategory)}
            className="mt-1 min-h-[2.5rem] w-full rounded border border-line bg-panel px-2"
          >
            {KNOWLEDGE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {label(c)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Official URL (optional)
          <input
            type="url"
            value={form.sourceUrl}
            onChange={(e) => set('sourceUrl', e.target.value)}
            className="mt-1 min-h-[2.5rem] w-full rounded border border-line bg-panel px-3"
          />
        </label>
      </div>

      <div>
        <p className="text-sm">Content</p>
        <p className="text-xs text-ink-2">Paste the text, or upload a text-based PDF.</p>
        <textarea
          value={form.text}
          onChange={(e) => set('text', e.target.value)}
          disabled={Boolean(file)}
          rows={6}
          placeholder="Paste the document text here…"
          className="mt-1 w-full rounded border border-line bg-panel px-3 py-2 text-sm disabled:opacity-50"
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-2 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.publish}
          onChange={(e) => set('publish', e.target.checked)}
        />
        Mark verified and use in answers immediately
      </label>

      <button type="submit" className="btn-primary" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving…' : 'Save document'}
      </button>
    </form>
  );
}

function label(c: string): string {
  return c
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

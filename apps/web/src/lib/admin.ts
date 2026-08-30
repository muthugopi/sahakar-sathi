import type {
  AdminAnalytics,
  AdminDocument,
  AdminGrievanceListItem,
  AdminUpdateGrievanceInput,
  CreateDocumentInput,
  GrievanceDetail,
  SchemeAdmin,
  SchemeInput,
  UpdateDocumentInput,
} from '@sahakar/shared';
import { api, ApiRequestError, getAccessToken } from './api';

/* analytics */
export const fetchAnalytics = () => api<AdminAnalytics>('/admin/analytics');

/* knowledge documents */
export const fetchDocuments = (params: { category?: string; verified?: string; q?: string } = {}) => {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) qs.set(k, v);
  return api<{ documents: AdminDocument[] }>(`/admin/documents${qs.toString() ? `?${qs}` : ''}`);
};
export const fetchDocument = (id: string) =>
  api<{ document: AdminDocument }>(`/admin/documents/${id}`);

export async function createDocument(
  input: CreateDocumentInput,
  file?: File,
): Promise<AdminDocument> {
  const form = new FormData();
  for (const [k, v] of Object.entries(input)) {
    if (v !== undefined && v !== '') form.append(k, String(v));
  }
  if (file) form.append('file', file);
  const token = getAccessToken();
  const res = await fetch('/api/v1/admin/documents', {
    method: 'POST',
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  const text = await res.text();
  const parsed = text ? JSON.parse(text) : undefined;
  if (!res.ok) throw new ApiRequestError(res.status, parsed, 'Create failed');
  return (parsed as { document: AdminDocument }).document;
}

export const updateDocument = (id: string, input: UpdateDocumentInput) =>
  api<{ document: AdminDocument }>(`/admin/documents/${id}`, { method: 'PATCH', body: input });
export const verifyDocument = (id: string, verified: boolean) =>
  api<{ document: AdminDocument }>(`/admin/documents/${id}/verify`, {
    method: 'POST',
    body: { verified },
  });
export const deleteDocument = (id: string) =>
  api<void>(`/admin/documents/${id}`, { method: 'DELETE' });

/* schemes */
export const fetchSchemesAdmin = () => api<{ schemes: SchemeAdmin[] }>('/admin/schemes');
export const fetchSchemeAdmin = (slug: string) =>
  api<{ scheme: SchemeAdmin }>(`/admin/schemes/${slug}`);
export const createScheme = (input: SchemeInput) =>
  api<{ scheme: SchemeAdmin }>('/admin/schemes', { method: 'POST', body: input });
export const updateScheme = (slug: string, input: SchemeInput) =>
  api<{ scheme: SchemeAdmin }>(`/admin/schemes/${slug}`, { method: 'PATCH', body: input });
export const verifyScheme = (slug: string, verified: boolean) =>
  api<{ scheme: SchemeAdmin }>(`/admin/schemes/${slug}/verify`, {
    method: 'POST',
    body: { verified },
  });
export const archiveScheme = (slug: string, archived: boolean) =>
  api<{ scheme: SchemeAdmin }>(`/admin/schemes/${slug}/archive`, {
    method: 'POST',
    body: { archived },
  });

/* grievances */
export const fetchGrievancesAdmin = (params: { status?: string; category?: string; q?: string } = {}) => {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) qs.set(k, v);
  return api<{ grievances: AdminGrievanceListItem[] }>(
    `/admin/grievances${qs.toString() ? `?${qs}` : ''}`,
  );
};
export const fetchGrievanceAdmin = (trackingId: string) =>
  api<{ grievance: GrievanceDetail }>(`/admin/grievances/${trackingId}`);
export const updateGrievanceAdmin = (trackingId: string, input: AdminUpdateGrievanceInput) =>
  api<{ grievance: GrievanceDetail }>(`/admin/grievances/${trackingId}`, {
    method: 'PATCH',
    body: input,
  });

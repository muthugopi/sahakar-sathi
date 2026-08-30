import type {
  CreateGrievanceInput,
  GrievanceAttachment,
  GrievanceDetail,
  GrievanceListItem,
  GrievancePublic,
  UpdateGrievanceStatusInput,
} from '@sahakar/shared';
import { api, ApiRequestError, getAccessToken } from './api';

export function submitGrievance(
  input: CreateGrievanceInput,
): Promise<{ trackingId: string; status: string }> {
  return api('/grievances', { method: 'POST', body: input });
}

/**
 * Multipart upload — the shared api() helper JSON-encodes bodies, so this uses
 * a raw fetch. The browser sets the multipart boundary; do not set Content-Type.
 */
export async function uploadAttachment(file: File): Promise<GrievanceAttachment> {
  const form = new FormData();
  form.append('file', file);
  const token = getAccessToken();
  const res = await fetch('/api/v1/grievances/attachments', {
    method: 'POST',
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  const text = await res.text();
  const parsed = text ? JSON.parse(text) : undefined;
  if (!res.ok) throw new ApiRequestError(res.status, parsed, 'Upload failed');
  return (parsed as { attachment: GrievanceAttachment }).attachment;
}

export function trackGrievance(
  trackingId: string,
): Promise<{ grievance: GrievancePublic | GrievanceDetail }> {
  return api(`/grievances/${encodeURIComponent(trackingId.trim().toUpperCase())}`);
}

export function listMyGrievances(): Promise<{ grievances: GrievanceListItem[] }> {
  return api('/grievances/mine');
}

export function updateGrievanceStatus(
  trackingId: string,
  input: UpdateGrievanceStatusInput,
): Promise<{ grievance: GrievancePublic }> {
  return api(`/grievances/${encodeURIComponent(trackingId)}/status`, {
    method: 'PATCH',
    body: input,
  });
}

export function attachmentUrl(id: string): string {
  return `/api/v1/grievances/attachments/${encodeURIComponent(id)}`;
}

export function isDetail(
  g: GrievancePublic | GrievanceDetail,
): g is GrievanceDetail {
  return 'description' in g;
}

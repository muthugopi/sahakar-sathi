import type {
  ContentSectionCode,
  ContentTopic,
  KnowledgeCategory,
  SchemeDetail,
  SchemeSummary,
  UpdateItem,
} from '@sahakar/shared';
import { api } from './api';

export interface SchemeFacets {
  categories: KnowledgeCategory[];
  states: string[];
  targetUsers: string[];
}

export interface SchemeListResponse {
  schemes: SchemeSummary[];
  facets: SchemeFacets;
}

export interface SchemeFilters {
  category?: KnowledgeCategory;
  state?: string;
  targetUser?: string;
  q?: string;
}

export function fetchSchemes(filters: SchemeFilters = {}): Promise<SchemeListResponse> {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) if (v) params.set(k, v);
  const qs = params.toString();
  return api<SchemeListResponse>(`/schemes${qs ? `?${qs}` : ''}`, { auth: false });
}

export function fetchScheme(slug: string): Promise<{ scheme: SchemeDetail }> {
  return api(`/schemes/${encodeURIComponent(slug)}`, { auth: false });
}

function langQs(lang?: string): string {
  return lang && lang !== 'en' ? `?lang=${encodeURIComponent(lang)}` : '';
}

export function fetchContentSection(
  section: ContentSectionCode,
  lang?: string,
): Promise<{ section: ContentSectionCode; topics: ContentTopic[] }> {
  return api(`/content/${section}${langQs(lang)}`, { auth: false });
}

export function fetchContentTopic(slug: string, lang?: string): Promise<{ topic: ContentTopic }> {
  return api(`/content/topics/${encodeURIComponent(slug)}${langQs(lang)}`, { auth: false });
}

export function fetchUpdates(): Promise<{ updates: UpdateItem[] }> {
  return api('/content/updates', { auth: false });
}

/**
 * Secondary knowledge sources for the hybrid assistant.
 *
 *  - Wikipedia (en / hi / ta) — always available, no key. Used for definitions
 *    and background.
 *  - A general web-search provider (Tavily) — only when WEB_SEARCH_API_KEY is
 *    set. Used for current-information queries; results carry a publish date.
 *
 * Both fail soft: a network error or timeout returns an empty list so the
 * knowledge-base answer is never blocked.
 */
import type { LanguageCode, SourceTier } from '@sahakar/shared';
import { env, hasGeneralWebSearch } from '../config/env.js';
import { logger } from '../config/logger.js';

export interface WebResult {
  title: string;
  url: string;
  authority: string;
  snippet: string;
  tier: SourceTier;
  publishedAt: string | null;
}

const WIKI_HOST: Record<LanguageCode, string> = {
  en: 'en.wikipedia.org',
  hi: 'hi.wikipedia.org',
  ta: 'ta.wikipedia.org',
};

async function fetchJson(url: string, init?: RequestInit): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), env.WEB_SEARCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        'User-Agent': 'SahakarSathi/0.1 (cooperative support assistant; demo)',
        Accept: 'application/json',
        ...(init?.headers ?? {}),
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/* -------------------------------------------------------------------------- */
/*  Wikipedia                                                                  */
/* -------------------------------------------------------------------------- */

interface WikiPage {
  title: string;
  extract?: string;
  fullurl?: string;
  index?: number;
}

async function searchWikipedia(query: string, host: string, limit: number): Promise<WebResult[]> {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: query,
    gsrlimit: String(limit),
    gsrnamespace: '0',
    prop: 'extracts|info',
    exintro: '1',
    explaintext: '1',
    exsentences: '5',
    inprop: 'url',
    redirects: '1',
  });

  const data = (await fetchJson(`https://${host}/w/api.php?${params.toString()}`)) as {
    query?: { pages?: Record<string, WikiPage> };
  };
  const pages = Object.values(data.query?.pages ?? {});
  pages.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

  return pages
    .filter((p) => p.extract && p.fullurl)
    .map((p) => ({
      title: p.title,
      url: p.fullurl!,
      authority: 'Wikipedia',
      snippet: p.extract!.replace(/\s+/g, ' ').trim().slice(0, 600),
      tier: 'ENCYCLOPEDIA' as const,
      publishedAt: null,
    }));
}

async function wikipedia(query: string, language: LanguageCode, limit: number): Promise<WebResult[]> {
  try {
    const localised =
      language !== 'en' ? await searchWikipedia(query, WIKI_HOST[language], limit) : [];
    if (localised.length > 0) return localised;
    return await searchWikipedia(query, WIKI_HOST.en, limit);
  } catch (err) {
    logger.warn({ err: String(err) }, 'wikipedia search failed');
    return [];
  }
}

/* -------------------------------------------------------------------------- */
/*  General web search (Tavily)                                                */
/* -------------------------------------------------------------------------- */

async function tavily(query: string, limit: number): Promise<WebResult[]> {
  try {
    const data = (await fetchJson('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: env.WEB_SEARCH_API_KEY,
        query,
        max_results: limit,
        search_depth: 'basic',
        include_answer: false,
      }),
    })) as { results?: { title: string; url: string; content: string; published_date?: string }[] };

    return (data.results ?? []).map((r) => ({
      title: r.title,
      url: r.url,
      authority: hostname(r.url),
      snippet: r.content.replace(/\s+/g, ' ').trim().slice(0, 600),
      tier: 'WEB' as const,
      publishedAt: normaliseDate(r.published_date),
    }));
  } catch (err) {
    logger.warn({ err: String(err) }, 'tavily search failed');
    return [];
  }
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'web';
  }
}

function normaliseDate(value?: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/* -------------------------------------------------------------------------- */

export interface WebSearchOptions {
  /** Also query the general web-search provider (for current-info questions). */
  general?: boolean;
  limit?: number;
}

/**
 * Returns web results ordered by trust tier (Wikipedia before general web).
 * Empty when web search is disabled or every provider fails.
 */
export async function searchWeb(
  query: string,
  language: LanguageCode,
  opts: WebSearchOptions = {},
): Promise<WebResult[]> {
  if (!env.WEB_SEARCH_ENABLED) return [];
  const limit = opts.limit ?? 2;

  const tasks: Promise<WebResult[]>[] = [wikipedia(query, language, limit)];
  if (opts.general && hasGeneralWebSearch && env.WEB_SEARCH_PROVIDER === 'tavily') {
    tasks.push(tavily(query, limit));
  }

  const settled = await Promise.all(tasks);
  const encyclopedia = settled[0] ?? [];
  const web = settled[1] ?? [];
  return [...encyclopedia, ...web];
}

export const webSearchStatus = () => ({
  wikipedia: env.WEB_SEARCH_ENABLED,
  generalProvider: hasGeneralWebSearch ? env.WEB_SEARCH_PROVIDER : null,
});

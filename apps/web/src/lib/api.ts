import type { ApiError } from '@sahakar/shared';

const BASE = '/api/v1';

export class ApiRequestError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(status: number, body: ApiError | undefined, fallback: string) {
    super(body?.error?.message ?? fallback);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = body?.error?.code ?? 'INTERNAL';
    this.details = body?.error?.details;
  }
}

/* --- in-memory access token (never persisted to storage) --- */

let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};
export const getAccessToken = () => accessToken;

/**
 * Called on a 401 to attempt a silent refresh using the httpOnly cookie.
 * Wired up by the AuthProvider to avoid a circular import.
 */
let refreshFn: (() => Promise<boolean>) | null = null;
export const setRefreshHandler = (fn: (() => Promise<boolean>) | null) => {
  refreshFn = fn;
};

type Options = Omit<RequestInit, 'body'> & {
  body?: unknown;
  timeoutMs?: number;
  auth?: boolean; // attach bearer token (default true)
  _retry?: boolean;
};

async function raw<T>(path: string, opts: Options): Promise<T> {
  const { body, timeoutMs = 20_000, headers, auth = true, _retry, ...rest } = opts;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${BASE}${path}`, {
      ...rest,
      credentials: 'include',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(auth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401 && auth && !_retry && refreshFn) {
      const ok = await refreshFn();
      if (ok) return raw<T>(path, { ...opts, _retry: true });
    }

    if (res.status === 204) return undefined as T;

    const text = await res.text();
    const parsed = text ? JSON.parse(text) : undefined;

    if (!res.ok) throw new ApiRequestError(res.status, parsed as ApiError, 'Request failed');
    return parsed as T;
  } catch (err) {
    if (err instanceof ApiRequestError) throw err;
    if ((err as Error).name === 'AbortError') {
      throw new ApiRequestError(0, undefined, 'The request timed out. Check your connection.');
    }
    throw new ApiRequestError(0, undefined, 'Network error. You may be offline.');
  } finally {
    clearTimeout(timer);
  }
}

export const api = <T>(path: string, opts: Options = {}) => raw<T>(path, opts);

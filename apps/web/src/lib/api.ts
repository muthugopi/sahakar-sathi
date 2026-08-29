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

type Options = Omit<RequestInit, 'body'> & { body?: unknown; timeoutMs?: number };

/**
 * Thin fetch wrapper: JSON in/out, credentials included (cookie auth),
 * timeout, and the shared error envelope surfaced as ApiRequestError.
 */
export async function api<T>(path: string, opts: Options = {}): Promise<T> {
  const { body, timeoutMs = 20_000, headers, ...rest } = opts;
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
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (res.status === 204) return undefined as T;

    const text = await res.text();
    const parsed = text ? JSON.parse(text) : undefined;

    if (!res.ok) {
      throw new ApiRequestError(res.status, parsed as ApiError, 'Request failed');
    }
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

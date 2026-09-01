import 'dotenv/config';
import { z } from 'zod';

/**
 * Single source of truth for configuration. The process refuses to start if
 * anything required is missing or malformed — no silent misconfiguration.
 */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  // PaaS platforms inject PORT; fall back to API_PORT, then 4000.
  API_PORT: z.coerce.number().int().positive().default(4000),
  PORT: z.coerce.number().int().positive().optional(),
  WEB_ORIGIN: z
    .string()
    .default('http://localhost:5173')
    .transform((v) => v.split(',').map((s) => s.trim()).filter(Boolean)),

  // When set to a directory, the API also serves that built SPA and falls back
  // to its index.html for client-side routes (single-origin production deploy).
  SERVE_WEB_DIR: z.string().optional(),

  DATABASE_URL: z.string().url(),
  // Non-pooled connection for Prisma migrations; defaults to DATABASE_URL.
  DIRECT_URL: z.string().url().optional(),

  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 chars'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 chars'),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL: z.string().default('30d'),

  // Which chat model provider to use. 'auto' picks Gemini if GEMINI_API_KEY is
  // set, else Anthropic if ANTHROPIC_API_KEY is set, else the offline mock.
  LLM_PROVIDER: z.enum(['auto', 'gemini', 'anthropic', 'mock']).default('auto'),
  ANTHROPIC_API_KEY: z.string().optional().default(''),
  // Google AI Studio key (free tier): https://aistudio.google.com/apikey
  GEMINI_API_KEY: z.string().optional().default(''),
  // Optional model override. Defaults per provider: gemini-3.6-flash / claude-sonnet-5.
  LLM_MODEL: z.string().optional(),
  LLM_MAX_TOKENS: z.coerce.number().int().positive().default(1024),

  EMBEDDINGS_PROVIDER: z.enum(['local', 'voyage']).default('local'),
  VOYAGE_API_KEY: z.string().optional().default(''),

  // Hybrid knowledge: Wikipedia (en/hi/ta) is the always-on secondary source.
  // Set WEB_SEARCH_API_KEY to also use a general web-search provider (Tavily)
  // for current-information queries.
  WEB_SEARCH_ENABLED: z
    .string()
    .default('true')
    .transform((v) => v.toLowerCase() !== 'false'),
  WEB_SEARCH_PROVIDER: z.enum(['tavily']).default('tavily'),
  WEB_SEARCH_API_KEY: z.string().optional().default(''),
  WEB_SEARCH_TIMEOUT_MS: z.coerce.number().int().positive().default(5000),

  SPEECH_PROVIDER: z.enum(['browser']).default('browser'),

  UPLOAD_DIR: z.string().default('./storage/uploads'),
  MAX_UPLOAD_MB: z.coerce.number().int().positive().default(10),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(60),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('❌ Invalid environment configuration:');
  for (const issue of parsed.error.issues) {
    // eslint-disable-next-line no-console
    console.error(`   - ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;

/** The port to bind — a platform-injected PORT wins over API_PORT. */
export const port = env.PORT ?? env.API_PORT;

export const isProd = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

/**
 * The chat provider actually in effect, after applying LLM_PROVIDER and which
 * API keys are present. Falls back to the offline mock when nothing is usable.
 */
export const llmProvider: 'gemini' | 'anthropic' | 'mock' = (() => {
  switch (env.LLM_PROVIDER) {
    case 'gemini':
      return env.GEMINI_API_KEY ? 'gemini' : 'mock';
    case 'anthropic':
      return env.ANTHROPIC_API_KEY ? 'anthropic' : 'mock';
    case 'mock':
      return 'mock';
    default:
      if (env.GEMINI_API_KEY) return 'gemini';
      if (env.ANTHROPIC_API_KEY) return 'anthropic';
      return 'mock';
  }
})();

/** True when a real LLM provider is configured; otherwise the mock adapter is used. */
export const hasLlm = llmProvider !== 'mock';

/** Model id for the active provider (explicit LLM_MODEL, else a per-provider default). */
export const llmModel: string = (() => {
  const m = env.LLM_MODEL?.trim();
  if (llmProvider === 'gemini') return m && !/claude/i.test(m) ? m : 'gemini-3.6-flash';
  if (llmProvider === 'anthropic') return m && !/gemini/i.test(m) ? m : 'claude-sonnet-5';
  return m ?? 'mock';
})();

/** Wikipedia is always available; this adds a general web-search provider on top. */
export const hasGeneralWebSearch = env.WEB_SEARCH_ENABLED && env.WEB_SEARCH_API_KEY.length > 0;

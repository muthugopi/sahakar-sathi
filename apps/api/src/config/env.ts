import 'dotenv/config';
import { z } from 'zod';

/**
 * Single source of truth for configuration. The process refuses to start if
 * anything required is missing or malformed — no silent misconfiguration.
 */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().positive().default(4000),
  WEB_ORIGIN: z
    .string()
    .default('http://localhost:5173')
    .transform((v) => v.split(',').map((s) => s.trim()).filter(Boolean)),

  DATABASE_URL: z.string().url(),
  // Non-pooled connection for Prisma migrations; defaults to DATABASE_URL.
  DIRECT_URL: z.string().url().optional(),

  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 chars'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 chars'),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL: z.string().default('30d'),

  ANTHROPIC_API_KEY: z.string().optional().default(''),
  LLM_MODEL: z.string().default('claude-sonnet-5'),
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

export const isProd = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

/** True when a real LLM provider is configured; otherwise the mock adapter is used. */
export const hasLlm = env.ANTHROPIC_API_KEY.length > 0;

/** Wikipedia is always available; this adds a general web-search provider on top. */
export const hasGeneralWebSearch = env.WEB_SEARCH_ENABLED && env.WEB_SEARCH_API_KEY.length > 0;

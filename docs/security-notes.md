# Security notes (running log)

Tracked here as milestones land; a full audit happens in M8.

## Dependency vulnerabilities (as of M3, 2026-08-29)

`npm audit` reports 6 high, 0 critical. All are in **dev / build / install tooling**,
none in the HTTP request path:

| Package | Via | Reach | Plan |
|---|---|---|---|
| `deepmerge-ts` | `prisma` → `@prisma/config` | Migration CLI only, not runtime | Wait for Prisma patch; not shipped |
| `adm-zip` | `@huggingface/transformers` → `onnxruntime-node` | Unpacks the official ONNX runtime binary at **install time** | Not reachable from requests; revisit when transformers updates |
| `esbuild` (fixed) | `vitest` | Dev test runner | Fixed by bumping vitest to v3 |

`onnxruntime-web` and `sharp` are pinned to patched versions via root `overrides`
(`sharp@^0.35.4`, `onnxruntime-web@1.26.0`) — they resolved the 2 criticals + several highs.

## Controls in place

- argon2id password hashing; pino redaction of tokens/passwords/cookies
- Access JWT (15m) + rotating refresh tokens (SHA-256 at rest, reuse detection)
- `requireAuth` / `optionalAuth` / `requireRole`
- Zod validation replacing raw `req.body`/`query`/`params` on every mutating route
- Rate limiters: global, tighter on `/auth/*`, per-window cap on `/chat`
- Helmet, explicit CORS allowlist, `x-powered-by` off, request-id correlation
- Prisma parameterised queries; raw SQL only for pgvector search with **bound** params
  (`retrieval.service.ts`, `knowledge.service.ts`)
- LLM grounding prompt forbids inventing schemes/laws/eligibility/deadlines/contacts;
  retrieval below a similarity floor returns `NO_SOURCE` instead of guessing
- `ANTHROPIC_API_KEY` read from env only; absent → deterministic mock adapter (no external calls)

## M8 hardening (2026-08-30)

Done:
- **CSP locked down** on the API — `default-src 'none'`, `frame-ancestors 'none'`,
  `base-uri 'none'`, `form-action 'none'` (JSON-only service); HSTS in production;
  `crossOriginResourcePolicy: same-site`; `etag` disabled.
- **CORS** is now a strict allow-list function (unknown browser origins get no CORS
  headers → blocked client-side); `maxAge` 600.
- Body limits: `urlencoded` tightened to 32 KB / `extended: false`; `express.json` kept
  at 1 MB (admin document paste path) — PDF uploads use multer, not this parser.
- Upload magic-byte validation shipped in M7 (`utils/upload`).
- `SECURITY.md` added at the repo root (controls + disclosure + outstanding list).
- PWA service worker: `navigateFallbackDenylist: [/^\/api\//]` so the SW never serves a
  cached response for auth / chat / grievance requests; only `/content` + `/schemes`
  GETs are runtime-cached (`NetworkFirst`, 4s timeout).

Still open (tracked in `SECURITY.md`):
- Redis rate-limit store for multi-instance
- `npm audit` CI gate + Dependabot; Prisma 7 upgrade to clear the dev-only CLI advisory
- CSRF double-submit token if another route adopts cookie auth
- Web-origin CSP/HSTS (host responsibility for the static SPA)
- Penetration test / formal dependency review

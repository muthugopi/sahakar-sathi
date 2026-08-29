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

## Open items for M8

- Upload validation (magic-byte checks) — arrives with admin document upload (M7)
- CSRF: refresh cookie is `SameSite=Lax` + path-scoped; add a double-submit token if any
  state-changing endpoint moves to cookie auth
- Per-conversation authorization for anonymous chats currently relies on the unguessable
  conversation id — acceptable, but note it
- `npm audit` gate in CI; Dependabot/renovate
- Structured rate-limit store (Redis) for multi-instance deploys
- Security headers review (CSP tightening for the SPA)

# Security

Sahakar Sathi is a prototype. This document records the controls in place and the
work still outstanding before any real deployment.

## Reporting a vulnerability

Open a private security advisory on the repository, or email the maintainer. Please do
not file public issues for security problems.

## Controls in place

### Authentication & sessions
- Passwords hashed with **argon2id** (19 MB memory, 2 iterations); never stored,
  logged, or returned.
- Short-lived access JWT (15 min, issuer-bound) + opaque refresh token stored only as a
  SHA-256 hash. Refresh **rotation with reuse detection**: replaying a spent token
  revokes every session for that user.
- Refresh token in an `httpOnly`, `SameSite=Lax`, path-scoped (`/api/v1/auth`) cookie;
  `Secure` in production.
- Login is timing-safe (hashes even for unknown accounts; uniform error message).

### Authorization
- `requireAuth` / `optionalAuth` / `requireRole('ADMIN')` middleware.
- Every admin mutation writes an `AuditLog` row (actor, action, target, IP).
- Grievance tracking by ID exposes status + timeline only; the description, contact
  details and attachments are returned only to the owner or an admin.

### Input handling
- Zod validation on every mutating endpoint; parsed data **replaces** `req.body` /
  `req.query` / `req.params`.
- Prisma parameterised queries throughout; the only raw SQL (pgvector search, chunk
  insert) uses bound parameters.
- File uploads: extension + MIME allow-list **and magic-byte content check**; size cap;
  random storage key outside the web root; path-traversal guards on download.
- Body size limits (`express.json` 1 MB, `urlencoded` 32 KB); upload cap
  `MAX_UPLOAD_MB` (default 10 MB, enforced by multer before the buffer is read).

### Transport & headers
- `helmet` with a locked-down CSP (`default-src 'none'`, `frame-ancestors 'none'`) — the
  API serves JSON only. HSTS in production.
- Explicit CORS origin allow-list from `WEB_ORIGIN`; credentialed.
- `x-powered-by` disabled; `x-request-id` correlation on every request/response/error.

### Rate limiting
- Global limiter, plus tighter limits on `/auth/*` (10 / 15 min), `/chat` (15 / min),
  `/grievances` (10 / hr) and uploads (20 / hr). In-memory store — see below.

### AI grounding
- The assistant answers only from retrieved verified documents; a similarity floor
  returns a "no verified information" response instead of guessing. The system prompt
  forbids inventing schemes, laws, eligibility rules, deadlines, amounts or contacts.
- `ANTHROPIC_API_KEY` is read from the environment only; absent → a deterministic mock
  adapter that makes no external calls.

### Secrets
- All configuration via environment variables, Zod-validated at boot (process exits on
  a missing/invalid value). `.env` is git-ignored; `.env.example` is committed.

## Outstanding before production

| Item | Notes |
|---|---|
| Rate-limit store | In-memory — move to Redis for multi-instance deploys |
| `npm audit` | 6 high, 0 critical — all in **dev / install tooling** (Prisma CLI's `deepmerge-ts`, the ONNX runtime's install-time `adm-zip`), none reachable from a request. Track Prisma 7 upgrade to clear the CLI ones. |
| CI gate | Add `npm audit --audit-level=high` (with the known dev-only exceptions) + Dependabot/Renovate |
| CSRF | Refresh cookie is `SameSite=Lax` + path-scoped; add a double-submit token if any other state-changing route moves to cookie auth |
| Anonymous grievance access | Protected only by the unguessable tracking ID — acceptable, documented |
| Web CSP | The SPA is served as static files; the host should send a CSP + HSTS for the web origin |
| Pen test / dependency review | Not yet performed |
| Secret rotation | JWT secrets and DB credentials should rotate on a schedule in production |

See also [`docs/security-notes.md`](./docs/security-notes.md) for the running log.

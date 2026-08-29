# Architecture

## 1. Overview

Sahakar Sathi is a **digital rural cooperative assistance platform**. The centre of
gravity is a Retrieval-Augmented Generation (RAG) assistant grounded in verified
government and cooperative documents; around it sit content sections (schemes,
cooperative law, PACS, PMFBY, financial literacy), a grievance workflow, and an admin
console for managing the knowledge base.

```
apps/
  web/     React + Vite PWA  (mobile-first, offline-tolerant)
  api/     Express + Prisma   (thin routes -> services -> data)
packages/
  shared/  Zod schemas, enums, constants  (single frontend/backend contract)
data/
  knowledge/  seed official documents + metadata   (added in M3/M5)
```

## 2. Technology stack detected / chosen

Greenfield repo (empty at start). Chosen: React 18 + Vite + TS + Tailwind on the
frontend; Node 22 + Express + TS + Prisma on the backend; PostgreSQL 16 with `pgvector`
for both relational data and embeddings (one datastore keeps rural/low-budget
deployments simple). Anthropic Claude for generation behind an `LLMClient` interface
with a deterministic mock adapter so the system runs with no API key. Embeddings from a
local `bge-small` model (384-dim, no key, ~90 MB one-time download) with a hosted Voyage
option.

## 3. Frontend approach

- **Mobile is the primary target.** Larger base font, ≥48px touch targets, native
  `<select>` for language, horizontal-scroll nav instead of a hamburger on small screens.
- **Low bandwidth:** system fonts only (Android already ships Noto), route-level code
  splitting, `manualChunks` for vendor libs, cache-first data via TanStack Query,
  offline banner + graceful degradation (educational pages work offline; assistant
  requires connectivity). Service worker / precache lands in M8.
- **Design language:** "cooperative register" — ruled rows evoking a passbook/ledger,
  quiet palette (cooperative green `#2f6b3f`, warm paper `#fbfaf6`, marigold accent for
  voice actions, clay for grievance/alerts). No gradient hero, no card sprawl.
- **i18n:** `i18next` with bundled chrome catalogs (`en`, `hi`, `ta`). AI answer text is
  translated server-side, not just the labels. New language = one entry in
  `SUPPORTED_LANGUAGES` + one locale file.
- **Accessibility:** skip link, visible focus ring everywhere, `prefers-reduced-motion`
  honoured, semantic landmarks, no colour-only signalling.

## 4. Backend approach

- **Layering:** `routes/` (wiring + validation middleware) → `controllers/` (HTTP shape)
  → `services/` (business logic, testable) → Prisma. No business logic in route
  handlers.
- **Config:** `src/config/env.ts` validates all environment variables with Zod at boot
  and exits on failure. No `process.env` reads elsewhere.
- **Errors:** one `AppError` type + a global handler emitting the shared envelope
  `{ error: { code, message, details?, requestId } }`. Zod and known Prisma errors are
  mapped. Stack traces never leave the process in production.
- **Observability:** `pino` structured logs with token/password/cookie redaction; every
  request carries an `x-request-id`.
- **RAG isolation:** `src/ai/` (LLM client, prompt templates, grounding rules,
  retrieval) and `src/speech/` are self-contained and swappable.

## 5. AI / RAG architecture

```
user question
  → language detection (server; overridable by explicit selection)
  → query normalisation + translate-to-English for retrieval
  → embed query (bge-small)
  → pgvector similarity search over DocumentChunk
       filtered by: isPublished + isVerified, category (if provided), language
  → top-k chunks + parent KnowledgeDocument metadata
  → if best score < threshold → NO_SOURCE path:
       "I don't have verified information on this" + official contact channel
  → build grounded prompt: numbered sources, system rules ("cite or refuse",
       never invent schemes/laws/eligibility/deadlines, mark facts vs explanation,
       cautious wording for legal/financial/agricultural topics)
  → Claude (low temperature)
  → post-process: attach SourceRef[] cards, attach disclaimers[], set confidence
       (HIGH / MEDIUM / LOW / NO_SOURCE)
  → translate answer to the user's selected language
  → persist Message (with sources + confidence) on the Conversation
  → return; optional client-side TTS
```

Retrieved official text always outranks the model's own knowledge. The system prompt
forbids fabricating laws, schemes, eligibility rules, deadlines, benefits, or grievance
contacts, and requires the assistant to admit uncertainty and point to official
channels.

## 6. Database design

Prisma models (`apps/api/prisma/schema.prisma`):

| Model | Purpose |
|---|---|
| `User` | name, email/phone, `passwordHash`, `role`, `preferredLanguage`, district/state |
| `RefreshToken` | hashed rotating refresh tokens, revocation, reuse detection |
| `Conversation` / `Message` | chat history; `Message` stores `sources` (JSON), `confidence`, `disclaimers` |
| `Scheme` | title, purpose, eligibility, benefits, documents, official source, `verifiedAt`, per-state, `isArchived` |
| `KnowledgeDocument` | title, category, authority, source URL/file, language, `version`, `isVerified`/`verifiedAt`, `isPublished` |
| `DocumentChunk` | chunk text + `vector(384)` embedding (`Unsupported`, queried via raw SQL) |
| `Grievance` / `GrievanceEvent` | grievance + status-history timeline; `trackingId` for public lookup |
| `Attachment` | uploaded supporting files (validated) |
| `Feedback` | thumbs up/down + comment on an assistant `Message` |
| `AuditLog` | admin/security-relevant actions |

Enums for role, language, categories, and grievance status live in Prisma **and** in
`@sahakar/shared` so validation and DB stay aligned.

## 7. API architecture

REST under `/api/v1`. Consistent error envelope. Zod validation middleware replaces
`req.body`/`req.query`/`req.params` with parsed data. Planned surface:

```
POST   /api/v1/auth/register | login | refresh | logout      (M2)
GET    /api/v1/auth/me                                        (M2)
POST   /api/v1/chat            GET /api/v1/chat/history        (M3)
POST   /api/v1/feedback                                       (M3)
POST   /api/v1/voice/transcribe | speak   (fallback only)     (M4)
GET    /api/v1/schemes         GET /api/v1/schemes/:slug       (M5)
GET    /api/v1/cooperative/laws | services                    (M5)
GET    /api/v1/pacs/services   GET /api/v1/finance/lessons     (M5)
POST   /api/v1/grievances      GET /api/v1/grievances/:trackingId   (M6)
GET    /api/v1/grievances      (own, authed)                  (M6)
GET    /api/v1/admin/analytics                                (M7)
CRUD   /api/v1/admin/documents | schemes | grievances         (M7)
```

## 8. Security concerns & controls

| Concern | Control |
|---|---|
| Password storage | argon2id, never plaintext, never logged (pino redaction) |
| Session | short-lived access JWT + rotating refresh token (hashed at rest), reuse detection, httpOnly/SameSite cookie |
| Authorization | role guard middleware; admin routes also write `AuditLog` |
| Input validation | Zod on every mutating endpoint; parsed data replaces raw input |
| Injection | Prisma parameterised queries; raw SQL only for vector search with bound params |
| File upload | extension + MIME + magic-byte check, size cap, stored outside web root, random keys |
| Secrets | env-only, Zod-validated at boot, `.env` git-ignored, `.env.example` committed |
| CORS | explicit origin allowlist from `WEB_ORIGIN`, credentials mode |
| Rate limiting | global + tighter limits on auth and chat |
| Error leakage | no stack traces in prod; generic 500 message; requestId for correlation |
| Headers | `helmet`, `x-powered-by` disabled |
| Excessive data exposure | `publicUser` projection; internal fields never serialised |

Full audit + `npm audit` gate + dependency review scheduled for M8.

## 9. Implementation roadmap

| Milestone | Contents |
|---|---|
| **M1** ✅ | Monorepo, TS config, Prisma schema + `pgvector`, env/logging/error middleware, health checks, web shell + language selector + home page |
| **M2** | Registration/login/refresh/logout, role guards, admin seed, `/auth/me`, web auth flows |
| **M3** | Knowledge doc model + ingestion (PDF → text → chunk → embed), retrieval service, `/chat` with grounding + sources + confidence, feedback, web chat UI (text, history, suggested questions, loading/error/offline states, source cards) |
| **M4** | Server language detection, translation layer, Web Speech STT/TTS integration (play/pause/stop/replay), `/voice/*` fallback stubs |
| **M5** | Scheme Explorer (filter by category/state/target/eligibility), Cooperative Law & Governance (simple + legal view), PACS services, PMFBY assistance, Financial Literacy lessons — all data-driven from verified seed content |
| **M6** | Grievance submit → tracking ID → status workflow (`SUBMITTED…CLOSED`) → tracking UI, attachments, voice description |
| **M7** | Admin dashboard: analytics (users, conversations, languages, top questions, grievances), knowledge management (upload/verify/version/categorise), scheme management (create/edit/verify/archive), grievance management (assign/update/respond/resolve) |
| **M8** | PWA precache + offline routes, retry/backoff, asset compression, mobile pass, security audit, accessibility + UX audit |

## 10. What is now stable (do not casually change)

Once M1 is merged, treat these as the load-bearing contract:

- `packages/shared` — Zod schemas, enums, `SUPPORTED_LANGUAGES`, `API_ERROR_CODES`.
- `apps/api/prisma/schema.prisma` — enums are mirrored in `shared`; migrations only.
- The API error envelope shape `{ error: { code, message, details?, requestId } }`.
- The `/api/v1` prefix and the `AppError` → handler flow.
- The env-validation-at-boot rule: no ad-hoc `process.env` reads.

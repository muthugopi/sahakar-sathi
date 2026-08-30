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
local `multilingual-e5-small` model (384-dim, no key, ~120 MB one-time download) with a hosted Voyage
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
  → language detection (script-based: en / ta / hi) — overridable by explicit selection
  → embed query with multilingual-e5-small (384-dim, "query: " prefix)
       one shared multilingual vector space → a Tamil/Hindi question matches
       English source docs directly, no translation hop
  → pgvector cosine search over DocumentChunk (<=> operator, bound params)
       filtered by: isPublished + isVerified, category (if provided)
  → keep chunks with similarity ≥ 0.80 (a false source is worse than NO_SOURCE)
  → none kept → NO_SOURCE path: "I don't have verified information on this"
       + the appropriate official channel
  → build grounded prompt: numbered [n] sources + system rules
       (answer only from sources; never invent schemes/laws/eligibility/deadlines/
        contacts; cite [n]; separate fact from plain-language explanation; cautious
        wording for legal/financial/agri; ask one clarifying question when needed;
        reply in the user's language)
  → Claude (claude-sonnet-5 by default; deterministic mock adapter when no API key)
  → post-process: parse [n] → SourceRef[] cards (dedup by document),
       rule-based disclaimers[] by category, confidence from retrieval scores
       (HIGH ≥0.85 · MEDIUM ≥0.78 · LOW · NO_SOURCE)
  → persist Message (content, confidence, sources, disclaimers) on the Conversation
  → return; client-side TTS in M4
```

Retrieved official text always outranks the model's own knowledge. The system prompt
forbids fabricating laws, schemes, eligibility rules, deadlines, benefits, or grievance
contacts, and requires the assistant to admit uncertainty and point to official
channels. The embedding model (~120 MB) runs on-device, downloading once to `.cache/`;
a hosted Voyage option sits behind `EMBEDDINGS_PROVIDER`.

## 6. Database design

Prisma models (`apps/api/prisma/schema.prisma`):

| Model | Purpose |
|---|---|
| `User` | name, email/phone, `passwordHash`, `role`, `preferredLanguage`, district/state |
| `RefreshToken` | hashed rotating refresh tokens, revocation, reuse detection |
| `Conversation` / `Message` | chat history; `Message` stores `sources` (JSON), `confidence`, `disclaimers` |
| `Scheme` | title, purpose, eligibility, benefits, documents, official source, `verifiedAt`, per-state, `isArchived` |
| `KnowledgeDocument` | title, category, authority, source URL/file, language, `version`, `isVerified`/`verifiedAt`, `isPublished` |
| `ContentTopic` | browsable explainer (cooperative law / PACS / finance / PMFBY-FAQ): `section`, `topic`, `simpleExplanation`, `detailedExplanation?`, `example?`, authority, source, `order`, `verifiedAt` |
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
GET    /api/v1/voice/config    POST /voice/transcribe | speak (M4; server STT/TTS reserved)
GET    /api/v1/schemes  ?category&state&targetUser&q          (M5)
GET    /api/v1/schemes/:slug                                  (M5)
GET    /api/v1/content/:section   (COOPERATIVE_LAW|PACS|FINANCIAL_LITERACY|PMFBY)  (M5)
GET    /api/v1/content/topics/:slug                           (M5)
GET    /api/v1/content/updates   (recently verified schemes + topics)  (design v2)
POST   /api/v1/grievances        POST /api/v1/grievances/attachments   (M6)
GET    /api/v1/grievances/:trackingId    GET /api/v1/grievances/mine   (M6)
GET    /api/v1/grievances/attachments/:id   PATCH .../:trackingId/status (M6; PATCH = ADMIN)
GET    /api/v1/admin/analytics                                (M7; ADMIN only)
CRUD   /api/v1/admin/documents  (POST accepts pasted text or a PDF)   (M7)
CRUD   /api/v1/admin/schemes    (+ /:slug/verify, /:slug/archive)     (M7)
GET    /api/v1/admin/grievances   PATCH /api/v1/admin/grievances/:trackingId  (M7)
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
| **M2** ✅ | Registration/login/refresh/logout, argon2id, rotating refresh tokens + reuse detection, role guards, admin seed, `/auth/me`, web auth flows |
| **M3** ✅ | Knowledge doc model + ingestion (chunk → embed → pgvector), retrieval service, `/chat` grounded answers (cite-or-refuse, confidence, source cards, disclaimers), `/feedback`, seed KB, web chat UI (text, history, suggestions, category focus, loading/error/offline). PDF upload lands with admin (M7) |
| **M4** ✅ | Browser Web Speech STT (dictation into the composer, auto-start from the home "Speak" button) + TTS (play/pause/stop/replay per answer, shared engine, "read aloud" toggle, markdown/citation stripping), `en-IN`/`ta-IN`/`hi-IN`; `GET /voice/config` capability descriptor + reserved `POST /voice/transcribe|speak` (501 until a hosted provider such as Bhashini is wired) |
| **M5** ✅ | `Scheme` API (`GET /schemes` — who-can-apply / category / state / search filters + facets — and `GET /schemes/:slug`) plus a `ContentTopic` model with `GET /content/:section` and `/content/topics/:slug` serving Cooperative Law, PACS, Financial Literacy and PMFBY-FAQ (Simple + Detailed views, rural examples, official links). Public + cache-headed. Web: Scheme Explorer + detail pages, one generic `ContentSectionPage` + `TopicList` accordion, `AskAssistantLink` deep-links, popular schemes on the home page. `db:seed:content` seeds 5 schemes + 29 topics and ingests each into the KB so the assistant grounds on the same verified text |
| **M6** ✅ | `utils/upload` (multer + MIME allowlist + **magic-byte** check + path guards), `grievance.service` (`GRV-XXXXXXXX` id, initial event, public-vs-owner/admin projections, validated transition map, orphan-attachment prune). Web: GrievancePage (voice-dictated description via `DictationTextarea`, up to 5 attachments), TrackGrievancePage (`/track`, `/track/:id`) with `StatusTimeline` + inline admin control. Anonymous tracking shows status + timeline only |
| **M7** ✅ | Admin API (ADMIN-only, audit-logged): real analytics, knowledge management (create from pasted text **or** an uploaded text-based PDF via `unpdf`, verify, in-place re-ingest, delete), scheme management (create/edit/verify/archive with KB re-index), grievance management (filter, assign to an admin, validated status transitions + notes). Web `/admin` behind `ProtectedRoute roles={['ADMIN']}` — table-driven, no card grids: key-figures overview, filterable tables with inline actions, a grouped scheme editor, grievance detail + update panel |
| **M8** ✅ | Route-level code-splitting (`React.lazy`; initial JS 248 KB → 144 KB, TanStack Query deferred). `vite-plugin-pwa`: manifest + generated icons + autoUpdate service worker (precache ~536 KiB shell; `NetworkFirst` runtime cache for `GET /content/*` and `/schemes*` only, `/api/` denylisted from the navigation fallback). Focus moves to `<main>` on route change. API `helmet` CSP locked to `default-src 'none'` + HSTS in prod; CORS is a strict allow-list callback; `urlencoded` 32 KB / `extended:false`. `SECURITY.md` + branch security review (no findings) |

## 10. What is now stable (do not casually change)

Once M1 is merged, treat these as the load-bearing contract:

- `packages/shared` — Zod schemas, enums, `SUPPORTED_LANGUAGES`, `API_ERROR_CODES`.
- `apps/api/prisma/schema.prisma` — enums are mirrored in `shared`; migrations only.
- The API error envelope shape `{ error: { code, message, details?, requestId } }`.
- The `/api/v1` prefix and the `AppError` → handler flow.
- The env-validation-at-boot rule: no ad-hoc `process.env` reads.

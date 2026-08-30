# Sahakar Sathi

**AI-powered multilingual cooperative support assistant** for cooperative members,
farmers, and rural citizens in India. Provides grounded, plain-language guidance on
cooperative law, Ministry of Cooperation schemes, PACS services, PMFBY crop insurance,
financial literacy, and grievance redressal — in English, Tamil, and Hindi, with voice
input and read-aloud.

> Guidance only. Not a substitute for official government or legal advice. Answers are
> drawn from official sources where available and clearly mark verified facts vs.
> plain-language explanation.

## Stack

| Area | Tech |
|---|---|
| Web | React 18 + Vite + TypeScript + Tailwind, i18next, TanStack Query |
| API | Node 22 + Express + TypeScript, Prisma |
| DB | PostgreSQL 16 + `pgvector` |
| AI | Anthropic Claude (generation) + local `bge-small` embeddings, RAG over verified docs |
| Voice | Browser Web Speech API (STT + TTS); server fallback pluggable |
| Auth | JWT access + rotating refresh tokens, argon2id hashing |

Monorepo via npm workspaces: `apps/web`, `apps/api`, `packages/shared` (Zod contracts +
constants shared by both sides).

## Prerequisites

- Node.js >= 20 (22 recommended)
- Docker Desktop (for the Postgres + pgvector container) — or any reachable Postgres 16
  with the `vector` extension available.

## Setup

```bash
# 1. install
npm install

# 2. configure
cp .env.example .env
cp .env.example apps/api/.env
#   then edit apps/api/.env:
#   - set JWT_ACCESS_SECRET / JWT_REFRESH_SECRET
#     node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
#   - set SEED_ADMIN_PASSWORD
#   - (optional) set ANTHROPIC_API_KEY — without it the assistant uses a mock adapter

# 3. database
npm run db:up                          # starts Postgres in Docker (or use a hosted DATABASE_URL)
npm run db:migrate                     # applies Prisma migrations
npm run db:seed                        # creates the admin account
npm run db:seed:knowledge --workspace apps/api   # loads the seed knowledge base
npm run db:seed:content --workspace apps/api      # loads schemes + explainer topics (also into the KB)
#   (first run downloads the ~120MB local embedding model to .cache/)

# 4. run
npm run dev              # web on :5173, api on :4000
```

### AI provider

Without `ANTHROPIC_API_KEY`, the assistant runs a **mock adapter**: it performs real
retrieval over the knowledge base and returns the matched official text verbatim with a
"limited offline response" note — it never invents facts. Set `ANTHROPIC_API_KEY` in
`apps/api/.env` for full plain-language answers in the user's language. Model is
`LLM_MODEL` (default `claude-sonnet-5`).

Health check: <http://localhost:4000/api/v1/health/ready>

## Scripts

| Command | Effect |
|---|---|
| `npm run dev` | web + api in watch mode |
| `npm run build` | build shared, api, web |
| `npm run typecheck` | type-check all workspaces |
| `npm test` | run API tests (Vitest) |
| `npm run db:migrate` / `db:seed` / `db:studio` | Prisma tasks |

## Documentation

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — architecture, RAG pipeline, data model, roadmap
- [`docs/`](./docs) — per-milestone notes (added as milestones land)

## Milestone status

- [x] **M1 — Foundation:** monorepo, config, Prisma schema, error/logging middleware,
      health checks, web shell with working language selector, home page.
- [x] **M2 — Auth & roles:** register/login/refresh/logout, argon2id, rotating refresh
      tokens with reuse detection, role guards, web sign-in/register.
- [x] **M3 — Knowledge base + RAG chatbot:** local multilingual embeddings + pgvector
      retrieval, grounded `/chat` (cite-or-refuse, confidence, source cards, disclaimers),
      feedback, seed knowledge base, chat UI (text, history, suggestions, category focus,
      loading/error/offline states).
- [x] **M4 — Voice:** browser speech-to-text (mic → dictate into the composer) and
      text-to-speech (play/pause/stop/replay per answer, "read answers aloud" toggle),
      `en-IN`/`ta-IN`/`hi-IN`; `/voice/config` + reserved server STT/TTS endpoints.
- [x] **M5 — Content sections:** Scheme Explorer (filter by who-can-apply / category /
      state, search), scheme detail pages, and Cooperative Law · PACS · Money Basics ·
      PMFBY-FAQ as browsable topics (Simple / Detailed views, rural examples, official
      links); every item also grounds the assistant.
- [x] **M6 — Grievance workflow:** submit (category, voice-dictated description,
      file attachments with magic-byte validation) → `GRV-XXXXXXXX` tracking ID →
      status timeline; anonymous tracking shows status only, owner/admin see full
      detail; admin status transitions with notes.
- [ ] M7 — Admin dashboard
- [ ] M8 — PWA/offline, mobile, security & accessibility audits

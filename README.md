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
npm run db:up            # starts Postgres in Docker
npm run db:migrate       # applies Prisma migrations
npm run db:seed          # creates the admin account

# 4. run
npm run dev              # web on :5173, api on :4000
```

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
- [ ] M2 — Auth & roles
- [ ] M3 — Knowledge base + RAG chatbot
- [ ] M4 — Multilingual processing + voice
- [ ] M5 — Scheme explorer, cooperative law, PACS, PMFBY, financial literacy
- [ ] M6 — Grievance workflow
- [ ] M7 — Admin dashboard
- [ ] M8 — PWA/offline, mobile, security & accessibility audits

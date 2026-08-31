# Deploying Sahakar Sathi

One Docker image runs everything: the Express API and the built React SPA are
served from a single origin (`/` = app, `/api/v1/*` = API). You bring a
PostgreSQL database with the `pgvector` extension — [Neon](https://neon.tech)
has a free tier and works well.

The image bakes in the ~120 MB local embedding model, so cold starts are fast
and retrieval works even with no outbound network.

---

## 1. Database (Neon)

1. Create a Neon project (region close to your app).
2. From the dashboard copy **two** connection strings:
   - **Pooled** (host ends in `-pooler`) → `DATABASE_URL`
   - **Direct / unpooled** → `DIRECT_URL`
3. Enable pgvector once: in the Neon SQL editor run
   `CREATE EXTENSION IF NOT EXISTS vector;`

Migrations run automatically on every deploy (`prisma migrate deploy` in the
container entrypoint). You seed the content once — see step 4.

---

## 2. Secrets you will need

| Variable | What |
|---|---|
| `DATABASE_URL` | Neon pooled URL |
| `DIRECT_URL` | Neon direct URL |
| `JWT_ACCESS_SECRET` | 32+ random chars — `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `JWT_REFRESH_SECRET` | another one, different |
| `SEED_ADMIN_EMAIL` | e.g. `admin@yourdomain.org` |
| `SEED_ADMIN_PASSWORD` | a strong password for the first admin login |
| `WEB_ORIGIN` | the public URL of the deployed service, e.g. `https://sahakar-sathi.onrender.com` |
| `ANTHROPIC_API_KEY` | *(optional)* real plain-language answers; without it a grounded mock adapter is used |
| `WEB_SEARCH_API_KEY` | *(optional)* [Tavily](https://tavily.com) key for the live "latest / current" web-search route; Wikipedia works without it |
| `VOYAGE_API_KEY` | *(optional)* set with `EMBEDDINGS_PROVIDER=voyage` to skip the local model (lower memory) |

`NODE_ENV=production` and `SERVE_WEB_DIR` are already set inside the image.

---

## 3. Deploy — Render (blueprint, mostly clicking)

1. Push this repo to GitHub.
2. [Render dashboard](https://dashboard.render.com) → **New → Blueprint** → select
   the repo. Render reads [`render.yaml`](./render.yaml).
3. Fill in every value marked "you provide" (the table above). `JWT_*` are
   generated for you.
4. **Create resources.** The first build takes ~5–8 minutes (it downloads and
   bakes the embedding model).
5. When it is live, open the URL and check `…/api/v1/health/ready` shows
   `"status":"ready"`.

> The `free` plan is 512 MB RAM. If the service restarts with an out-of-memory
> error, either raise `plan` to `standard` in `render.yaml`, or set
> `EMBEDDINGS_PROVIDER=voyage` + `VOYAGE_API_KEY` and redeploy.

### Deploy — any other Docker host (Fly.io, Railway, a VM)

```bash
docker build -t sahakar-sathi .
docker run -p 4000:4000 \
  -e DATABASE_URL=... -e DIRECT_URL=... \
  -e JWT_ACCESS_SECRET=... -e JWT_REFRESH_SECRET=... \
  -e SEED_ADMIN_EMAIL=... -e SEED_ADMIN_PASSWORD=... \
  -e WEB_ORIGIN=https://your-domain \
  sahakar-sathi
```

Fly.io: `fly launch --dockerfile Dockerfile` then `fly secrets set KEY=value …`.
Platforms that inject `PORT` are handled automatically.

---

## 4. Seed the knowledge base (once, on a fresh database)

The assistant needs its verified content. Run these against the deployed
database — either from a one-off job on the platform, or locally with the
production `DATABASE_URL` exported:

```bash
npm --workspace apps/api run db:seed              # first admin account
npm --workspace apps/api run db:seed:knowledge    # base knowledge base
npm --workspace apps/api run db:seed:content      # schemes + explainer topics
npm --workspace apps/api run db:seed:content:i18n # Hindi + Tamil topic text
```

On Render: **Shell** tab of the service, or a **Job** with command
`node apps/api/scripts/start.mjs` replaced by the seed commands.

> If you deployed against the database this project was already developed on,
> it is **already migrated and seeded** — skip this step. Log in with the
> existing `admin@example.org` / your `SEED_ADMIN_PASSWORD`.

---

## 5. After deploy

- **Health:** `GET /api/v1/health/ready` → `database: ok`.
- **Admin:** sign in at `/signin`, then `/admin`.
- **LLM status:** `health/ready` shows `"llm":"anthropic"` once `ANTHROPIC_API_KEY`
  is set, `"mock"` otherwise.
- **Updating:** push to the default branch — Render auto-deploys. Migrations
  apply automatically; seeds do not re-run.

## Security notes

- Cookies are `Secure` + `HttpOnly` in production; the refresh cookie is
  path-scoped to `/api/v1/auth`.
- HSTS is sent in production. Serve only over HTTPS (Render/Fly do this).
- The Content-Security-Policy is locked to the app's own origin.
- Set `WEB_ORIGIN` exactly to your public URL so cross-origin browser requests
  are rejected.
- See [`SECURITY.md`](./SECURITY.md) for the full control list.

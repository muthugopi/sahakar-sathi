# Sahakar Sathi — single-container image.
# The API process serves the built SPA and the /api/v1 endpoints on one origin.
# Portable: runs on Render, Fly.io, Railway, or any Docker host. Needs Postgres
# with pgvector (e.g. Neon) reachable via DATABASE_URL.

# ---------- build ----------------------------------------------------------
FROM node:22-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 build-essential openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Install deps against the workspace manifests first for better layer caching.
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm ci

COPY . .

# Generate the Prisma client first — `npm ci` ran before `COPY . .` above (no
# schema.prisma yet), so its postinstall `prisma generate` produced only a stub
# client. Regenerate for real now that the schema is present, THEN typecheck/
# build shared → api → web (tsc fails against the stub client otherwise), and
# bake the ~120 MB embedding model so cold starts are fast and offline-safe.
RUN npm run db:generate --workspace apps/api \
 && npm run build \
 && node apps/api/scripts/warm-model.mjs

# ---------- runtime -------------------------------------------------------
FROM node:22-slim AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
      openssl ca-certificates libgomp1 wget \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production \
    API_PORT=4000 \
    SERVE_WEB_DIR=/app/apps/web/dist

# Bring the fully-built workspace (incl. native modules and the model cache).
COPY --from=build /app /app

RUN groupadd --system app && useradd --system --gid app --home /app app \
 && chown -R app:app /app
USER app

EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
  CMD wget -qO- "http://localhost:${API_PORT}/api/v1/health/live" >/dev/null 2>&1 || exit 1

CMD ["node", "apps/api/scripts/start.mjs"]

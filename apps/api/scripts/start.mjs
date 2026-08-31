/**
 * Production entrypoint: apply pending migrations, then start the server.
 * Expects to be run from the repo root (see Dockerfile CMD).
 */
import { spawnSync } from 'node:child_process';

// Prisma's schema references DIRECT_URL for migrations. Neon gives both a pooled
// and an unpooled URL; if only one was provided, reuse it.
process.env.DIRECT_URL ||= process.env.DATABASE_URL;

console.log('▶ prisma migrate deploy');
const migrate = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['prisma', 'migrate', 'deploy'],
  { stdio: 'inherit', cwd: 'apps/api', env: process.env },
);
if (migrate.status !== 0) {
  console.error('Migration failed — refusing to start with a stale schema.');
  process.exit(migrate.status ?? 1);
}

console.log('▶ starting Sahakar Sathi');
await import('../dist/server.js');

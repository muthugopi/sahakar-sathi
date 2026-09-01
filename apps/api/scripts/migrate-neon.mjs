#!/usr/bin/env node
/**
 * Apply pending Prisma migrations over the Neon serverless WebSocket driver
 * (wss://, port 443) instead of a raw TCP :5432 connection.
 *
 * `prisma migrate deploy` shells out to Prisma's Rust schema engine, which
 * always opens a direct TCP socket — there's no way to route it through a JS
 * driver adapter. On a network that blocks outbound 5432 (common on locked-down
 * corporate/school networks — Neon's endpoints included) that engine can never
 * reach the database, even though the app itself can via @prisma/adapter-neon.
 *
 * This script applies each pending migration's SQL directly through the same
 * WebSocket driver the app uses, and records it in `_prisma_migrations` with
 * the same bookkeeping (id/checksum/timestamps) Prisma itself writes — so a
 * later `prisma migrate status` / `migrate deploy` from an unrestricted network
 * sees these migrations as already applied and does nothing.
 *
 *   node scripts/migrate-neon.mjs
 */
import 'dotenv/config';
import { createHash, randomUUID } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { neonConfig, Pool } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, '..', 'prisma', 'migrations');

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL (or DIRECT_URL) is not set.');
  process.exit(1);
}

const pool = new Pool({ connectionString });

function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      "id" VARCHAR(36) NOT NULL,
      "checksum" VARCHAR(64) NOT NULL,
      "finished_at" TIMESTAMPTZ,
      "migration_name" VARCHAR(255) NOT NULL,
      "logs" TEXT,
      "rolled_back_at" TIMESTAMPTZ,
      "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
      CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
    );
  `);
}

async function appliedMigrationNames() {
  const res = await pool.query(
    `SELECT migration_name FROM "_prisma_migrations" WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL`,
  );
  return new Set(res.rows.map((r) => r.migration_name));
}

async function applyMigration(name, sql) {
  const checksum = sha256(sql);
  const id = randomUUID();
  console.log(`  applying ${name} …`);
  await pool.query('BEGIN');
  try {
    await pool.query(sql);
    await pool.query(
      `INSERT INTO "_prisma_migrations"
         (id, checksum, finished_at, migration_name, started_at, applied_steps_count)
       VALUES ($1, $2, now(), $3, now(), 1)`,
      [id, checksum, name],
    );
    await pool.query('COMMIT');
    console.log(`  ✓ ${name}`);
  } catch (err) {
    await pool.query('ROLLBACK');
    throw err;
  }
}

async function main() {
  const entries = readdirSync(migrationsDir)
    .filter((f) => statSync(join(migrationsDir, f)).isDirectory())
    .sort();

  await ensureMigrationsTable();
  const applied = await appliedMigrationNames();

  const pending = entries.filter((name) => !applied.has(name));
  if (pending.length === 0) {
    console.log('No pending migrations — database is up to date.');
    return;
  }

  console.log(`Applying ${pending.length} pending migration(s) via Neon WebSocket driver…`);
  for (const name of pending) {
    const sql = readFileSync(join(migrationsDir, name, 'migration.sql'), 'utf8');
    await applyMigration(name, sql);
  }
  console.log('Done.');
}

main()
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());

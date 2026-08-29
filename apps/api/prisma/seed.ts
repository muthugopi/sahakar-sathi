/**
 * Idempotent seed. Creates the initial ADMIN account from env vars.
 * Content seeds (schemes, knowledge docs, financial-literacy lessons) are added
 * in later milestones under prisma/seeds/.
 */
import 'dotenv/config';
import argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn('⚠  SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set — skipping admin seed.');
    return;
  }
  if (password.length < 8) {
    throw new Error('SEED_ADMIN_PASSWORD must be at least 8 characters.');
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`✓ Admin ${email} already exists — nothing to do.`);
    return;
  }

  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
  await prisma.user.create({
    data: {
      name: 'Platform Administrator',
      email,
      passwordHash,
      role: 'ADMIN',
      preferredLanguage: 'en',
    },
  });
  console.log(`✓ Created admin account: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

/**
 * Write Hindi + Tamil translations onto the highest-value explainer topics.
 * Idempotent — sets ContentTopic.translations for each listed slug. Run after
 * db:seed:content (the base English rows must already exist).
 *
 *   npm run db:seed:content:i18n   (from apps/api)
 *
 * The knowledge base stays English-only on purpose: the assistant grounds on the
 * English source and answers in the user's language. These translations only
 * cover the browsable reference pages.
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { TOPIC_TRANSLATIONS } from './content.i18n.data.js';

const prisma = new PrismaClient();

async function main() {
  const slugs = Object.keys(TOPIC_TRANSLATIONS);
  console.log(`Applying hi + ta translations to ${slugs.length} topics`);

  let applied = 0;
  let missing = 0;
  for (const slug of slugs) {
    const row = await prisma.contentTopic.findUnique({ where: { slug }, select: { id: true } });
    if (!row) {
      console.warn(`  ! ${slug} — no base topic, skipped (run db:seed:content first)`);
      missing += 1;
      continue;
    }
    await prisma.contentTopic.update({
      where: { slug },
      data: { translations: TOPIC_TRANSLATIONS[slug] },
    });
    console.log(`  ✓ ${slug}`);
    applied += 1;
  }

  console.log(`Done. ${applied} applied${missing ? `, ${missing} missing` : ''}.`);
  if (missing) process.exitCode = 1;
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit();
  });

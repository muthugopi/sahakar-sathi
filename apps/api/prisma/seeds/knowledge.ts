/**
 * Ingest the seed knowledge base. Idempotent — re-running replaces chunks and
 * bumps each document's version.
 *
 *   npm run db:seed:knowledge   (from apps/api)
 */
import 'dotenv/config';
import { ingestDocument } from '../../src/services/knowledge.service.js';
import { SEED_DOCS } from './knowledge.data.js';

const VERIFIED_AT = new Date('2026-08-29T00:00:00Z');

async function main() {
  console.log(`Ingesting ${SEED_DOCS.length} knowledge documents…`);
  for (const doc of SEED_DOCS) {
    const { chunks } = await ingestDocument({
      title: doc.title,
      category: doc.category,
      authority: doc.authority,
      sourceUrl: doc.sourceUrl,
      language: doc.language,
      text: doc.text,
      verified: true,
      verifiedAt: VERIFIED_AT,
    });
    console.log(`  ✓ ${doc.title} (${chunks} chunks)`);
  }
  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => process.exit());

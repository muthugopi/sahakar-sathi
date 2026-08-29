/**
 * Seed browsable content: schemes + explainer topics. Idempotent (upsert by
 * slug). Also feeds each item into the knowledge base so the assistant grounds
 * on exactly the same verified material.
 *
 *   npm run db:seed:content   (from apps/api)
 */
import 'dotenv/config';
import { PrismaClient, type KnowledgeCategory } from '@prisma/client';
import { ingestDocument } from '../../src/services/knowledge.service.js';
import { SEED_SCHEMES } from './schemes.data.js';
import { SEED_TOPICS } from './content.data.js';
import type { ContentSectionCode } from '@sahakar/shared';

const prisma = new PrismaClient();
const VERIFIED_AT = new Date('2026-08-29T00:00:00Z');

const SECTION_TO_KB: Record<ContentSectionCode, KnowledgeCategory> = {
  COOPERATIVE_LAW: 'COOPERATIVE_LAW',
  PACS: 'PACS_SERVICE',
  FINANCIAL_LITERACY: 'FINANCIAL_LITERACY',
  PMFBY: 'PMFBY_AGRICULTURE',
};

async function seedSchemes() {
  console.log(`Schemes: ${SEED_SCHEMES.length}`);
  for (const s of SEED_SCHEMES) {
    await prisma.scheme.upsert({
      where: { slug: s.slug },
      update: {
        title: s.title,
        category: s.category,
        summary: s.summary,
        purpose: s.purpose,
        targetUsers: s.targetUsers,
        eligibility: s.eligibility,
        benefits: s.benefits,
        requiredDocuments: s.requiredDocuments,
        applicationProcess: s.applicationProcess,
        officialSource: s.officialSource,
        officialUrl: s.officialUrl,
        state: s.state,
        isVerified: true,
        verifiedAt: VERIFIED_AT,
        isArchived: false,
      },
      create: {
        slug: s.slug,
        title: s.title,
        category: s.category,
        summary: s.summary,
        purpose: s.purpose,
        targetUsers: s.targetUsers,
        eligibility: s.eligibility,
        benefits: s.benefits,
        requiredDocuments: s.requiredDocuments,
        applicationProcess: s.applicationProcess,
        officialSource: s.officialSource,
        officialUrl: s.officialUrl,
        state: s.state,
        isVerified: true,
        verifiedAt: VERIFIED_AT,
      },
    });

    const text = [
      s.title,
      s.summary,
      `Purpose: ${s.purpose}`,
      `Who can apply: ${s.targetUsers.join(', ')}`,
      `Eligibility: ${s.eligibility}`,
      `Benefits: ${s.benefits}`,
      `Documents needed: ${s.requiredDocuments.join('; ')}`,
      `How to apply: ${s.applicationProcess}`,
    ].join('\n\n');

    await ingestDocument({
      title: s.title,
      category: s.category,
      authority: s.officialSource,
      sourceUrl: s.officialUrl,
      text,
      verified: true,
      verifiedAt: VERIFIED_AT,
    });
    console.log(`  ✓ ${s.title}`);
  }
}

async function seedTopics() {
  console.log(`Content topics: ${SEED_TOPICS.length}`);
  for (const topicData of SEED_TOPICS) {
    await prisma.contentTopic.upsert({
      where: { slug: topicData.slug },
      update: {
        section: topicData.section,
        topic: topicData.topic,
        title: topicData.title,
        summary: topicData.summary,
        simpleExplanation: topicData.simpleExplanation,
        detailedExplanation: topicData.detailedExplanation ?? null,
        example: topicData.example ?? null,
        authority: topicData.authority,
        sourceUrl: topicData.sourceUrl ?? null,
        order: topicData.order,
        isPublished: true,
        verifiedAt: VERIFIED_AT,
      },
      create: {
        section: topicData.section,
        slug: topicData.slug,
        topic: topicData.topic,
        title: topicData.title,
        summary: topicData.summary,
        simpleExplanation: topicData.simpleExplanation,
        detailedExplanation: topicData.detailedExplanation ?? null,
        example: topicData.example ?? null,
        authority: topicData.authority,
        sourceUrl: topicData.sourceUrl ?? null,
        order: topicData.order,
        verifiedAt: VERIFIED_AT,
      },
    });

    const text = [
      topicData.title,
      topicData.summary,
      topicData.simpleExplanation,
      topicData.detailedExplanation ?? '',
      topicData.example ? `Example: ${topicData.example}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    await ingestDocument({
      title: topicData.title,
      category: SECTION_TO_KB[topicData.section],
      authority: topicData.authority,
      sourceUrl: topicData.sourceUrl ?? null,
      text,
      verified: true,
      verifiedAt: VERIFIED_AT,
    });
    console.log(`  ✓ ${topicData.title}`);
  }
}

async function main() {
  await seedSchemes();
  await seedTopics();
  console.log('Done.');
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

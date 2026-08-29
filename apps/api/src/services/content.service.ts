import type { ContentSectionCode, ContentTopic } from '@sahakar/shared';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

function toDto(r: {
  section: string;
  slug: string;
  topic: string;
  title: string;
  summary: string;
  simpleExplanation: string;
  detailedExplanation: string | null;
  example: string | null;
  authority: string;
  sourceUrl: string | null;
  language: string;
  order: number;
  verifiedAt: Date | null;
}): ContentTopic {
  return {
    section: r.section as ContentSectionCode,
    slug: r.slug,
    topic: r.topic,
    title: r.title,
    summary: r.summary,
    simpleExplanation: r.simpleExplanation,
    detailedExplanation: r.detailedExplanation,
    example: r.example,
    authority: r.authority,
    sourceUrl: r.sourceUrl,
    language: r.language as ContentTopic['language'],
    order: r.order,
    verifiedAt: r.verifiedAt ? r.verifiedAt.toISOString() : null,
  };
}

export async function listBySection(section: ContentSectionCode): Promise<ContentTopic[]> {
  const rows = await prisma.contentTopic.findMany({
    where: { section, isPublished: true },
    orderBy: [{ order: 'asc' }, { title: 'asc' }],
  });
  return rows.map(toDto);
}

export async function getTopic(slug: string): Promise<ContentTopic> {
  const row = await prisma.contentTopic.findFirst({ where: { slug, isPublished: true } });
  if (!row) throw AppError.notFound('Topic not found.');
  return toDto(row);
}

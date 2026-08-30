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

export interface UpdateItem {
  date: string;
  title: string;
  category: string;
  href: string;
}

/** Most recently verified public information — for the homepage "Recently updated" list. */
export async function recentUpdates(limit = 6): Promise<UpdateItem[]> {
  const [schemes, topics] = await Promise.all([
    prisma.scheme.findMany({
      where: { isVerified: true, isArchived: false, verifiedAt: { not: null } },
      orderBy: { verifiedAt: 'desc' },
      take: limit,
      select: { slug: true, title: true, category: true, verifiedAt: true },
    }),
    prisma.contentTopic.findMany({
      where: { isPublished: true, verifiedAt: { not: null } },
      orderBy: { verifiedAt: 'desc' },
      take: limit,
      select: { slug: true, title: true, section: true, verifiedAt: true },
    }),
  ]);

  const items: UpdateItem[] = [
    ...schemes.map((s) => ({
      date: s.verifiedAt!.toISOString(),
      title: s.title,
      category: s.category.replace(/_/g, ' ').toLowerCase(),
      href: `/schemes/${s.slug}`,
    })),
    ...topics.map((tpc) => ({
      date: tpc.verifiedAt!.toISOString(),
      title: tpc.title,
      category: tpc.section.replace(/_/g, ' ').toLowerCase(),
      href: `/${sectionPath(tpc.section)}`,
    })),
  ];

  return items.sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

function sectionPath(section: string): string {
  return (
    { COOPERATIVE_LAW: 'cooperative', PACS: 'pacs', FINANCIAL_LITERACY: 'money', PMFBY: 'pmfby' }[
      section
    ] ?? 'knowledge'
  );
}

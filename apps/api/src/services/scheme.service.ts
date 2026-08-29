import { Prisma } from '@prisma/client';
import type { SchemeDetail, SchemeQuery, SchemeSummary } from '@sahakar/shared';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

export async function listSchemes(query: SchemeQuery): Promise<SchemeSummary[]> {
  const where: Prisma.SchemeWhereInput = { isArchived: false, isVerified: true };
  if (query.category) where.category = query.category;
  if (query.state) {
    // Match the given state OR national schemes (state = null).
    where.OR = [{ state: query.state }, { state: null }];
  }
  if (query.targetUser) where.targetUsers = { has: query.targetUser };
  if (query.q) {
    where.AND = [
      {
        OR: [
          { title: { contains: query.q, mode: 'insensitive' } },
          { summary: { contains: query.q, mode: 'insensitive' } },
          { purpose: { contains: query.q, mode: 'insensitive' } },
        ],
      },
    ];
  }

  const rows = await prisma.scheme.findMany({
    where,
    orderBy: { title: 'asc' },
    select: {
      slug: true,
      title: true,
      summary: true,
      category: true,
      targetUsers: true,
      state: true,
      verifiedAt: true,
    },
  });

  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    category: r.category,
    targetUsers: r.targetUsers,
    state: r.state,
    verifiedAt: r.verifiedAt ? r.verifiedAt.toISOString() : null,
  }));
}

export async function getScheme(slug: string): Promise<SchemeDetail> {
  const s = await prisma.scheme.findFirst({
    where: { slug, isArchived: false },
  });
  if (!s || !s.isVerified) throw AppError.notFound('Scheme not found.');

  return {
    slug: s.slug,
    title: s.title,
    summary: s.summary,
    category: s.category,
    targetUsers: s.targetUsers,
    state: s.state,
    verifiedAt: s.verifiedAt ? s.verifiedAt.toISOString() : null,
    purpose: s.purpose,
    eligibility: s.eligibility,
    benefits: s.benefits,
    requiredDocuments: s.requiredDocuments,
    applicationProcess: s.applicationProcess,
    officialSource: s.officialSource,
    officialUrl: s.officialUrl,
    language: s.language,
  };
}

/** Distinct filter values for the explorer UI. */
export async function schemeFacets() {
  const rows = await prisma.scheme.findMany({
    where: { isArchived: false, isVerified: true },
    select: { category: true, state: true, targetUsers: true },
  });
  const categories = [...new Set(rows.map((r) => r.category))].sort();
  const states = [...new Set(rows.map((r) => r.state).filter((s): s is string => Boolean(s)))].sort();
  const targetUsers = [...new Set(rows.flatMap((r) => r.targetUsers))].sort();
  return { categories, states, targetUsers };
}

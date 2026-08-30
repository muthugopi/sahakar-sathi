import type { KnowledgeCategory, LanguageCode, SchemeAdmin, SchemeInput } from '@sahakar/shared';
import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { ingestDocument } from '../knowledge.service.js';

function toDto(s: {
  slug: string;
  title: string;
  summary: string;
  category: string;
  targetUsers: string[];
  state: string | null;
  verifiedAt: Date | null;
  purpose: string;
  eligibility: string;
  benefits: string;
  requiredDocuments: string[];
  applicationProcess: string;
  officialSource: string;
  officialUrl: string | null;
  language: string;
  isVerified: boolean;
  isArchived: boolean;
  updatedAt: Date;
}): SchemeAdmin {
  return {
    slug: s.slug,
    title: s.title,
    summary: s.summary,
    category: s.category as KnowledgeCategory,
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
    language: s.language as LanguageCode,
    isVerified: s.isVerified,
    isArchived: s.isArchived,
    updatedAt: s.updatedAt.toISOString(),
  };
}

export async function listSchemesAdmin(): Promise<SchemeAdmin[]> {
  const rows = await prisma.scheme.findMany({ orderBy: { updatedAt: 'desc' } });
  return rows.map(toDto);
}

export async function getSchemeAdmin(slug: string): Promise<SchemeAdmin> {
  const s = await prisma.scheme.findUnique({ where: { slug } });
  if (!s) throw AppError.notFound('Scheme not found.');
  return toDto(s);
}

function schemeToText(s: SchemeInput): string {
  return [
    s.title,
    s.summary,
    `Purpose: ${s.purpose}`,
    `Who can apply: ${s.targetUsers.join(', ')}`,
    `Eligibility: ${s.eligibility}`,
    `Benefits: ${s.benefits}`,
    `Documents needed: ${s.requiredDocuments.join('; ')}`,
    `How to apply: ${s.applicationProcess}`,
  ].join('\n\n');
}

async function reindex(slug: string, input: SchemeInput, verified: boolean) {
  if (!verified) return;
  await ingestDocument({
    title: input.title,
    category: input.category,
    authority: input.officialSource,
    sourceUrl: input.officialUrl || null,
    text: schemeToText(input),
    verified: true,
  });
}

export async function createScheme(input: SchemeInput): Promise<SchemeAdmin> {
  const clash = await prisma.scheme.findUnique({ where: { slug: input.slug } });
  if (clash) throw AppError.conflict('A scheme with that slug already exists.');

  const s = await prisma.scheme.create({
    data: {
      slug: input.slug,
      title: input.title,
      category: input.category,
      summary: input.summary,
      purpose: input.purpose,
      targetUsers: input.targetUsers,
      eligibility: input.eligibility,
      benefits: input.benefits,
      requiredDocuments: input.requiredDocuments,
      applicationProcess: input.applicationProcess,
      officialSource: input.officialSource,
      officialUrl: input.officialUrl || null,
      state: input.state ?? null,
      isVerified: false,
    },
  });
  return toDto(s);
}

export async function updateScheme(slug: string, input: SchemeInput): Promise<SchemeAdmin> {
  const existing = await prisma.scheme.findUnique({ where: { slug } });
  if (!existing) throw AppError.notFound('Scheme not found.');

  const s = await prisma.scheme.update({
    where: { slug },
    data: {
      title: input.title,
      category: input.category,
      summary: input.summary,
      purpose: input.purpose,
      targetUsers: input.targetUsers,
      eligibility: input.eligibility,
      benefits: input.benefits,
      requiredDocuments: input.requiredDocuments,
      applicationProcess: input.applicationProcess,
      officialSource: input.officialSource,
      officialUrl: input.officialUrl || null,
      state: input.state ?? null,
    },
  });
  await reindex(slug, input, s.isVerified);
  return toDto(s);
}

export async function verifyScheme(slug: string, verified: boolean): Promise<SchemeAdmin> {
  const existing = await prisma.scheme.findUnique({ where: { slug } });
  if (!existing) throw AppError.notFound('Scheme not found.');

  const s = await prisma.scheme.update({
    where: { slug },
    data: { isVerified: verified, verifiedAt: verified ? new Date() : null },
  });
  if (verified) {
    await reindex(
      slug,
      {
        slug: existing.slug,
        title: existing.title,
        category: existing.category as SchemeInput['category'],
        summary: existing.summary,
        purpose: existing.purpose,
        targetUsers: existing.targetUsers,
        eligibility: existing.eligibility,
        benefits: existing.benefits,
        requiredDocuments: existing.requiredDocuments,
        applicationProcess: existing.applicationProcess,
        officialSource: existing.officialSource,
        officialUrl: existing.officialUrl ?? '',
        state: existing.state,
      },
      true,
    );
  }
  return toDto(s);
}

export async function archiveScheme(slug: string, archived: boolean): Promise<SchemeAdmin> {
  const existing = await prisma.scheme.findUnique({ where: { slug } });
  if (!existing) throw AppError.notFound('Scheme not found.');
  const s = await prisma.scheme.update({ where: { slug }, data: { isArchived: archived } });
  return toDto(s);
}

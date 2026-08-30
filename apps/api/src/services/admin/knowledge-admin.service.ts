import type {
  AdminDocument,
  CreateDocumentInput,
  KnowledgeCategory,
  LanguageCode,
  UpdateDocumentInput,
} from '@sahakar/shared';
import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { ingestDocument } from '../knowledge.service.js';

function toDto(d: {
  id: string;
  title: string;
  category: string;
  authority: string;
  sourceUrl: string | null;
  language: string;
  version: number;
  isVerified: boolean;
  isPublished: boolean;
  verifiedAt: Date | null;
  updatedAt: Date;
  _count: { chunks: number };
}): AdminDocument {
  return {
    id: d.id,
    title: d.title,
    category: d.category as KnowledgeCategory,
    authority: d.authority,
    sourceUrl: d.sourceUrl,
    language: d.language as LanguageCode,
    version: d.version,
    isVerified: d.isVerified,
    isPublished: d.isPublished,
    verifiedAt: d.verifiedAt ? d.verifiedAt.toISOString() : null,
    chunkCount: d._count.chunks,
    updatedAt: d.updatedAt.toISOString(),
  };
}

export async function listDocuments(filters: {
  category?: KnowledgeCategory;
  verified?: boolean;
  q?: string;
}): Promise<AdminDocument[]> {
  const rows = await prisma.knowledgeDocument.findMany({
    where: {
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.verified !== undefined ? { isVerified: filters.verified } : {}),
      ...(filters.q ? { title: { contains: filters.q, mode: 'insensitive' } } : {}),
    },
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { chunks: true } } },
  });
  return rows.map(toDto);
}

export async function getDocument(id: string): Promise<AdminDocument> {
  const d = await prisma.knowledgeDocument.findUnique({
    where: { id },
    include: {
      _count: { select: { chunks: true } },
      chunks: { orderBy: { chunkIndex: 'asc' }, select: { content: true } },
    },
  });
  if (!d) throw AppError.notFound('Document not found.');
  return { ...toDto(d), textPreview: d.chunks.map((c) => c.content).join('\n\n') };
}

/** Reconstruct the source text from stored chunks (for the edit form). */
async function documentText(id: string): Promise<string> {
  const chunks = await prisma.documentChunk.findMany({
    where: { documentId: id },
    orderBy: { chunkIndex: 'asc' },
    select: { content: true },
  });
  return chunks.map((c) => c.content).join('\n\n');
}

export async function createDocument(
  input: CreateDocumentInput & { text: string },
  uploadedById: string,
): Promise<AdminDocument> {
  const { documentId } = await ingestDocument({
    title: input.title,
    category: input.category,
    authority: input.authority,
    sourceUrl: input.sourceUrl || null,
    language: input.language,
    text: input.text,
    verified: input.publish,
    uploadedById,
  });
  return getDocument(documentId);
}

export async function updateDocument(
  id: string,
  input: UpdateDocumentInput,
): Promise<AdminDocument> {
  const existing = await prisma.knowledgeDocument.findUnique({ where: { id } });
  if (!existing) throw AppError.notFound('Document not found.');

  const textChanged = input.text !== undefined;
  const metaOnly = !textChanged;

  if (metaOnly) {
    await prisma.knowledgeDocument.update({
      where: { id },
      data: {
        ...(input.title ? { title: input.title } : {}),
        ...(input.category ? { category: input.category } : {}),
        ...(input.authority ? { authority: input.authority } : {}),
        ...(input.sourceUrl !== undefined ? { sourceUrl: input.sourceUrl || null } : {}),
        ...(input.language ? { language: input.language } : {}),
        ...(input.isPublished !== undefined ? { isPublished: input.isPublished } : {}),
      },
    });
    return getDocument(id);
  }

  // Text changed → re-chunk + re-embed against the same document id.
  await ingestDocument({
    existingId: id,
    title: input.title ?? existing.title,
    category: (input.category ?? existing.category) as KnowledgeCategory,
    authority: input.authority ?? existing.authority,
    sourceUrl: input.sourceUrl !== undefined ? input.sourceUrl || null : existing.sourceUrl,
    language: (input.language ?? existing.language) as LanguageCode,
    text: input.text!,
    verified: input.isPublished ?? existing.isPublished,
  });
  return getDocument(id);
}

export async function verifyDocument(id: string, verified: boolean): Promise<AdminDocument> {
  const existing = await prisma.knowledgeDocument.findUnique({ where: { id } });
  if (!existing) throw AppError.notFound('Document not found.');
  await prisma.knowledgeDocument.update({
    where: { id },
    data: {
      isVerified: verified,
      verifiedAt: verified ? new Date() : null,
      isPublished: verified ? true : existing.isPublished,
    },
  });
  return getDocument(id);
}

export async function deleteDocument(id: string): Promise<void> {
  const existing = await prisma.knowledgeDocument.findUnique({ where: { id } });
  if (!existing) throw AppError.notFound('Document not found.');
  await prisma.knowledgeDocument.delete({ where: { id } }); // chunks cascade
}

export { documentText };

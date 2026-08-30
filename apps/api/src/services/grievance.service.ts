import { customAlphabet } from 'nanoid';
import type {
  CreateGrievanceInput,
  GrievanceDetail,
  GrievanceListItem,
  GrievancePublic,
  GrievanceStatus,
  UpdateGrievanceStatusInput,
} from '@sahakar/shared';
import { GRIEVANCE_LIFECYCLE } from '@sahakar/shared';
import { prisma } from '../config/prisma.js';
import { logger } from '../config/logger.js';
import { AppError } from '../utils/AppError.js';
import { deleteStoredFile, storeUpload } from '../utils/upload.js';

// Crockford-ish alphabet: no 0/O, 1/I/L, U — readable when written by hand.
const trackingCode = customAlphabet('23456789ABCDEFGHJKMNPQRSTVWXYZ', 8);
const ATTACHMENT_MAX_AGE_MS = 24 * 60 * 60_000;

/* -------------------------------------------------------------------------- */
/*  Create                                                                     */
/* -------------------------------------------------------------------------- */

export async function createGrievance(
  input: CreateGrievanceInput,
  userId?: string,
): Promise<{ trackingId: string; status: GrievanceStatus }> {
  const attachmentIds = input.attachmentIds ?? [];

  // Only accept freshly-uploaded, still-unlinked attachments.
  if (attachmentIds.length > 0) {
    const valid = await prisma.attachment.count({
      where: {
        id: { in: attachmentIds },
        grievanceId: null,
        createdAt: { gte: new Date(Date.now() - ATTACHMENT_MAX_AGE_MS) },
      },
    });
    if (valid !== attachmentIds.length) {
      throw AppError.validation('One or more attachments are invalid or expired. Please re-upload.');
    }
  }

  const trackingId = await generateTrackingId();

  const grievance = await prisma.$transaction(async (tx) => {
    const g = await tx.grievance.create({
      data: {
        trackingId,
        userId: userId ?? null,
        category: input.category,
        description: input.description,
        language: input.language,
        district: input.district ?? null,
        state: input.state ?? null,
        contactPhone: input.contactPhone ?? null,
        status: 'SUBMITTED',
        events: {
          create: { status: 'SUBMITTED', note: null, actorId: userId ?? null },
        },
      },
    });
    if (attachmentIds.length > 0) {
      await tx.attachment.updateMany({
        where: { id: { in: attachmentIds }, grievanceId: null },
        data: { grievanceId: g.id },
      });
    }
    return g;
  });

  logger.info({ trackingId, category: input.category, hasUser: Boolean(userId) }, 'grievance created');
  return { trackingId: grievance.trackingId, status: grievance.status as GrievanceStatus };
}

/** Store an uploaded file and create an unlinked Attachment; linked on submit. */
export async function createAttachment(file: Express.Multer.File) {
  const stored = await storeUpload(file);
  const attachment = await prisma.attachment.create({
    data: {
      fileKey: stored.fileKey,
      originalName: stored.originalName,
      mimeType: stored.mimeType,
      sizeBytes: stored.sizeBytes,
    },
  });
  return {
    id: attachment.id,
    originalName: attachment.originalName,
    mimeType: attachment.mimeType,
    sizeBytes: attachment.sizeBytes,
  };
}

/* -------------------------------------------------------------------------- */
/*  Read                                                                       */
/* -------------------------------------------------------------------------- */

export async function getGrievance(
  trackingId: string,
  viewer: { userId?: string; isAdmin?: boolean },
): Promise<GrievancePublic | GrievanceDetail> {
  const g = await prisma.grievance.findUnique({
    where: { trackingId: trackingId.toUpperCase() },
    include: {
      events: { orderBy: { createdAt: 'asc' } },
      attachments: { orderBy: { createdAt: 'asc' } },
    },
  });
  if (!g) throw AppError.notFound('No grievance found with that tracking ID.');

  const timeline = g.events.map((e) => ({
    status: e.status as GrievanceStatus,
    note: e.note,
    createdAt: e.createdAt.toISOString(),
  }));

  const publicView: GrievancePublic = {
    trackingId: g.trackingId,
    category: g.category as GrievancePublic['category'],
    status: g.status as GrievanceStatus,
    createdAt: g.createdAt.toISOString(),
    updatedAt: g.updatedAt.toISOString(),
    timeline,
  };

  const isOwner = Boolean(viewer.userId && g.userId === viewer.userId);
  if (!isOwner && !viewer.isAdmin) return publicView;

  const detail: GrievanceDetail = {
    ...publicView,
    id: g.id,
    description: g.description,
    language: g.language as GrievanceDetail['language'],
    district: g.district,
    state: g.state,
    contactPhone: g.contactPhone,
    attachments: g.attachments.map((a) => ({
      id: a.id,
      originalName: a.originalName,
      mimeType: a.mimeType,
      sizeBytes: a.sizeBytes,
    })),
    isOwner,
  };
  return detail;
}

export async function listMine(userId: string): Promise<GrievanceListItem[]> {
  const rows = await prisma.grievance.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: { trackingId: true, category: true, status: true, createdAt: true, updatedAt: true },
  });
  return rows.map((r) => ({
    trackingId: r.trackingId,
    category: r.category as GrievanceListItem['category'],
    status: r.status as GrievanceStatus,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
}

export async function getAttachmentForViewer(
  attachmentId: string,
  viewer: { userId?: string; isAdmin?: boolean },
) {
  const a = await prisma.attachment.findUnique({
    where: { id: attachmentId },
    include: { grievance: { select: { userId: true } } },
  });
  if (!a || !a.grievance) throw AppError.notFound('File not found.');

  const isOwner = Boolean(viewer.userId && a.grievance.userId === viewer.userId);
  if (!isOwner && !viewer.isAdmin) throw AppError.forbidden();

  return { fileKey: a.fileKey, mimeType: a.mimeType, originalName: a.originalName };
}

/* -------------------------------------------------------------------------- */
/*  Status transitions (admin — routed in M6, dashboard in M7)                 */
/* -------------------------------------------------------------------------- */

function canTransition(from: GrievanceStatus, to: GrievanceStatus): boolean {
  if (from === to) return false;
  if (to === 'CLOSED') return true; // can always close
  if (from === 'CLOSED') return false; // reopen a closed one only via… not supported
  if (from === 'RESOLVED' && to === 'IN_PROGRESS') return true; // reopen
  const iFrom = GRIEVANCE_LIFECYCLE.indexOf(from);
  const iTo = GRIEVANCE_LIFECYCLE.indexOf(to);
  return iTo === iFrom + 1 || iTo === iFrom; // step forward one stage
}

export async function updateStatus(
  trackingId: string,
  input: UpdateGrievanceStatusInput,
  actorId: string,
): Promise<GrievancePublic> {
  const g = await prisma.grievance.findUnique({ where: { trackingId: trackingId.toUpperCase() } });
  if (!g) throw AppError.notFound('No grievance found with that tracking ID.');

  const from = g.status as GrievanceStatus;
  if (!canTransition(from, input.status)) {
    throw AppError.validation(`Cannot move a grievance from ${from} to ${input.status}.`);
  }

  await prisma.$transaction([
    prisma.grievance.update({
      where: { id: g.id },
      data: { status: input.status },
    }),
    prisma.grievanceEvent.create({
      data: {
        grievanceId: g.id,
        status: input.status,
        note: input.note ?? null,
        actorId,
      },
    }),
  ]);

  logger.info({ trackingId: g.trackingId, from, to: input.status, actorId }, 'grievance status updated');
  return (await getGrievance(g.trackingId, { isAdmin: true })) as GrievancePublic;
}

/* -------------------------------------------------------------------------- */
/*  Orphan attachment cleanup (call from a scheduled job)                      */
/* -------------------------------------------------------------------------- */

export async function pruneOrphanAttachments(): Promise<number> {
  const stale = await prisma.attachment.findMany({
    where: { grievanceId: null, createdAt: { lt: new Date(Date.now() - ATTACHMENT_MAX_AGE_MS) } },
  });
  for (const a of stale) await deleteStoredFile(a.fileKey);
  const { count } = await prisma.attachment.deleteMany({
    where: { id: { in: stale.map((a) => a.id) } },
  });
  return count;
}

async function generateTrackingId(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = `GRV-${trackingCode()}`;
    const clash = await prisma.grievance.findUnique({ where: { trackingId: candidate } });
    if (!clash) return candidate;
  }
  throw new AppError('INTERNAL', 'Could not allocate a tracking ID. Please try again.');
}

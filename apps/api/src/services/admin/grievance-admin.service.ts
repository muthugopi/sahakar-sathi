import type {
  AdminGrievanceListItem,
  AdminUpdateGrievanceInput,
  GrievanceCategory,
  GrievanceDetail,
  GrievanceStatus,
} from '@sahakar/shared';
import { GRIEVANCE_LIFECYCLE } from '@sahakar/shared';
import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { getGrievance } from '../grievance.service.js';

export async function listGrievancesAdmin(filters: {
  status?: GrievanceStatus;
  category?: GrievanceCategory;
  q?: string;
}): Promise<AdminGrievanceListItem[]> {
  const rows = await prisma.grievance.findMany({
    where: {
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.q
        ? {
            OR: [
              { trackingId: { contains: filters.q.toUpperCase() } },
              { description: { contains: filters.q, mode: 'insensitive' } },
              { district: { contains: filters.q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: 'desc' },
    include: { assignedTo: { select: { name: true, email: true } } },
  });

  return rows.map((r) => ({
    trackingId: r.trackingId,
    category: r.category as GrievanceCategory,
    status: r.status as GrievanceStatus,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    district: r.district,
    state: r.state,
    assignee: r.assignedTo?.name ?? r.assignedTo?.email ?? null,
  }));
}

export function getGrievanceAdmin(trackingId: string): Promise<GrievanceDetail> {
  return getGrievance(trackingId, { isAdmin: true }) as Promise<GrievanceDetail>;
}

/**
 * Admin update: optional status change (validated), optional assignee, optional
 * note. A note without a status change is recorded against the current status.
 */
export async function adminUpdateGrievance(
  trackingId: string,
  input: AdminUpdateGrievanceInput,
  actorId: string,
): Promise<GrievanceDetail> {
  const g = await prisma.grievance.findUnique({ where: { trackingId: trackingId.toUpperCase() } });
  if (!g) throw AppError.notFound('No grievance found with that tracking ID.');

  const from = g.status as GrievanceStatus;
  const to = input.status ?? from;

  if (input.status && !canTransition(from, input.status)) {
    throw AppError.validation(`Cannot move a grievance from ${from} to ${input.status}.`);
  }

  let assignedToId: string | null | undefined;
  if (input.assigneeEmail !== undefined) {
    if (input.assigneeEmail === null) {
      assignedToId = null;
    } else {
      const officer = await prisma.user.findUnique({ where: { email: input.assigneeEmail } });
      if (!officer || officer.role !== 'ADMIN') {
        throw AppError.validation('Assignee must be an existing admin account.');
      }
      assignedToId = officer.id;
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.grievance.update({
      where: { id: g.id },
      data: {
        ...(input.status ? { status: input.status } : {}),
        ...(assignedToId !== undefined ? { assignedToId } : {}),
      },
    });
    if (input.status || input.note) {
      await tx.grievanceEvent.create({
        data: { grievanceId: g.id, status: to, note: input.note ?? null, actorId },
      });
    }
  });

  return getGrievanceAdmin(g.trackingId);
}

function canTransition(from: GrievanceStatus, to: GrievanceStatus): boolean {
  if (from === to) return false;
  if (to === 'CLOSED') return true;
  if (from === 'CLOSED') return false;
  if (from === 'RESOLVED' && to === 'IN_PROGRESS') return true;
  const iFrom = GRIEVANCE_LIFECYCLE.indexOf(from);
  const iTo = GRIEVANCE_LIFECYCLE.indexOf(to);
  return iTo === iFrom + 1;
}

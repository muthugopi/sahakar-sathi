import type { AdminAnalytics } from '@sahakar/shared';
import { prisma } from '../../config/prisma.js';

const DAY = 24 * 60 * 60_000;

/** Turn a Prisma groupBy result into { value: count }. */
function tally(rows: unknown[], key: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const row of rows as Array<Record<string, unknown>>) {
    out[String(row[key])] = Number((row as { _count?: number })._count ?? 0);
  }
  return out;
}

export async function getAnalytics(): Promise<AdminAnalytics> {
  const since7d = new Date(Date.now() - 7 * DAY);

  const [
    usersTotal,
    usersByRole,
    usersRecent,
    convTotal,
    convRecent,
    msgTotal,
    msgByLang,
    grievanceByStatus,
    grievanceByCategory,
    kbTotal,
    kbPublished,
    kbUnverified,
    schemesTotal,
    schemesVerified,
    schemesArchived,
    fbUp,
    fbDown,
    recentUserMessages,
    downvotes,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.groupBy({ by: ['role'], _count: true }),
    prisma.user.count({ where: { createdAt: { gte: since7d } } }),
    prisma.conversation.count(),
    prisma.conversation.count({ where: { createdAt: { gte: since7d } } }),
    prisma.message.count(),
    prisma.message.groupBy({ by: ['language'], _count: true }),
    prisma.grievance.groupBy({ by: ['status'], _count: true }),
    prisma.grievance.groupBy({ by: ['category'], _count: true }),
    prisma.knowledgeDocument.count(),
    prisma.knowledgeDocument.count({ where: { isPublished: true } }),
    prisma.knowledgeDocument.count({ where: { isVerified: false } }),
    prisma.scheme.count(),
    prisma.scheme.count({ where: { isVerified: true } }),
    prisma.scheme.count({ where: { isArchived: true } }),
    prisma.feedback.count({ where: { rating: 'UP' } }),
    prisma.feedback.count({ where: { rating: 'DOWN' } }),
    prisma.message.findMany({
      where: { role: 'user' },
      orderBy: { createdAt: 'desc' },
      take: 500,
      select: { content: true },
    }),
    prisma.feedback.findMany({
      where: { rating: 'DOWN' },
      orderBy: { createdAt: 'desc' },
      take: 15,
      select: {
        comment: true,
        createdAt: true,
        message: { select: { id: true, content: true } },
      },
    }),
  ]);

  const byStatus = tally(grievanceByStatus, 'status');
  const openStatuses = ['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS'];
  const open = openStatuses.reduce((n, s) => n + (byStatus[s as keyof typeof byStatus] ?? 0), 0);

  // Group similar questions by a normalised key.
  const counts = new Map<string, { text: string; count: number }>();
  for (const m of recentUserMessages) {
    const norm = m.content.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim();
    if (norm.length < 6) continue;
    const entry = counts.get(norm);
    if (entry) entry.count++;
    else counts.set(norm, { text: m.content.trim().slice(0, 160), count: 1 });
  }
  const topQuestions = [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 12);

  return {
    users: {
      total: usersTotal,
      byRole: tally(usersByRole, 'role'),
      last7Days: usersRecent,
    },
    conversations: { total: convTotal, last7Days: convRecent },
    messages: { total: msgTotal, byLanguage: tally(msgByLang, 'language') },
    grievances: {
      total: Object.values(byStatus).reduce((a, b) => a + b, 0),
      open,
      byStatus,
      byCategory: tally(grievanceByCategory, 'category'),
    },
    knowledge: { total: kbTotal, published: kbPublished, unverified: kbUnverified },
    schemes: { total: schemesTotal, verified: schemesVerified, archived: schemesArchived },
    feedback: { up: fbUp, down: fbDown },
    topQuestions,
    recentDownvotes: downvotes.map((d) => ({
      messageId: d.message.id,
      content: d.message.content.slice(0, 240),
      comment: d.comment,
      createdAt: d.createdAt.toISOString(),
    })),
  };
}

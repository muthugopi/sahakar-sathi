import type { FeedbackInput } from '@sahakar/shared';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

export async function submitFeedback(input: FeedbackInput, userId?: string): Promise<void> {
  const message = await prisma.message.findUnique({
    where: { id: input.messageId },
    select: { id: true, role: true },
  });
  if (!message || message.role !== 'assistant') {
    throw AppError.notFound('That response could not be found.');
  }

  if (userId) {
    // One rating per user per message — update if they change their mind.
    await prisma.feedback.upsert({
      where: { userId_messageId: { userId, messageId: input.messageId } },
      update: { rating: input.rating, comment: input.comment ?? null },
      create: {
        messageId: input.messageId,
        userId,
        rating: input.rating,
        comment: input.comment ?? null,
      },
    });
    return;
  }

  await prisma.feedback.create({
    data: {
      messageId: input.messageId,
      rating: input.rating,
      comment: input.comment ?? null,
    },
  });
}

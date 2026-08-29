import { z } from 'zod';
import { chatRequestSchema, feedbackSchema } from '@sahakar/shared';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import * as chatService from '../services/chat.service.js';
import { submitFeedback } from '../services/feedback.service.js';

export const postChat = asyncHandler(async (req, res) => {
  const input = chatRequestSchema.parse(req.body);
  const result = await chatService.ask({
    message: input.message,
    conversationId: input.conversationId,
    language: input.language,
    category: input.category,
    userId: req.auth?.sub,
  });
  res.json(result);
});

const historyQuerySchema = z.object({ conversationId: z.string().min(1) });

export const getChatHistory = asyncHandler(async (req, res) => {
  const { conversationId } = historyQuerySchema.parse(req.query);
  const history = await chatService.getHistory(conversationId, req.auth?.sub);
  res.json(history);
});

export const getConversations = asyncHandler(async (req, res) => {
  if (!req.auth) throw AppError.unauthorized();
  res.json({ conversations: await chatService.listConversations(req.auth.sub) });
});

export const postFeedback = asyncHandler(async (req, res) => {
  const input = feedbackSchema.parse(req.body);
  await submitFeedback(input, req.auth?.sub);
  res.status(201).json({ ok: true });
});

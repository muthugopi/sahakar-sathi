import { Router } from 'express';
import { chatLimiter } from '../middleware/rateLimit.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import {
  getChatHistory,
  getConversations,
  postChat,
  postFeedback,
} from '../controllers/chat.controller.js';

export const chatRouter = Router();

// Anonymous use is allowed; a bearer token links the conversation to the account.
chatRouter.post('/', chatLimiter, optionalAuth, postChat);
chatRouter.get('/history', optionalAuth, getChatHistory);
chatRouter.get('/conversations', requireAuth, getConversations);

export const feedbackRouter = Router();
feedbackRouter.post('/', optionalAuth, postFeedback);

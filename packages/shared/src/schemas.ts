import { z } from 'zod';
import {
  API_ERROR_CODES,
  ANSWER_CONFIDENCE,
  GRIEVANCE_CATEGORIES,
  GRIEVANCE_STATUSES,
  KNOWLEDGE_CATEGORIES,
  LANGUAGE_CODES,
  SELF_ASSIGNABLE_ROLES,
  USER_ROLES,
} from './constants.js';

/* -------------------------------------------------------------------------- */
/*  Primitives                                                                 */
/* -------------------------------------------------------------------------- */

export const languageSchema = z.enum(LANGUAGE_CODES as [string, ...string[]]);
export const roleSchema = z.enum(USER_ROLES as unknown as [string, ...string[]]);

/** Accept e.164-ish phone OR email; at least one identifier is required. */
const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{7,14}$/, 'Enter a valid phone number');

/* -------------------------------------------------------------------------- */
/*  API error envelope                                                         */
/* -------------------------------------------------------------------------- */

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.enum(API_ERROR_CODES as unknown as [string, ...string[]]),
    message: z.string(),
    details: z.unknown().optional(),
    requestId: z.string().optional(),
  }),
});
export type ApiError = z.infer<typeof apiErrorSchema>;

/* -------------------------------------------------------------------------- */
/*  Auth                                                                       */
/* -------------------------------------------------------------------------- */

export const registerSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().toLowerCase().email().optional(),
    phone: phoneSchema.optional(),
    password: z
      .string()
      .min(8, 'Use at least 8 characters')
      .max(128)
      .regex(/[a-zA-Z]/, 'Include a letter')
      .regex(/\d/, 'Include a number'),
    preferredLanguage: languageSchema.default('en'),
    role: z.enum(SELF_ASSIGNABLE_ROLES as unknown as [string, ...string[]]).default('USER'),
    district: z.string().trim().max(120).optional(),
    state: z.string().trim().max(120).optional(),
  })
  .refine((v) => Boolean(v.email || v.phone), {
    message: 'Provide an email or a phone number',
    path: ['email'],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  identifier: z.string().trim().min(3).max(160), // email or phone
  password: z.string().min(1).max(128),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const publicUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  role: roleSchema,
  preferredLanguage: languageSchema,
  district: z.string().nullable(),
  state: z.string().nullable(),
  createdAt: z.string(),
});
export type PublicUser = z.infer<typeof publicUserSchema>;

export const authResponseSchema = z.object({
  user: publicUserSchema,
  accessToken: z.string(),
});
export type AuthResponse = z.infer<typeof authResponseSchema>;

/* -------------------------------------------------------------------------- */
/*  Chat / RAG                                                                 */
/* -------------------------------------------------------------------------- */

export const chatRequestSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().trim().min(1).max(2000),
  language: languageSchema.optional(), // if omitted, server detects
  category: z.enum(KNOWLEDGE_CATEGORIES as unknown as [string, ...string[]]).optional(),
});
export type ChatRequest = z.infer<typeof chatRequestSchema>;

export const sourceRefSchema = z.object({
  id: z.string(),
  title: z.string(),
  authority: z.string(),
  sourceUrl: z.string().url().nullable(),
  category: z.enum(KNOWLEDGE_CATEGORIES as unknown as [string, ...string[]]),
  verifiedAt: z.string().nullable(),
  snippet: z.string(),
});
export type SourceRef = z.infer<typeof sourceRefSchema>;

export const chatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  language: languageSchema,
  createdAt: z.string(),
  confidence: z.enum(ANSWER_CONFIDENCE as unknown as [string, ...string[]]).optional(),
  sources: z.array(sourceRefSchema).optional(),
  disclaimers: z.array(z.string()).optional(),
});
export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const chatResponseSchema = z.object({
  conversationId: z.string(),
  reply: chatMessageSchema,
});
export type ChatResponse = z.infer<typeof chatResponseSchema>;

/* -------------------------------------------------------------------------- */
/*  Grievances                                                                 */
/* -------------------------------------------------------------------------- */

export const grievanceCategorySchema = z.enum(
  GRIEVANCE_CATEGORIES as unknown as [string, ...string[]],
);
export const grievanceStatusSchema = z.enum(
  GRIEVANCE_STATUSES as unknown as [string, ...string[]],
);

export const createGrievanceSchema = z.object({
  category: grievanceCategorySchema,
  description: z.string().trim().min(20, 'Please describe the issue in a little more detail').max(5000),
  language: languageSchema.default('en'),
  district: z.string().trim().max(120).optional(),
  state: z.string().trim().max(120).optional(),
  contactPhone: phoneSchema.optional(),
  attachmentIds: z.array(z.string()).max(5).optional(),
});
export type CreateGrievanceInput = z.infer<typeof createGrievanceSchema>;

export const grievanceEventSchema = z.object({
  status: grievanceStatusSchema,
  note: z.string().nullable(),
  createdAt: z.string(),
});

export const grievanceSchema = z.object({
  id: z.string(),
  trackingId: z.string(),
  category: grievanceCategorySchema,
  description: z.string(),
  status: grievanceStatusSchema,
  language: languageSchema,
  district: z.string().nullable(),
  state: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  timeline: z.array(grievanceEventSchema),
});
export type Grievance = z.infer<typeof grievanceSchema>;

/* -------------------------------------------------------------------------- */
/*  Feedback                                                                   */
/* -------------------------------------------------------------------------- */

export const feedbackSchema = z.object({
  messageId: z.string(),
  rating: z.enum(['UP', 'DOWN']),
  comment: z.string().trim().max(1000).optional(),
});
export type FeedbackInput = z.infer<typeof feedbackSchema>;

/* -------------------------------------------------------------------------- */
/*  Pagination helper                                                          */
/* -------------------------------------------------------------------------- */

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

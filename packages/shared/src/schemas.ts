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
  type AnswerConfidence,
  type ApiErrorCode,
  type GrievanceCategory,
  type GrievanceStatus,
  type KnowledgeCategory,
  type LanguageCode,
  type UserRole,
} from './constants.js';

/** Build a Zod enum from a readonly string-literal list, preserving literal types. */
const literalEnum = <T extends string>(values: readonly T[]) =>
  z.enum(values as unknown as [T, ...T[]]);

/* -------------------------------------------------------------------------- */
/*  Primitives                                                                 */
/* -------------------------------------------------------------------------- */

export const languageSchema = literalEnum<LanguageCode>(LANGUAGE_CODES);
export const roleSchema = literalEnum<UserRole>(USER_ROLES);

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
    code: literalEnum<ApiErrorCode>(API_ERROR_CODES),
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
    role: literalEnum<UserRole>(SELF_ASSIGNABLE_ROLES).default('USER'),
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
  category: literalEnum<KnowledgeCategory>(KNOWLEDGE_CATEGORIES).optional(),
});
export type ChatRequest = z.infer<typeof chatRequestSchema>;

export const sourceRefSchema = z.object({
  id: z.string(),
  title: z.string(),
  authority: z.string(),
  sourceUrl: z.string().url().nullable(),
  category: literalEnum<KnowledgeCategory>(KNOWLEDGE_CATEGORIES),
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
  confidence: literalEnum<AnswerConfidence>(ANSWER_CONFIDENCE).optional(),
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
/*  Schemes                                                                    */
/* -------------------------------------------------------------------------- */

export const schemeSummarySchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  category: literalEnum<KnowledgeCategory>(KNOWLEDGE_CATEGORIES),
  targetUsers: z.array(z.string()),
  state: z.string().nullable(),
  verifiedAt: z.string().nullable(),
});
export type SchemeSummary = z.infer<typeof schemeSummarySchema>;

export const schemeDetailSchema = schemeSummarySchema.extend({
  purpose: z.string(),
  eligibility: z.string(),
  benefits: z.string(),
  requiredDocuments: z.array(z.string()),
  applicationProcess: z.string(),
  officialSource: z.string(),
  officialUrl: z.string().url().nullable(),
  language: languageSchema,
});
export type SchemeDetail = z.infer<typeof schemeDetailSchema>;

export const schemeQuerySchema = z.object({
  category: literalEnum<KnowledgeCategory>(KNOWLEDGE_CATEGORIES).optional(),
  state: z.string().trim().max(120).optional(),
  targetUser: z.string().trim().max(60).optional(),
  q: z.string().trim().max(120).optional(),
});
export type SchemeQuery = z.infer<typeof schemeQuerySchema>;

/* -------------------------------------------------------------------------- */
/*  Content topics (cooperative law / PACS / financial literacy / PMFBY)       */
/* -------------------------------------------------------------------------- */

export const CONTENT_SECTIONS = ['COOPERATIVE_LAW', 'PACS', 'FINANCIAL_LITERACY', 'PMFBY'] as const;
export type ContentSectionCode = (typeof CONTENT_SECTIONS)[number];
export const contentSectionSchema = literalEnum<ContentSectionCode>(CONTENT_SECTIONS);

export const contentTopicSchema = z.object({
  section: contentSectionSchema,
  slug: z.string(),
  topic: z.string(),
  title: z.string(),
  summary: z.string(),
  simpleExplanation: z.string(),
  detailedExplanation: z.string().nullable(),
  example: z.string().nullable(),
  authority: z.string(),
  sourceUrl: z.string().url().nullable(),
  language: languageSchema,
  order: z.number().int(),
  verifiedAt: z.string().nullable(),
});
export type ContentTopic = z.infer<typeof contentTopicSchema>;

/* -------------------------------------------------------------------------- */
/*  Grievances                                                                 */
/* -------------------------------------------------------------------------- */

export const grievanceCategorySchema = literalEnum<GrievanceCategory>(GRIEVANCE_CATEGORIES);
export const grievanceStatusSchema = literalEnum<GrievanceStatus>(GRIEVANCE_STATUSES);

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

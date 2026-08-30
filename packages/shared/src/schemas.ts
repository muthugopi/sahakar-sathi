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

/** Accepts true/false as boolean or the strings "true"/"false" (form posts). */
export const literalBoolean = z.union([
  z.boolean(),
  z.enum(['true', 'false']).transform((v) => v === 'true'),
]);

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

export const updateItemSchema = z.object({
  date: z.string(),
  title: z.string(),
  category: z.string(),
  href: z.string(),
});
export type UpdateItem = z.infer<typeof updateItemSchema>;

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
  /** True when the text is shown in the requested non-English language. */
  translated: z.boolean().default(false),
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
export type GrievanceEvent = z.infer<typeof grievanceEventSchema>;

export const grievanceAttachmentSchema = z.object({
  id: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  sizeBytes: z.number().int(),
});
export type GrievanceAttachment = z.infer<typeof grievanceAttachmentSchema>;

/** What anyone holding the tracking ID can see — no personal detail. */
export const grievancePublicSchema = z.object({
  trackingId: z.string(),
  category: grievanceCategorySchema,
  status: grievanceStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  timeline: z.array(grievanceEventSchema),
});
export type GrievancePublic = z.infer<typeof grievancePublicSchema>;

/** Full record — returned only to the grievance owner or an admin. */
export const grievanceDetailSchema = grievancePublicSchema.extend({
  id: z.string(),
  description: z.string(),
  language: languageSchema,
  district: z.string().nullable(),
  state: z.string().nullable(),
  contactPhone: z.string().nullable(),
  attachments: z.array(grievanceAttachmentSchema),
  isOwner: z.boolean(),
});
export type GrievanceDetail = z.infer<typeof grievanceDetailSchema>;

export const grievanceListItemSchema = z.object({
  trackingId: z.string(),
  category: grievanceCategorySchema,
  status: grievanceStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type GrievanceListItem = z.infer<typeof grievanceListItemSchema>;

export const createGrievanceResponseSchema = z.object({
  trackingId: z.string(),
  status: grievanceStatusSchema,
});

/** Admin: advance a grievance. */
export const updateGrievanceStatusSchema = z.object({
  status: grievanceStatusSchema,
  note: z.string().trim().max(2000).optional(),
});
export type UpdateGrievanceStatusInput = z.infer<typeof updateGrievanceStatusSchema>;

/** Ordered lifecycle — used by the status stepper and transition validation. */
export const GRIEVANCE_LIFECYCLE = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'ASSIGNED',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
] as const;

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
/*  Admin                                                                      */
/* -------------------------------------------------------------------------- */

export const adminAnalyticsSchema = z.object({
  users: z.object({
    total: z.number(),
    byRole: z.record(z.string(), z.number()),
    last7Days: z.number(),
  }),
  conversations: z.object({ total: z.number(), last7Days: z.number() }),
  messages: z.object({ total: z.number(), byLanguage: z.record(z.string(), z.number()) }),
  grievances: z.object({
    total: z.number(),
    open: z.number(),
    byStatus: z.record(z.string(), z.number()),
    byCategory: z.record(z.string(), z.number()),
  }),
  knowledge: z.object({ total: z.number(), published: z.number(), unverified: z.number() }),
  schemes: z.object({ total: z.number(), verified: z.number(), archived: z.number() }),
  feedback: z.object({ up: z.number(), down: z.number() }),
  topQuestions: z.array(z.object({ text: z.string(), count: z.number() })),
  recentDownvotes: z.array(
    z.object({ messageId: z.string(), content: z.string(), comment: z.string().nullable(), createdAt: z.string() }),
  ),
});
export type AdminAnalytics = z.infer<typeof adminAnalyticsSchema>;

export const adminDocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: literalEnum<KnowledgeCategory>(KNOWLEDGE_CATEGORIES),
  authority: z.string(),
  sourceUrl: z.string().nullable(),
  language: languageSchema,
  version: z.number().int(),
  isVerified: z.boolean(),
  isPublished: z.boolean(),
  verifiedAt: z.string().nullable(),
  chunkCount: z.number().int(),
  updatedAt: z.string(),
  textPreview: z.string().optional(),
});
export type AdminDocument = z.infer<typeof adminDocumentSchema>;

export const createDocumentSchema = z.object({
  title: z.string().trim().min(3).max(240),
  category: literalEnum<KnowledgeCategory>(KNOWLEDGE_CATEGORIES),
  authority: z.string().trim().min(3).max(200),
  sourceUrl: z.string().trim().url().max(500).optional().or(z.literal('')),
  language: languageSchema.default('en'),
  text: z.string().trim().min(40).max(200_000).optional(), // omitted when a PDF is uploaded
  publish: z.coerce.boolean().default(true),
});
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;

export const updateDocumentSchema = z.object({
  title: z.string().trim().min(3).max(240).optional(),
  category: literalEnum<KnowledgeCategory>(KNOWLEDGE_CATEGORIES).optional(),
  authority: z.string().trim().min(3).max(200).optional(),
  sourceUrl: z.string().trim().url().max(500).nullable().optional(),
  language: languageSchema.optional(),
  text: z.string().trim().min(40).max(200_000).optional(),
  isPublished: z.boolean().optional(),
});
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;

export const schemeInputSchema = z.object({
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens'),
  title: z.string().trim().min(3).max(240),
  category: literalEnum<KnowledgeCategory>(KNOWLEDGE_CATEGORIES).default('MINISTRY_SCHEME'),
  summary: z.string().trim().min(10).max(600),
  purpose: z.string().trim().min(10).max(2000),
  targetUsers: z.array(z.string().trim().min(1).max(60)).min(1).max(10),
  eligibility: z.string().trim().min(10).max(4000),
  benefits: z.string().trim().min(10).max(4000),
  requiredDocuments: z.array(z.string().trim().min(1).max(200)).max(20),
  applicationProcess: z.string().trim().min(10).max(4000),
  officialSource: z.string().trim().min(3).max(200),
  officialUrl: z.string().trim().url().max(500).optional().or(z.literal('')),
  state: z.string().trim().max(120).nullable().optional(),
});
export type SchemeInput = z.infer<typeof schemeInputSchema>;

export const schemeAdminSchema = schemeDetailSchema.extend({
  isVerified: z.boolean(),
  isArchived: z.boolean(),
  updatedAt: z.string(),
});
export type SchemeAdmin = z.infer<typeof schemeAdminSchema>;

export const adminGrievanceListItemSchema = grievanceListItemSchema.extend({
  district: z.string().nullable(),
  state: z.string().nullable(),
  assignee: z.string().nullable(),
});
export type AdminGrievanceListItem = z.infer<typeof adminGrievanceListItemSchema>;

export const adminUpdateGrievanceSchema = z.object({
  status: grievanceStatusSchema.optional(),
  note: z.string().trim().max(2000).optional(),
  assigneeEmail: z.string().trim().email().nullable().optional(),
});
export type AdminUpdateGrievanceInput = z.infer<typeof adminUpdateGrievanceSchema>;

/* -------------------------------------------------------------------------- */
/*  Pagination helper                                                          */
/* -------------------------------------------------------------------------- */

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * Cross-cutting constants shared by the API and the web app.
 * Adding a new language here is the ONLY code change required to widen
 * language support across validation, i18n loading, and the language selector.
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English', dir: 'ltr' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', dir: 'ltr' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', dir: 'ltr' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export const LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((l) => l.code) as LanguageCode[];

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

export const USER_ROLES = ['USER', 'FARMER', 'COOPERATIVE_MEMBER', 'ADMIN'] as const;
export type UserRole = (typeof USER_ROLES)[number];

/** Roles a member of the public may self-assign at registration. */
export const SELF_ASSIGNABLE_ROLES: UserRole[] = ['USER', 'FARMER', 'COOPERATIVE_MEMBER'];

export const GRIEVANCE_STATUSES = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'ASSIGNED',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
] as const;
export type GrievanceStatus = (typeof GRIEVANCE_STATUSES)[number];

export const GRIEVANCE_CATEGORIES = [
  'MEMBERSHIP',
  'LOAN_CREDIT',
  'DEPOSITS',
  'PACS_SERVICE',
  'CROP_INSURANCE',
  'SCHEME_BENEFIT',
  'GOVERNANCE_ELECTION',
  'CORRUPTION_MISCONDUCT',
  'OTHER',
] as const;
export type GrievanceCategory = (typeof GRIEVANCE_CATEGORIES)[number];

export const KNOWLEDGE_CATEGORIES = [
  'COOPERATIVE_LAW',
  'BYLAWS',
  'GOVERNANCE',
  'MINISTRY_SCHEME',
  'PACS_SERVICE',
  'PMFBY_AGRICULTURE',
  'FINANCIAL_LITERACY',
  'GRIEVANCE_PROCESS',
  'MEMBER_SERVICE',
  'FAQ',
] as const;
export type KnowledgeCategory = (typeof KNOWLEDGE_CATEGORIES)[number];

/** How confident the assistant is that its answer is grounded in verified docs. */
export const ANSWER_CONFIDENCE = ['HIGH', 'MEDIUM', 'LOW', 'NO_SOURCE'] as const;
export type AnswerConfidence = (typeof ANSWER_CONFIDENCE)[number];

/**
 * Trust hierarchy for a cited source, highest first. OFFICIAL = verified
 * government / cooperative documents in the knowledge base; ENCYCLOPEDIA =
 * Wikipedia; WEB = a general web-search result.
 */
export const SOURCE_TIERS = ['OFFICIAL', 'ENCYCLOPEDIA', 'WEB'] as const;
export type SourceTier = (typeof SOURCE_TIERS)[number];

export const API_ERROR_CODES = [
  'VALIDATION_ERROR',
  'UNAUTHORIZED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'RATE_LIMITED',
  'SERVICE_UNAVAILABLE',
  'AI_UNAVAILABLE',
  'AI_TIMEOUT',
  'NO_KNOWLEDGE_FOUND',
  'UPLOAD_REJECTED',
  'INTERNAL',
] as const;
export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

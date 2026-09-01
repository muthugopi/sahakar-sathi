import { z } from 'zod';
import {
  CONTENT_SECTIONS,
  contentSectionSchema,
  languageSchema,
  schemeQuerySchema,
} from '@sahakar/shared';
import type { LanguageCode } from '@sahakar/shared';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import * as schemeService from '../services/scheme.service.js';
import * as contentService from '../services/content.service.js';

// Public reference content — safe to cache at the edge for a few minutes.
const PUBLIC_CACHE = 'public, max-age=300, stale-while-revalidate=86400';
// Never let a CDN cache a transient failure or a not-found.
const NO_CACHE = 'no-store';

const slugParams = z.object({ slug: z.string().trim().min(1).max(120) });
const sectionParams = z.object({ section: contentSectionSchema });
const langQuery = z.object({ lang: languageSchema.optional() });

function parseLang(raw: unknown): LanguageCode {
  const { lang } = langQuery.parse(raw);
  return (lang as LanguageCode) ?? 'en';
}

/* -------------------------------------------------------------------------- */
/*  Schemes                                                                    */
/* -------------------------------------------------------------------------- */

export const getSchemes = asyncHandler(async (req, res) => {
  const query = schemeQuerySchema.parse(req.query);
  const [schemes, facets] = await Promise.all([
    schemeService.listSchemes(query),
    schemeService.schemeFacets(),
  ]);
  res.setHeader('Cache-Control', PUBLIC_CACHE);
  res.json({ schemes: schemes ?? [], facets });
});

export const getSchemeBySlug = asyncHandler(async (req, res) => {
  const { slug } = slugParams.parse(req.params);
  const scheme = await schemeService.getScheme(slug);
  if (!scheme) {
    // Defensive: the service already throws NOT_FOUND, but never 500 on a null.
    res.setHeader('Cache-Control', NO_CACHE);
    throw AppError.notFound('Scheme not found.');
  }
  res.setHeader('Cache-Control', PUBLIC_CACHE);
  res.json({ scheme });
});

/* -------------------------------------------------------------------------- */
/*  Explainer content                                                          */
/* -------------------------------------------------------------------------- */

export const getContentSection = asyncHandler(async (req, res) => {
  // A section that isn't one of the four known codes is a client error (400),
  // not a server error. Give a precise message rather than a generic Zod dump.
  const parsed = sectionParams.safeParse(req.params);
  if (!parsed.success) {
    res.setHeader('Cache-Control', NO_CACHE);
    throw AppError.validation(
      `Unknown content section. Expected one of: ${CONTENT_SECTIONS.join(', ')}.`,
    );
  }

  const { section } = parsed.data;
  const lang = parseLang(req.query);

  const topics = await contentService.listBySection(section, lang);

  res.setHeader('Cache-Control', PUBLIC_CACHE);
  res.setHeader('Vary', 'Accept-Language');
  // `topics` is always an array (findMany returns [] when empty); `?? []` is a
  // belt-and-braces guard so a shape change downstream can't 500 the route.
  res.json({ section, topics: topics ?? [] });
});

export const getContentTopic = asyncHandler(async (req, res) => {
  const { slug } = slugParams.parse(req.params);
  const lang = parseLang(req.query);

  const topic = await contentService.getTopic(slug, lang); // throws NOT_FOUND if absent
  if (!topic) {
    res.setHeader('Cache-Control', NO_CACHE);
    throw AppError.notFound('Topic not found.');
  }

  res.setHeader('Cache-Control', PUBLIC_CACHE);
  res.json({ topic });
});

export const getUpdates = asyncHandler(async (_req, res) => {
  const updates = await contentService.recentUpdates(6);
  res.setHeader('Cache-Control', PUBLIC_CACHE);
  res.json({ updates: updates ?? [] });
});

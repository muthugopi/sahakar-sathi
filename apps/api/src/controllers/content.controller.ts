import { z } from 'zod';
import { contentSectionSchema, languageSchema, schemeQuerySchema } from '@sahakar/shared';
import type { LanguageCode } from '@sahakar/shared';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as schemeService from '../services/scheme.service.js';
import * as contentService from '../services/content.service.js';

// Public reference content — safe to cache at the edge for a few minutes.
const PUBLIC_CACHE = 'public, max-age=300, stale-while-revalidate=86400';

export const getSchemes = asyncHandler(async (req, res) => {
  const query = schemeQuerySchema.parse(req.query);
  const [schemes, facets] = await Promise.all([
    schemeService.listSchemes(query),
    schemeService.schemeFacets(),
  ]);
  res.setHeader('Cache-Control', PUBLIC_CACHE);
  res.json({ schemes, facets });
});

const slugParams = z.object({ slug: z.string().min(1).max(120) });

export const getSchemeBySlug = asyncHandler(async (req, res) => {
  const { slug } = slugParams.parse(req.params);
  res.setHeader('Cache-Control', PUBLIC_CACHE);
  res.json({ scheme: await schemeService.getScheme(slug) });
});

const sectionParams = z.object({ section: contentSectionSchema });
const langQuery = z.object({ lang: languageSchema.optional() });

export const getContentSection = asyncHandler(async (req, res) => {
  const { section } = sectionParams.parse(req.params);
  const { lang } = langQuery.parse(req.query);
  res.setHeader('Cache-Control', PUBLIC_CACHE);
  res.setHeader('Vary', 'Accept-Language');
  res.json({
    section,
    topics: await contentService.listBySection(section, (lang as LanguageCode) ?? 'en'),
  });
});

export const getContentTopic = asyncHandler(async (req, res) => {
  const { slug } = slugParams.parse(req.params);
  const { lang } = langQuery.parse(req.query);
  res.setHeader('Cache-Control', PUBLIC_CACHE);
  res.json({ topic: await contentService.getTopic(slug, (lang as LanguageCode) ?? 'en') });
});

export const getUpdates = asyncHandler(async (_req, res) => {
  res.setHeader('Cache-Control', PUBLIC_CACHE);
  res.json({ updates: await contentService.recentUpdates(6) });
});

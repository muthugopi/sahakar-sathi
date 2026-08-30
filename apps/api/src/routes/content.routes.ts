import { Router } from 'express';
import {
  getContentSection,
  getContentTopic,
  getSchemeBySlug,
  getSchemes,
  getUpdates,
} from '../controllers/content.controller.js';

/** Public read-only reference content: schemes + explainer topics. */
export const schemesRouter = Router();
schemesRouter.get('/', getSchemes);
schemesRouter.get('/:slug', getSchemeBySlug);

export const contentRouter = Router();
contentRouter.get('/updates', getUpdates);
contentRouter.get('/topics/:slug', getContentTopic);
contentRouter.get('/:section', getContentSection);

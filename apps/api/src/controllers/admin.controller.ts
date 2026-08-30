import { z } from 'zod';
import {
  adminUpdateGrievanceSchema,
  createDocumentSchema,
  grievanceCategorySchema,
  grievanceStatusSchema,
  literalBoolean,
  schemeInputSchema,
  updateDocumentSchema,
} from '@sahakar/shared';
import type { KnowledgeCategory } from '@sahakar/shared';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { audit } from '../utils/audit.js';
import { extractPdfText } from '../utils/pdf.js';
import { getAnalytics } from '../services/admin/analytics.service.js';
import * as kb from '../services/admin/knowledge-admin.service.js';
import * as schemes from '../services/admin/scheme-admin.service.js';
import * as grievances from '../services/admin/grievance-admin.service.js';

/* --------------------------------- analytics ------------------------------- */

export const getAdminAnalytics = asyncHandler(async (_req, res) => {
  res.json(await getAnalytics());
});

/* --------------------------------- knowledge ------------------------------- */

const docListQuery = z.object({
  category: z.string().optional(),
  verified: z.enum(['true', 'false']).optional(),
  q: z.string().trim().max(120).optional(),
});

export const listDocuments = asyncHandler(async (req, res) => {
  const q = docListQuery.parse(req.query);
  const documents = await kb.listDocuments({
    category: q.category as KnowledgeCategory | undefined,
    verified: q.verified ? q.verified === 'true' : undefined,
    q: q.q,
  });
  res.json({ documents });
});

const idParam = z.object({ id: z.string().min(1).max(40) });

export const getDocument = asyncHandler(async (req, res) => {
  const { id } = idParam.parse(req.params);
  res.json({ document: await kb.getDocument(id) });
});

export const createDocument = asyncHandler(async (req, res) => {
  const input = createDocumentSchema.parse(req.body);
  let text = input.text?.trim() ?? '';

  if (req.file) {
    if (req.file.mimetype !== 'application/pdf') {
      throw new AppError('UPLOAD_REJECTED', 'Only PDF files can be uploaded here.');
    }
    text = await extractPdfText(req.file.buffer);
  }
  if (!text) {
    throw AppError.validation('Provide the document text or upload a PDF.');
  }

  const document = await kb.createDocument({ ...input, text }, req.auth!.sub);
  audit(req, 'document.create', { type: 'KnowledgeDocument', id: document.id }, {
    title: document.title,
    source: req.file ? 'pdf' : 'text',
  });
  res.status(201).json({ document });
});

export const updateDocument = asyncHandler(async (req, res) => {
  const { id } = idParam.parse(req.params);
  const input = updateDocumentSchema.parse(req.body);
  const document = await kb.updateDocument(id, input);
  audit(req, 'document.update', { type: 'KnowledgeDocument', id });
  res.json({ document });
});

const verifyBody = z.object({ verified: literalBoolean.default(true) });

export const verifyDocument = asyncHandler(async (req, res) => {
  const { id } = idParam.parse(req.params);
  const { verified } = verifyBody.parse(req.body);
  const document = await kb.verifyDocument(id, verified);
  audit(req, verified ? 'document.verify' : 'document.unverify', { type: 'KnowledgeDocument', id });
  res.json({ document });
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const { id } = idParam.parse(req.params);
  await kb.deleteDocument(id);
  audit(req, 'document.delete', { type: 'KnowledgeDocument', id });
  res.status(204).end();
});

/* ---------------------------------- schemes -------------------------------- */

const slugParam = z.object({ slug: z.string().min(1).max(120) });

export const listSchemesAdmin = asyncHandler(async (_req, res) => {
  res.json({ schemes: await schemes.listSchemesAdmin() });
});

export const getSchemeAdmin = asyncHandler(async (req, res) => {
  const { slug } = slugParam.parse(req.params);
  res.json({ scheme: await schemes.getSchemeAdmin(slug) });
});

export const createScheme = asyncHandler(async (req, res) => {
  const input = schemeInputSchema.parse(req.body);
  const scheme = await schemes.createScheme(input);
  audit(req, 'scheme.create', { type: 'Scheme', id: scheme.slug });
  res.status(201).json({ scheme });
});

export const updateScheme = asyncHandler(async (req, res) => {
  const { slug } = slugParam.parse(req.params);
  const input = schemeInputSchema.parse({ ...req.body, slug });
  const scheme = await schemes.updateScheme(slug, input);
  audit(req, 'scheme.update', { type: 'Scheme', id: slug });
  res.json({ scheme });
});

export const verifyScheme = asyncHandler(async (req, res) => {
  const { slug } = slugParam.parse(req.params);
  const { verified } = verifyBody.parse(req.body);
  const scheme = await schemes.verifyScheme(slug, verified);
  audit(req, verified ? 'scheme.verify' : 'scheme.unverify', { type: 'Scheme', id: slug });
  res.json({ scheme });
});

export const archiveScheme = asyncHandler(async (req, res) => {
  const { slug } = slugParam.parse(req.params);
  const { archived } = z.object({ archived: literalBoolean.default(true) }).parse(req.body);
  const scheme = await schemes.archiveScheme(slug, archived);
  audit(req, archived ? 'scheme.archive' : 'scheme.unarchive', { type: 'Scheme', id: slug });
  res.json({ scheme });
});

/* --------------------------------- grievances ------------------------------ */

const grievanceListQuery = z.object({
  status: grievanceStatusSchema.optional(),
  category: grievanceCategorySchema.optional(),
  q: z.string().trim().max(120).optional(),
});
const trackingParam = z.object({
  trackingId: z.string().trim().regex(/^GRV-[0-9A-Z]{4,12}$/i),
});

export const listGrievancesAdmin = asyncHandler(async (req, res) => {
  const q = grievanceListQuery.parse(req.query);
  res.json({ grievances: await grievances.listGrievancesAdmin(q) });
});

export const getGrievanceAdmin = asyncHandler(async (req, res) => {
  const { trackingId } = trackingParam.parse(req.params);
  res.json({ grievance: await grievances.getGrievanceAdmin(trackingId) });
});

export const updateGrievanceAdmin = asyncHandler(async (req, res) => {
  const { trackingId } = trackingParam.parse(req.params);
  const input = adminUpdateGrievanceSchema.parse(req.body);
  const grievance = await grievances.adminUpdateGrievance(trackingId, input, req.auth!.sub);
  audit(req, 'grievance.update', { type: 'Grievance', id: trackingId }, {
    status: input.status,
    assigned: input.assigneeEmail,
  });
  res.json({ grievance });
});

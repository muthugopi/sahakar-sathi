import { z } from 'zod';
import { createGrievanceSchema, updateGrievanceStatusSchema } from '@sahakar/shared';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import * as grievanceService from '../services/grievance.service.js';
import { openStoredFile } from '../utils/upload.js';

const trackingParam = z.object({
  trackingId: z
    .string()
    .trim()
    .regex(/^GRV-[0-9A-Z]{4,12}$/i, 'That does not look like a valid tracking ID.'),
});
const idParam = z.object({ id: z.string().min(1).max(40) });

function viewer(req: import('express').Request) {
  return { userId: req.auth?.sub, isAdmin: req.auth?.role === 'ADMIN' };
}

export const postGrievance = asyncHandler(async (req, res) => {
  const input = createGrievanceSchema.parse(req.body);
  const result = await grievanceService.createGrievance(input, req.auth?.sub);
  res.status(201).json(result);
});

export const postAttachment = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('UPLOAD_REJECTED', 'No file was received.');
  const attachment = await grievanceService.createAttachment(req.file);
  res.status(201).json({ attachment });
});

export const getGrievance = asyncHandler(async (req, res) => {
  const { trackingId } = trackingParam.parse(req.params);
  const grievance = await grievanceService.getGrievance(trackingId, viewer(req));
  res.json({ grievance });
});

export const listMyGrievances = asyncHandler(async (req, res) => {
  if (!req.auth) throw AppError.unauthorized();
  res.json({ grievances: await grievanceService.listMine(req.auth.sub) });
});

export const patchGrievanceStatus = asyncHandler(async (req, res) => {
  if (!req.auth) throw AppError.unauthorized();
  const { trackingId } = trackingParam.parse(req.params);
  const input = updateGrievanceStatusSchema.parse(req.body);
  const grievance = await grievanceService.updateStatus(trackingId, input, req.auth.sub);
  res.json({ grievance });
});

export const downloadAttachment = asyncHandler(async (req, res) => {
  const { id } = idParam.parse(req.params);
  const file = await grievanceService.getAttachmentForViewer(id, viewer(req));
  res.setHeader('Content-Type', file.mimeType);
  res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.originalName)}"`);
  res.setHeader('Cache-Control', 'private, no-store');
  openStoredFile(file.fileKey)
    .on('error', () => res.status(404).end())
    .pipe(res);
});

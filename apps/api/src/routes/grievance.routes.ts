import { Router } from 'express';
import { grievanceLimiter, uploadLimiter } from '../middleware/rateLimit.js';
import { optionalAuth, requireAuth, requireRole } from '../middleware/auth.js';
import { uploadSingle } from '../utils/upload.js';
import {
  downloadAttachment,
  getGrievance,
  listMyGrievances,
  patchGrievanceStatus,
  postAttachment,
  postGrievance,
} from '../controllers/grievance.controller.js';

export const grievanceRouter = Router();

// Anonymous submission is allowed; a bearer token links it to the account.
grievanceRouter.post('/', grievanceLimiter, optionalAuth, postGrievance);
grievanceRouter.post('/attachments', uploadLimiter, optionalAuth, uploadSingle, postAttachment);

grievanceRouter.get('/mine', requireAuth, listMyGrievances);
grievanceRouter.get('/attachments/:id', optionalAuth, downloadAttachment);

grievanceRouter.get('/:trackingId', optionalAuth, getGrievance);
grievanceRouter.patch('/:trackingId/status', requireAuth, requireRole('ADMIN'), patchGrievanceStatus);

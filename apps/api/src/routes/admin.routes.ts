import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { uploadSingle } from '../utils/upload.js';
import * as c from '../controllers/admin.controller.js';

export const adminRouter = Router();

// Every admin route requires a valid session with the ADMIN role.
adminRouter.use(requireAuth, requireRole('ADMIN'));

adminRouter.get('/analytics', c.getAdminAnalytics);

// Knowledge documents
adminRouter.get('/documents', c.listDocuments);
adminRouter.post('/documents', uploadSingle, c.createDocument);
adminRouter.get('/documents/:id', c.getDocument);
adminRouter.patch('/documents/:id', c.updateDocument);
adminRouter.post('/documents/:id/verify', c.verifyDocument);
adminRouter.delete('/documents/:id', c.deleteDocument);

// Schemes
adminRouter.get('/schemes', c.listSchemesAdmin);
adminRouter.post('/schemes', c.createScheme);
adminRouter.get('/schemes/:slug', c.getSchemeAdmin);
adminRouter.patch('/schemes/:slug', c.updateScheme);
adminRouter.post('/schemes/:slug/verify', c.verifyScheme);
adminRouter.post('/schemes/:slug/archive', c.archiveScheme);

// Grievances
adminRouter.get('/grievances', c.listGrievancesAdmin);
adminRouter.get('/grievances/:trackingId', c.getGrievanceAdmin);
adminRouter.patch('/grievances/:trackingId', c.updateGrievanceAdmin);

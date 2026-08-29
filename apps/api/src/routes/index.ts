import { Router } from 'express';
import { healthRouter } from './health.routes.js';

/**
 * API v1 router. Feature routers are mounted here as milestones land:
 *   auth, chat, voice, schemes, cooperative, grievances, feedback, admin.
 */
export const apiRouter = Router();

apiRouter.use('/health', healthRouter);

apiRouter.get('/', (_req, res) => {
  res.json({
    name: 'Sahakar Sathi API',
    version: 'v1',
    docs: 'See README.md — endpoints are added per milestone.',
  });
});

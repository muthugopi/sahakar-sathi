import { Router } from 'express';
import { healthRouter } from './health.routes.js';
import { authRouter } from './auth.routes.js';
import { chatRouter, feedbackRouter } from './chat.routes.js';
import { voiceRouter } from './voice.routes.js';
import { contentRouter, schemesRouter } from './content.routes.js';
import { grievanceRouter } from './grievance.routes.js';

/**
 * API v1 router. Feature routers are mounted here as milestones land:
 *   auth ✓, chat ✓, feedback ✓, voice ✓, schemes ✓, content ✓, grievances ✓, admin.
 */
export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/chat', chatRouter);
apiRouter.use('/feedback', feedbackRouter);
apiRouter.use('/voice', voiceRouter);
apiRouter.use('/schemes', schemesRouter);
apiRouter.use('/content', contentRouter);
apiRouter.use('/grievances', grievanceRouter);

apiRouter.get('/', (_req, res) => {
  res.json({
    name: 'Sahakar Sathi API',
    version: 'v1',
    docs: 'See README.md — endpoints are added per milestone.',
  });
});

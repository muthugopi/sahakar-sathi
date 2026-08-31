import path from 'node:path';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { pinoHttp } from 'pino-http';
import { env, isProd } from './config/env.js';
import { logger } from './config/logger.js';
import { requestId } from './middleware/requestId.js';
import { globalLimiter } from './middleware/rateLimit.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';
import { apiRouter } from './routes/index.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.disable('etag'); // JSON API responses need no conditional-request caching

  app.use(requestId);
  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => (req as { id?: string }).id ?? 'unknown',
      autoLogging: { ignore: (req) => req.url === '/api/v1/health/live' },
    }),
  );

  const servingWeb = Boolean(env.SERVE_WEB_DIR);

  // When the API also serves the SPA the CSP must allow the app's own assets;
  // when it is a pure JSON API it stays locked all the way down.
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: false,
        directives: servingWeb
          ? {
              'default-src': ["'none'"],
              'script-src': ["'self'"],
              'style-src': ["'self'", "'unsafe-inline'"],
              'img-src': ["'self'", 'data:'],
              'font-src': ["'self'"],
              'connect-src': ["'self'"],
              'manifest-src': ["'self'"],
              'worker-src': ["'self'"],
              'base-uri': ["'self'"],
              'form-action': ["'self'"],
              'frame-ancestors': ["'none'"],
              'object-src': ["'none'"],
            }
          : {
              'default-src': ["'none'"],
              'frame-ancestors': ["'none'"],
              'base-uri': ["'none'"],
              'form-action': ["'none'"],
            },
      },
      crossOriginResourcePolicy: { policy: 'same-site' },
      referrerPolicy: { policy: 'no-referrer' },
      hsts: isProd ? { maxAge: 15552000, includeSubDomains: true } : false,
    }),
  );

  const allowlist = new Set(env.WEB_ORIGIN);
  app.use(
    cors({
      origin(origin, cb) {
        // No Origin header = same-origin / curl / server-to-server → allow.
        // Unknown browser origin → respond without CORS headers so the browser blocks it.
        cb(null, !origin || allowlist.has(origin));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      maxAge: 600,
    }),
  );

  // 1 MB covers the largest legitimate body (an admin pasting a long document);
  // PDF uploads go through multer with its own cap, not this parser.
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false, limit: '32kb' }));
  app.use(cookieParser());

  app.use('/api/v1', globalLimiter, apiRouter);

  // Single-origin production deploy: serve the built SPA and fall back to
  // index.html for client-side routes. Hashed assets are cached hard; the
  // HTML shell and the service worker are always revalidated.
  if (env.SERVE_WEB_DIR) {
    const webDir = path.resolve(env.SERVE_WEB_DIR);
    app.use(
      express.static(webDir, {
        index: false,
        setHeaders(res, filePath) {
          if (filePath.includes(`${path.sep}assets${path.sep}`)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          } else {
            res.setHeader('Cache-Control', 'no-cache');
          }
        },
      }),
    );
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(webDir, 'index.html'));
    });
    logger.info({ webDir }, 'serving SPA from the API process');
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

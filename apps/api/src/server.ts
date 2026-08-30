import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma } from './config/prisma.js';
import { warmupEmbeddings } from './ai/embeddings.js';

const app = createApp();

const server = app.listen(env.API_PORT, () => {
  logger.info(`Sahakar Sathi API listening on http://localhost:${env.API_PORT}/api/v1`);
  // Load the embedding model in the background so the first chat isn't slow.
  void warmupEmbeddings();
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(
      `Port ${env.API_PORT} is already in use. Stop the other process or set API_PORT to a free port.`,
    );
  } else {
    logger.error({ err }, 'HTTP server error');
  }
  process.exit(1);
});

async function shutdown(signal: string) {
  logger.info(`${signal} received — shutting down`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  // Force-exit if connections do not drain in time.
  setTimeout(() => process.exit(1), 10_000).unref();
}

for (const sig of ['SIGINT', 'SIGTERM'] as const) {
  process.on(sig, () => void shutdown(sig));
}

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled promise rejection');
});
process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception — exiting');
  process.exit(1);
});

import type { Server as HttpServer } from 'http';

import { createApp } from './app.js';
import { closePool } from './config/database.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

let server: HttpServer | null = null;

async function start() {
  const app = createApp();

  server = app.listen(env.PORT, env.HOST, () => {
    logger.info({ port: env.PORT, host: env.HOST, nodeEnv: env.NODE_ENV }, 'Server started');
    logger.info(`🚀 GraphQL endpoint: http://${env.HOST}:${env.PORT}/graphql`);
  });
}

async function shutdown(signal: string) {
  logger.info({ signal }, 'Received shutdown signal');

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');
      await closePool();
      logger.info('Database pool closed');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000).unref();
  } else {
    await closePool();
    process.exit(0);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught exception');
  shutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled rejection');
  shutdown('UNHANDLED_REJECTION');
});

start();

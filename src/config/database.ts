import pg from 'pg';

import { env } from './env.js';
import { logger } from './logger.js';

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected database pool error');
});

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[],
) {
  const start = Date.now();
  const result = await pool.query<T>(text, params);
  const duration = Date.now() - start;

  logger.debug({ duration: `${duration}ms`, rows: result.rowCount }, text);

  return result;
}

export async function getClient() {
  const client = await pool.connect();
  return client;
}

export async function closePool() {
  await pool.end();
}

export default pool;

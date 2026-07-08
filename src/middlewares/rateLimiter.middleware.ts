import rateLimit from 'express-rate-limit';

import { logger } from '../config/logger.js';

export const graphqlLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    errors: [
      {
        message: 'Too many requests, please try again later',
        extensions: { code: 'RATE_LIMIT_EXCEEDED' },
      },
    ],
  },
  handler: (req, res, _next, options) => {
    logger.warn({ ip: req.ip, path: req.originalUrl }, 'Rate limit exceeded');
    res.status(options.statusCode).json(options.message);
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    if (req.method !== 'POST') return true;

    const body = req.body as { query?: string } | undefined;
    if (!body?.query) return true;

    const query = body.query.trim();
    const isAuthOperation =
      query.startsWith('mutation') &&
      (query.includes('login') || query.includes('register'));

    return !isAuthOperation;
  },
  message: {
    errors: [
      {
        message: 'Too many authentication attempts, please try again later',
        extensions: { code: 'RATE_LIMIT_EXCEEDED' },
      },
    ],
  },
  handler: (req, res, _next, options) => {
    logger.warn({ ip: req.ip, path: req.originalUrl }, 'Auth rate limit exceeded');
    res.status(options.statusCode).json(options.message);
  },
});

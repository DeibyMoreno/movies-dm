import type { Request, Response, NextFunction } from 'express';

import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { AppError } from '../lib/errors/AppError.js';
import { ValidationError } from '../lib/errors/ValidationError.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError && err.isOperational) {
    logger.warn({ err, code: err.code, statusCode: err.statusCode }, err.message);

    const body: Record<string, unknown> = {
      errors: [
        {
          message: err.message,
          code: err.code,
        },
      ],
    };

    if (err instanceof ValidationError && err.details) {
      (body.errors as Record<string, unknown>[])[0].details = err.details;
    }

    res.status(err.statusCode).json(body);
    return;
  }

  logger.error({ err }, 'Unexpected error');

  res.status(500).json({
    errors: [
      {
        message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
        code: 'INTERNAL_ERROR',
      },
    ],
  });
}

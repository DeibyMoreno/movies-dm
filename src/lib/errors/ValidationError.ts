import { AppError } from './AppError.js';

export class ValidationError extends AppError {
  public readonly details: Record<string, string[]> | undefined;

  constructor(message: string = 'Validation failed', details?: Record<string, string[]>) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

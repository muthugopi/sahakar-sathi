import type { ApiErrorCode } from '@sahakar/shared';

const STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  SERVICE_UNAVAILABLE: 503,
  AI_UNAVAILABLE: 503,
  AI_TIMEOUT: 504,
  NO_KNOWLEDGE_FOUND: 422,
  UPLOAD_REJECTED: 400,
  INTERNAL: 500,
};

/**
 * The only error type route/service code should throw deliberately.
 * The global error handler turns it into the shared `{ error: {...} }` envelope.
 */
export class AppError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly details?: unknown;
  readonly expose: boolean;

  constructor(code: ApiErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = STATUS_BY_CODE[code];
    this.details = details;
    this.expose = this.status < 500;
  }

  static unauthorized(message = 'Authentication required') {
    return new AppError('UNAUTHORIZED', message);
  }
  static forbidden(message = 'You do not have access to this resource') {
    return new AppError('FORBIDDEN', message);
  }
  static notFound(message = 'Resource not found') {
    return new AppError('NOT_FOUND', message);
  }
  static conflict(message: string) {
    return new AppError('CONFLICT', message);
  }
  static validation(message: string, details?: unknown) {
    return new AppError('VALIDATION_ERROR', message, details);
  }
  static serviceUnavailable(message = 'The service is temporarily unavailable. Please retry.') {
    return new AppError('SERVICE_UNAVAILABLE', message);
  }
}

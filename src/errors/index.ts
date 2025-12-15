/**
 * Base exception for MatchEngine SDK errors.
 */
export class MatchEngineError extends Error {
  readonly statusCode?: number;
  readonly responseData?: Record<string, unknown>;

  constructor(
    message: string,
    options?: { statusCode?: number; responseData?: Record<string, unknown> }
  ) {
    super(message);
    this.name = 'MatchEngineError';
    this.statusCode = options?.statusCode;
    this.responseData = options?.responseData;
  }
}

/**
 * Authentication failed (invalid or expired token).
 */
export class AuthenticationError extends MatchEngineError {
  constructor(message = 'Invalid or expired API token') {
    super(message, { statusCode: 401 });
    this.name = 'AuthenticationError';
  }
}

/**
 * Resource not found.
 */
export class NotFoundError extends MatchEngineError {
  constructor(message = 'Resource not found') {
    super(message, { statusCode: 404 });
    this.name = 'NotFoundError';
  }
}

/**
 * Validation error.
 */
export class ValidationError extends MatchEngineError {
  readonly fieldErrors?: Record<string, string[]>;

  constructor(
    message: string,
    options?: {
      fieldErrors?: Record<string, string[]>;
      responseData?: Record<string, unknown>;
    }
  ) {
    super(message, { statusCode: 400, responseData: options?.responseData });
    this.name = 'ValidationError';
    this.fieldErrors = options?.fieldErrors;
  }
}

/**
 * Requested time slot is not available.
 */
export class SlotNotAvailableError extends MatchEngineError {
  constructor(message = 'Time slot is not available') {
    super(message, { statusCode: 400 });
    this.name = 'SlotNotAvailableError';
  }
}

/**
 * User not found for the given external ID.
 */
export class UserNotFoundError extends MatchEngineError {
  constructor(message = 'User not found') {
    super(message, { statusCode: 404 });
    this.name = 'UserNotFoundError';
  }
}

/**
 * Booking operation failed.
 */
export class BookingError extends MatchEngineError {
  constructor(
    message: string,
    options?: { statusCode?: number; responseData?: Record<string, unknown> }
  ) {
    super(message, options);
    this.name = 'BookingError';
  }
}

/**
 * Payment operation failed.
 */
export class PaymentError extends MatchEngineError {
  constructor(
    message: string,
    options?: { statusCode?: number; responseData?: Record<string, unknown> }
  ) {
    super(message, options);
    this.name = 'PaymentError';
  }
}

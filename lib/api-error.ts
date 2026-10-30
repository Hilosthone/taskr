export interface FieldError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  code: string;
  message: string;
  errors?: FieldError[];
  timestamp: string;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly errors?: FieldError[];
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    code: string = "INTERNAL_ERROR",
    errors?: FieldError[],
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Serializes error into a consistent client-facing API response object.
   */
  public toResponse(): ApiErrorResponse {
    return {
      success: false,
      statusCode: this.statusCode,
      code: this.code,
      message: this.message,
      ...(this.errors && this.errors.length > 0 ? { errors: this.errors } : {}),
      timestamp: new Date().toISOString(),
    };
  }

  // --- Common HTTP Error Helpers ---

  static badRequest(message = "Bad request", errors?: FieldError[], code = "BAD_REQUEST") {
    return new ApiError(400, message, code, errors);
  }

  static unauthorized(message = "Authentication required", code = "UNAUTHORIZED") {
    return new ApiError(401, message, code);
  }

  static forbidden(message = "Permission denied", code = "FORBIDDEN") {
    return new ApiError(403, message, code);
  }

  static notFound(message = "Requested resource not found", code = "NOT_FOUND") {
    return new ApiError(404, message, code);
  }

  static conflict(message = "Resource already exists", code = "CONFLICT") {
    return new ApiError(409, message, code);
  }

  static unprocessableEntity(message = "Validation failed", errors: FieldError[], code = "VALIDATION_ERROR") {
    return new ApiError(422, message, code, errors);
  }

  static tooManyRequests(message = "Rate limit exceeded, try again later", code = "TOO_MANY_REQUESTS") {
    return new ApiError(429, message, code);
  }

  static internal(message = "An unexpected error occurred", code = "INTERNAL_SERVER_ERROR") {
    return new ApiError(500, message, code, undefined, false);
  }
}
export class ApiError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(statusCode: number, message: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }

  static badRequest(message: string, details?: any): ApiError {
    return new ApiError(400, message, details);
  }

  static unprocessabelEntity(message: string, details?: any): ApiError {
    return new ApiError(422, message, details);
  }

  static unauthorized(message: string, details?: any): ApiError {
    return new ApiError(401, message, details);
  }

  static forbidden(message: string, details?: any): ApiError {
    return new ApiError(403, message, details);
  }

  static notFound(message: string, details?: any): ApiError {
    return new ApiError(404, message, details);
  }

  static internal(message: string, details?: any): ApiError {
    return new ApiError(500, message, details);
  }

  static conflict(message: string, details?: any): ApiError {
    return new ApiError(409, message, details);
  }
}

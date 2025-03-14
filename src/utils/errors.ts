import { ValidationError } from 'express-validator';

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'CONFIG_ERROR'
  | 'AUTH_ERROR'
  | 'NETWORK_ERROR'
  | 'TRANSACTION_ERROR'
  | 'WALLET_ERROR'
  | 'CONTRACT_ERROR'
  | 'NOT_FOUND'
  | 'OPERATION_ERROR'
  | 'INTERNAL_ERROR';

export interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: any;
  };
}

export class ApiError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(code: ErrorCode, message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ApiError';
  }

  public static fromValidationErrors(errors: ValidationError[]): ApiError {
    return new ApiError(
      'VALIDATION_ERROR',
      'Invalid request parameters',
      400,
      errors.map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value
      }))
    );
  }

  public static notFound(resource: string): ApiError {
    return new ApiError(
      'NOT_FOUND',
      `${resource} not found`,
      404
    );
  }

  public static unauthorized(message: string = 'Unauthorized'): ApiError {
    return new ApiError(
      'AUTH_ERROR',
      message,
      401
    );
  }

  public static forbidden(message: string = 'Forbidden'): ApiError {
    return new ApiError(
      'AUTH_ERROR',
      message,
      403
    );
  }

  public toResponse(): ErrorResponse {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        ...(this.details && { details: this.details })
      }
    };
  }
}

export const errorStatusCodes: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  CONFIG_ERROR: 500,
  AUTH_ERROR: 401,
  NETWORK_ERROR: 503,
  TRANSACTION_ERROR: 400,
  WALLET_ERROR: 500,
  CONTRACT_ERROR: 400,
  NOT_FOUND: 404,
  OPERATION_ERROR: 400,
  INTERNAL_ERROR: 500
};

export class TransactionError extends ApiError {
  constructor(message: string, details?: any) {
    super('TRANSACTION_ERROR', message, 400, details);
    this.name = 'TransactionError';
  }
}

export class WalletError extends ApiError {
  constructor(message: string, details?: any) {
    super('WALLET_ERROR', message, 400, details);
    this.name = 'WalletError';
  }
}

export class ContractError extends ApiError {
  constructor(message: string, details?: any) {
    super('CONTRACT_ERROR', message, 400, details);
    this.name = 'ContractError';
  }
}

export class NetworkError extends ApiError {
  constructor(message: string, details?: any) {
    super('NETWORK_ERROR', message, 503, details);
    this.name = 'NetworkError';
  }
}

export const handleError = (error: any) => {
  if (error instanceof ApiError) {
    return error;
  }

  // Handle network errors
  if (error.isAxiosError) {
    return new NetworkError(
      error.response?.data?.message || error.message,
      error.response?.data
    );
  }

  // Handle unexpected errors
  return new ApiError(
    'INTERNAL_ERROR',
    'An unexpected error occurred',
    500,
    process.env.NODE_ENV === 'development' ? error : undefined
  );
}; 
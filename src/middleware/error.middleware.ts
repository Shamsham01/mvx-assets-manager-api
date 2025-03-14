import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';
import { ApiError } from '../utils/errors';
import { logError } from '../utils/logger';
import { environmentService } from '../config/environment.config';

const env = environmentService.getConfig();

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error
  logError(error, req);

  // Handle validation errors
  if (Array.isArray(error) && error[0] instanceof ValidationError) {
    const apiError = ApiError.fromValidationErrors(error);
    return res.status(apiError.statusCode).json(apiError.toResponse());
  }

  // Handle known errors
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json(error.toResponse());
  }

  // Handle unknown errors
  const internalError = new ApiError(
    'INTERNAL_ERROR',
    env.isDevelopment ? error.message : 'An unexpected error occurred',
    500,
    env.isDevelopment ? {
      stack: error.stack,
      name: error.name
    } : undefined
  );

  return res.status(internalError.statusCode).json(internalError.toResponse());
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = ApiError.notFound('Route not found');
  res.status(error.statusCode).json(error.toResponse());
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 
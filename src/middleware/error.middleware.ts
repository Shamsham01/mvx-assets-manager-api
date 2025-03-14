import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError, handleError } from '../utils/errors';
import logger from '../utils/logger';
import { environmentService } from '../config/environment.config';

const env = environmentService.getConfig();

// Handle 404 errors
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route not found: ${req.method} ${req.path}`
    }
  });
};

// Global error handler
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Uncaught error:', err);
  
  // Handle validation errors
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid JSON payload'
      }
    });
  }
  
  // Handle expected errors
  const errorResponse = handleError(err);
  
  res.status(getStatusCode(errorResponse.error.code)).json(errorResponse);
};

// Get HTTP status code based on error code
const getStatusCode = (errorCode: string): number => {
  const statusMap: Record<string, number> = {
    'VALIDATION_ERROR': 400,
    'UNAUTHORIZED': 401,
    'NOT_FOUND': 404,
    'INTERNAL_ERROR': 500
  };
  
  return statusMap[errorCode] || 500;
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 
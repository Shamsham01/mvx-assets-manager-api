const { Request, Response, NextFunction } = require('express');
const { validationResult } = require('express-validator');
const { AppError, handleError } = require('../utils/errors');
const logger = require('../utils/logger');
const { environmentService } = require('../config/environment.config');

const env = environmentService.getConfig();

// Handle 404 errors
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success,
    error: {
      code: 'NOT_FOUND',
      message: `Route not found: ${req.method} ${req.path}`
    }
  });
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  logger.error('Uncaught error:', err);
  
  // Handle validation errors
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      success,
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
const getStatusCode = (errorCode) => {
  const statusMap = {
    'VALIDATION_ERROR': 400,
    'UNAUTHORIZED': 401,
    'NOT_FOUND': 404,
    'INTERNAL_ERROR': 500
  };
  
  return statusMap[errorCode] || 500;
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 
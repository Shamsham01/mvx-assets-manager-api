const { Request, Response, NextFunction } = require('express');
const { validationResult, ValidationError } = require('express-validator');

const handleValidationErrors = (
  req,
  res,
  next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request parameters',
        details: errors.array().map((error) => ({
          param: error.type === 'field' ? error.path : error.type,
          msg,
          value: error.type === 'field' ? error.value : undefined
        }))
      }
    });
  }
  next();
}; 
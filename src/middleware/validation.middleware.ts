import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError as ExpressValidationError } from 'express-validator';

export interface ValidationError {
  param: string;
  msg: string;
  value: any;
  location?: string;
}

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request parameters',
        details: errors.array().map((error: ExpressValidationError) => ({
          param: error.type === 'field' ? error.path : error.type,
          msg: error.msg,
          value: error.type === 'field' ? error.value : undefined
        }))
      }
    });
  }
  next();
}; 
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { AppError } from '../utils/errors';
import { configService } from '../config/config.service';

// API key authentication middleware
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const security = configService.getSecurity();
  const apiKey = req.headers[security.apiKeyHeader.toLowerCase()];

  if (!apiKey || !security.apiKeys.includes(apiKey.toString())) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid API key'
      }
    });
  }
  
  next();
};

// Rate limiting middleware
export const rateLimiter = rateLimit({
  windowMs: configService.getSecurity().rateLimitWindow,
  max: configService.getSecurity().rateLimitMax,
  standardHeaders: true,
  message: {
    success: false,
    error: {
      code: 'UNAUTHORIZED',
      message: 'Too many requests, please try again later'
    }
  }
});

// Combined security middleware
export const securityMiddleware = [
  apiKeyAuth,
  rateLimiter
]; 
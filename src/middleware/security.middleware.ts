import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthError } from '../utils/errors';
import { configService } from '../config/config.service';

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const { security } = configService.getConfig();
  const apiKey = req.header(security.apiKeyHeader);

  if (!apiKey || !security.apiKeys.includes(apiKey)) {
    throw new AuthError('Invalid API key');
  }

  next();
};

export const rateLimiter = () => {
  const { security } = configService.getConfig();
  
  return rateLimit({
    windowMs: security.rateLimitWindow,
    max: security.rateLimitMax,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_ERROR',
        message: 'Too many requests, please try again later'
      }
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

export const securityMiddleware = [
  apiKeyAuth,
  rateLimiter()
]; 
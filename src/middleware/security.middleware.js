const { Request, Response, NextFunction } = require('express');
const rateLimit = require('express-rate-limit');
const { AppError } = require('../utils/errors');
const { configService } = require('../config/config.service');

// API key authentication middleware
const apiKeyAuth = (req, res, next) => {
  const security = configService.getSecurity();
  const apiKey = req.headers[security.apiKeyHeader.toLowerCase()];

  if (!apiKey || !security.apiKeys.includes(apiKey.toString())) {
    return res.status(401).json({
      success,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid API key'
      }
    });
  }
  
  next();
};

// Rate limiting middleware
const rateLimiter = rateLimit({
  windowMs: configService.getSecurity().rateLimitWindow,
  max: configService.getSecurity().rateLimitMax,
  standardHeaders,
  message: {
    success,
    error: {
      code: 'UNAUTHORIZED',
      message: 'Too many requests, please try again later'
    }
  }
});

// Combined security middleware
const securityMiddleware = [
  apiKeyAuth,
  rateLimiter
]; 
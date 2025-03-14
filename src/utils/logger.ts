import winston from 'winston';
import { environmentService } from '../config/environment.config';

const env = environmentService.getConfig();
const logLevel = process.env.LOG_LEVEL || 'info';
const logFormat = process.env.LOG_FORMAT || 'combined';

// Define log formats
const formats = {
  simple: winston.format.simple(),
  combined: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  pretty: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
    })
  )
};

// Create the logger instance
const logger = winston.createLogger({
  level: logLevel,
  format: formats[logFormat] || formats.combined,
  transports: [
    new winston.transports.Console({
      format: env.isDevelopment ? formats.pretty : formats.combined
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: formats.combined
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: formats.combined
    })
  ]
});

// Add request logging
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request processed', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent'),
      ip: req.ip
    });
  });
  next();
};

// Error logging utility
export const logError = (error: any, req?: any) => {
  const errorInfo: any = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    code: error.code
  };

  if (req) {
    errorInfo.method = req.method;
    errorInfo.url = req.url;
    errorInfo.query = req.query;
    errorInfo.body = req.body;
    errorInfo.userAgent = req.get('user-agent');
    errorInfo.ip = req.ip;
  }

  if (error.details) {
    errorInfo.details = error.details;
  }

  logger.error('Error occurred', errorInfo);
};

// Transaction logging utility
export const logTransaction = (transactionHash: string, details: any) => {
  logger.info('Transaction submitted', {
    hash: transactionHash,
    ...details
  });
};

// Application event logging
export const logEvent = (event: string, details?: any) => {
  logger.info(event, details);
};

export default logger; 
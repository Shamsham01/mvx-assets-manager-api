const winston = require('winston');
const { environmentService } = require('../config/environment.config');

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
  level,
  format,
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
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request processed', {
      method,
      url,
      status,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent'),
      ip: req.ip
    });
  });
  next();
};

// Error logging utility
const logError = (error, req?: any) => {
  const errorInfo = {
    name,
    message,
    stack,
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
const logTransaction = (transactionHash, details) => {
  logger.info('Transaction submitted', {
    hash,
    ...details
  });
};

// Application event logging
const logEvent = (event, details?: any) => {
  logger.info(event, details);
};

module.exports = logger; 
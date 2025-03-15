"use strict";

// Core dependencies
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const { rateLimit } = require('express-rate-limit');
const packageJson = require('./package.json');

// Project imports
const { configService } = require('./src/config/config.service');
const { walletManager } = require('./src/utils/wallet');
const { securityMiddleware } = require('./src/middleware/security.middleware');
const { swaggerSpec } = require('./src/config/swagger');
const { errorHandler, notFoundHandler } = require('./src/middleware/error.middleware');
const { requestLogger } = require('./src/utils/logger');
const logger = require('./src/utils/logger');

// Import routes
const esdtRoutes = require('./src/routes/esdt.routes');
const nftRoutes = require('./src/routes/nft.routes');
const sftRoutes = require('./src/routes/sft.routes');
const metaEsdtRoutes = require('./src/routes/meta-esdt.routes');
const utilsRoutes = require('./src/routes/utils.routes');
const accountRoutes = require('./src/routes/account.routes');
const authRoutes = require('./src/routes/auth.routes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 900000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Add request logging
app.use(requestLogger);

// Routes
app.use('/authorization', authRoutes);
app.use('/api/v1/esdt', securityMiddleware, esdtRoutes);
app.use('/api/v1/nft', securityMiddleware, nftRoutes);
app.use('/api/v1/sft', securityMiddleware, sftRoutes);
app.use('/api/v1/meta-esdt', securityMiddleware, metaEsdtRoutes);
app.use('/api/v1/utils', securityMiddleware, utilsRoutes);
app.use('/api/v1/account', securityMiddleware, accountRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Handle 404 errors
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// Initialize wallet and start server
const startServer = async () => {
  try {
    await walletManager.initialize();
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
      logger.info(`Environment: ${configService.getEnvironment()}`);
      const network = configService.getNetwork();
      logger.info(`Network: ${network.chainId === 'T' || network.ChainID === 'T' ? 'Testnet' : 'Mainnet'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', { reason, promise });
  process.exit(1);
});

startServer();

// Export for testing purposes
module.exports = { app }; 
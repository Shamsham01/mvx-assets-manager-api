#!/usr/bin/env node

/**
 * Comprehensive module fixer for TypeScript to JavaScript conversion
 * This script will identify specific problem modules and apply targeted fixes
 */

const fs = require('fs');
const path = require('path');

console.log('Starting comprehensive module fixes...');

// Define a list of modules that need special handling
const specialModules = [
  {
    path: 'src/utils/wallet.js',
    fix: fixWalletModule
  },
  {
    path: 'src/config/config.service.js',
    fix: fixConfigServiceModule
  },
  {
    path: 'src/utils/errors.js',
    fix: fixErrorsModule
  },
  {
    path: 'src/middleware/error.middleware.js',
    fix: fixErrorMiddlewareModule
  },
  {
    path: 'src/middleware/security.middleware.js',
    fix: fixSecurityMiddlewareModule
  }
];

// Process all special modules
for (const module of specialModules) {
  const modulePath = path.join(__dirname, module.path);
  if (fs.existsSync(modulePath)) {
    console.log(`Applying special fix to: ${modulePath}`);
    module.fix(modulePath);
  } else {
    console.log(`Module not found: ${modulePath}`);
  }
}

// Fix wallet.js
function fixWalletModule(filePath) {
  const content = `"use strict";

const fs = require('fs');
const path = require('path');
const { UserSigner } = require('@multiversx/sdk-wallet');
const { configService } = require('../config/config.service');

class WalletManager {
  constructor() {
    this.walletPem = null;
    this.signer = null;
    this.address = null;
  }

  async initialize() {
    try {
      // Get the path to the PEM file
      const pemPath = process.env.PRIVATE_KEY 
        ? process.env.PRIVATE_KEY 
        : path.join(configService.getPemPath(), 'wallet.pem');
      
      console.log(\`Using wallet PEM from: \${typeof pemPath === 'string' && pemPath.includes('/') ? pemPath : 'environment variable'}\`);
      
      // Load the PEM content
      this.walletPem = process.env.PRIVATE_KEY 
        ? process.env.PRIVATE_KEY 
        : fs.readFileSync(pemPath, { encoding: 'utf8' });
      
      // Create a UserSigner
      this.signer = UserSigner.fromPem(this.walletPem);
      
      // Get the wallet address
      this.address = this.signer.getAddress().bech32();
      
      console.log(\`Wallet initialized with address: \${this.address}\`);
      
      return this.address;
    } catch (error) {
      console.error('Failed to initialize wallet:', error);
      throw error;
    }
  }

  getSigner() {
    if (!this.signer) {
      throw new Error('Wallet not initialized. Call initialize() first.');
    }
    return this.signer;
  }

  getAddress() {
    if (!this.address) {
      throw new Error('Wallet not initialized. Call initialize() first.');
    }
    return this.address;
  }
}

// Create a singleton instance
const walletManager = new WalletManager();

// Export as CommonJS module
module.exports = {
  walletManager
};`;

  fs.writeFileSync(filePath, content);
  console.log(`Fixed wallet module: ${filePath}`);
}

// Fix config.service.js
function fixConfigServiceModule(filePath) {
  const content = `"use strict";

// Define NetworkConfig
const NetworkConfig = {
  chainId: '',
  ChainID: '',
  MinGasLimit: 50000,
  MinGasPrice: 1000000000,
  GasPerDataByte: 1500
};

// Simple normalize function
const normalizeNetworkConfig = (config) => {
  // Ensure both camelCase and PascalCase properties exist
  if (config.chainId && !config.ChainID) config.ChainID = config.chainId;
  if (!config.chainId && config.ChainID) config.chainId = config.ChainID;
  
  if (config.minGasLimit && !config.MinGasLimit) config.MinGasLimit = config.minGasLimit;
  if (!config.minGasLimit && config.MinGasLimit) config.minGasLimit = config.MinGasLimit;
  
  if (config.minGasPrice && !config.MinGasPrice) config.MinGasPrice = config.minGasPrice;
  if (!config.minGasPrice && config.MinGasPrice) config.minGasPrice = config.MinGasPrice;
  
  if (config.gasPerDataByte && !config.GasPerDataByte) config.GasPerDataByte = config.gasPerDataByte;
  if (!config.gasPerDataByte && config.GasPerDataByte) config.gasPerDataByte = config.GasPerDataByte;
  
  return config;
};

// ConfigService class
class ConfigService {
  constructor() {
    this.config = {
      api: {
        provider: process.env.API_PROVIDER || 'https://devnet-api.multiversx.com',
      },
      network: {
        ...NetworkConfig,
        chainId: process.env.CHAIN === 'mainnet' ? '1' : 'D',
        ChainID: process.env.CHAIN === 'mainnet' ? '1' : 'D',
        name: process.env.CHAIN || 'devnet',
        shortId: process.env.CHAIN === 'mainnet' ? 'mg' : 'd',
        egldLabel: 'xEGLD',
        decimals: 18,
        egldDenomination: '1000000000000000000',
      },
      wallets: {
        pemPath: process.env.PEM_PATH || './wallets',
      },
      security: {
        jwtSecret: process.env.JWT_SECRET || 'your-default-jwt-secret',
        jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
        apiKey: process.env.API_KEY || 'default-api-key',
      }
    };
  }

  // Get current environment
  getEnvironment() {
    return process.env.NODE_ENV || 'development';
  }

  // Get API provider
  getApiProvider() {
    return this.config.api.provider;
  }

  // Get network config
  getNetwork() {
    return normalizeNetworkConfig(this.config.network);
  }

  // Get PEM path
  getPemPath() {
    return this.config.wallets.pemPath;
  }

  // Get security config
  getSecurity() {
    return this.config.security;
  }

  // Get JWT secret
  getJwtSecret() {
    return this.config.security.jwtSecret;
  }

  // Get JWT expiration time
  getJwtExpiresIn() {
    return this.config.security.jwtExpiresIn;
  }

  // Get API key
  getApiKey() {
    return this.config.security.apiKey;
  }
}

// Create singleton instance
const configService = new ConfigService();

// Export as CommonJS module
module.exports = {
  configService,
  NetworkConfig,
  normalizeNetworkConfig
};`;

  fs.writeFileSync(filePath, content);
  console.log(`Fixed config service module: ${filePath}`);
}

// Fix errors.js
function fixErrorsModule(filePath) {
  // Read current content
  const currentContent = fs.readFileSync(filePath, 'utf8');
  
  // Fix only if it has TypeScript syntax
  if (currentContent.includes('class AppError extends Error {')) {
    const content = `"use strict";

// Base error class for application
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Export errors
module.exports = {
  AppError
};`;

    fs.writeFileSync(filePath, content);
    console.log(`Fixed errors module: ${filePath}`);
  } else {
    console.log(`No TypeScript syntax found in errors module, skipping.`);
  }
}

// Fix error middleware
function fixErrorMiddlewareModule(filePath) {
  // Read current content
  const currentContent = fs.readFileSync(filePath, 'utf8');
  
  // Fix only if it has TypeScript syntax
  if (currentContent.includes('private') || currentContent.includes('public') || currentContent.includes(': ')) {
    // Create a simplified version based on the original
    let content = currentContent;
    
    // Remove TypeScript-specific syntax
    content = content.replace(/(\s+)(private|public|protected)(\s+)/g, '$1');
    content = content.replace(/:\s*[A-Za-z0-9_<>[\]|,\s.]+\s*([,)])/g, '$1');
    content = content.replace(/:\s*[A-Za-z0-9_<>[\]|,\s.]+\s*=/g, ' =');
    content = content.replace(/:\s*[A-Za-z0-9_<>[\]|,\s.]+\s*{/g, ' {');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed error middleware module: ${filePath}`);
  } else {
    console.log(`No TypeScript syntax found in error middleware, skipping.`);
  }
}

// Fix security middleware
function fixSecurityMiddlewareModule(filePath) {
  // Read current content
  const currentContent = fs.readFileSync(filePath, 'utf8');
  
  // Fix only if it has TypeScript syntax
  if (currentContent.includes('private') || currentContent.includes('public') || currentContent.includes(': ')) {
    // Create a simplified version based on the original
    let content = currentContent;
    
    // Remove TypeScript-specific syntax
    content = content.replace(/(\s+)(private|public|protected)(\s+)/g, '$1');
    content = content.replace(/:\s*[A-Za-z0-9_<>[\]|,\s.]+\s*([,)])/g, '$1');
    content = content.replace(/:\s*[A-Za-z0-9_<>[\]|,\s.]+\s*=/g, ' =');
    content = content.replace(/:\s*[A-Za-z0-9_<>[\]|,\s.]+\s*{/g, ' {');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed security middleware module: ${filePath}`);
  } else {
    console.log(`No TypeScript syntax found in security middleware, skipping.`);
  }
}

// Also process any files in build directory if they exist
const buildDir = path.join(__dirname, 'build/src');
if (fs.existsSync(buildDir)) {
  for (const module of specialModules) {
    const buildModulePath = path.join(buildDir, module.path.replace('src/', ''));
    if (fs.existsSync(buildModulePath)) {
      console.log(`Applying special fix to build version: ${buildModulePath}`);
      module.fix(buildModulePath);
    }
  }
}

console.log('Comprehensive module fixes completed!'); 
#!/usr/bin/env node

/**
 * Special fix script for config.service.js
 * Completely rewrites the file with proper JavaScript syntax
 */

const fs = require('fs');
const path = require('path');

console.log('Creating clean config.service.js file...');

const configServicePath = path.join(__dirname, 'src/config/config.service.js');

// Create a completely new version of config.service.js with proper JavaScript syntax
const newContent = `"use strict";

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

// Write the new content to the file
fs.writeFileSync(configServicePath, newContent);

console.log(`Successfully rewrote ${configServicePath} with clean JavaScript syntax`);

// Also check if there's a built version and fix that too
const buildConfigServicePath = path.join(__dirname, 'build/src/config/config.service.js');
if (fs.existsSync(buildConfigServicePath)) {
  fs.writeFileSync(buildConfigServicePath, newContent);
  console.log(`Also fixed build version at ${buildConfigServicePath}`);
}

console.log('Config service fix completed!'); 
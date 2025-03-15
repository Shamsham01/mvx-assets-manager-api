#!/usr/bin/env node

/**
 * Special fix script for security.middleware.js
 * Completely rewrites the file with proper JavaScript syntax
 */

const fs = require('fs');
const path = require('path');

console.log('Creating clean security.middleware.js file...');

const securityMiddlewarePath = path.join(__dirname, 'src/middleware/security.middleware.js');

// Create a completely new version of security.middleware.js with proper JavaScript syntax
const newContent = `"use strict";

const { AppError } = require('../utils/errors');
const { configService } = require('../config/config.service');

/**
 * Middleware to verify API key for secured routes
 */
const securityMiddleware = (req, res, next) => {
  try {
    // Get API key from request header
    const apiKey = req.headers['x-api-key'];
    
    // Check if API key is provided
    if (!apiKey) {
      throw new AppError('API key is required', 401);
    }
    
    // Check if API key is valid
    const configApiKey = configService.getApiKey();
    if (apiKey !== configApiKey) {
      throw new AppError('Invalid API key', 401);
    }
    
    // If all checks pass, proceed to the next middleware
    next();
  } catch (error) {
    // Pass error to the error handling middleware
    next(error);
  }
};

module.exports = {
  securityMiddleware
};`;

// Write the new content to the file
fs.writeFileSync(securityMiddlewarePath, newContent);

console.log(`Successfully rewrote ${securityMiddlewarePath} with clean JavaScript syntax`);

// Also check if there's a built version and fix that too
const buildPath = path.join(__dirname, 'build/src/middleware/security.middleware.js');
if (fs.existsSync(buildPath)) {
  fs.writeFileSync(buildPath, newContent);
  console.log(`Also fixed build version at ${buildPath}`);
}

console.log('Security middleware fix completed!'); 
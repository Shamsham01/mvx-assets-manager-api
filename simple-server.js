"use strict";

/**
 * Simple standalone Express server for MVX Assets Manager API
 * This is a simplified version that can be deployed directly on Render
 * without any TypeScript/build complexity.
 */

// Core dependencies
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());

// Simple health check route
app.get('/api/v1/utils/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    serverTime: new Date().toLocaleString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    network: process.env.NETWORK || 'mainnet'
  });
});

// Simple API key auth middleware
app.use('/api/v1', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid API key'
      }
    });
  }
  next();
});

// Example endpoint
app.get('/api/v1/status', (req, res) => {
  res.json({
    success: true,
    data: {
      message: "MVX Assets Manager API is running",
      ready: true,
      maintenance: false
    }
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Path ${req.path} not found`
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An internal server error occurred'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Network: ${process.env.NETWORK || 'mainnet'}`);
});

module.exports = app; 
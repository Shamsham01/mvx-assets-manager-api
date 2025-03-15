// CommonJS entry point
"use strict";

// Load the converted JS file
const app = require('../build/index.js');

// Re-export everything
module.exports = app; 
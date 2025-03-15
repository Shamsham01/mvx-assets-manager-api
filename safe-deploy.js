#!/usr/bin/env node

/**
 * Safe Deployment Script for TypeScript to JavaScript Conversion
 * This script scans for TypeScript syntax issues, fixes them, and prepares for deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting safe deployment process...');

// Step 1: Scan for TypeScript syntax issues
console.log('\n🔍 STEP 1: Scanning for TypeScript syntax issues...');
try {
  execSync('node scan-typescript-syntax.js', { stdio: 'inherit' });
  console.log('✅ Scan completed.');
} catch (error) {
  console.error('❌ Scan failed:', error.message);
  process.exit(1);
}

// Step 2: Apply comprehensive fixes
console.log('\n🔧 STEP 2: Applying comprehensive fixes...');
try {
  execSync('node fix-all-modules.js', { stdio: 'inherit' });
  console.log('✅ Fixes applied successfully.');
} catch (error) {
  console.error('❌ Fix process failed:', error.message);
  process.exit(1);
}

// Step 3: Verify all files are fixed
console.log('\n✓ STEP 3: Verifying all files are fixed...');
try {
  const result = execSync('node scan-typescript-syntax.js').toString();
  if (result.includes('No TypeScript syntax issues found')) {
    console.log('✅ Verification successful: No TypeScript syntax issues remain.');
  } else {
    console.error('❌ Verification failed: TypeScript syntax issues still present.');
    console.log('Running scan again with details:');
    execSync('node scan-typescript-syntax.js', { stdio: 'inherit' });
    
    // Ask if we should continue
    console.log('\n⚠️ Some TypeScript syntax issues remain. What would you like to do?');
    console.log('1. Proceed with deployment anyway (may cause runtime errors)');
    console.log('2. Abort deployment to fix remaining issues');
    console.log('\nTo proceed, run: node fix-all-modules.js && node index.js');
    console.log('To view issues details, run: node scan-typescript-syntax.js');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Verification failed:', error.message);
  process.exit(1);
}

// Step 4: Start the application
console.log('\n🚀 STEP 4: Starting the application...');
try {
  console.log('Application is ready to start!');
  console.log('Run "node index.js" to start the server.');
  console.log('\n✨ Safe deployment process completed successfully! ✨');
} catch (error) {
  console.error('❌ Failed to start the application:', error.message);
  process.exit(1);
} 
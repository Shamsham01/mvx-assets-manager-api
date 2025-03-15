#!/usr/bin/env node

/**
 * Index.js Fixer
 * This script ensures the main index.js file has no TypeScript syntax
 */

const fs = require('fs');
const path = require('path');

console.log('Fixing index.js...');

const indexPath = path.join(__dirname, 'index.js');
if (!fs.existsSync(indexPath)) {
  console.log('index.js not found. Skipping.');
  process.exit(0);
}

// Read index.js content
let content = fs.readFileSync(indexPath, 'utf8');
const originalContent = content;

// Remove shebang line if present
content = content.replace(/^#!.*\n/, '');

// Add use strict
if (!content.includes('"use strict"') && !content.includes("'use strict'")) {
  content = '"use strict";\n\n' + content;
}

// Fix common TypeScript patterns
const replacements = [
  // Fix optional parameters (req?: any) => (req = null)
  { pattern: /(\([\w\s,]*\w+)\s*\?\s*:\s*[A-Za-z0-9_<>[\]|,\s.]+(\s*[,)])/g, replacement: '$1 = null$2' },
  
  // Fix class fields with access modifiers and type annotations
  { pattern: /\s+(private|public|protected)\s+(\w+)(\s*:\s*[^;]+)?;/g, replacement: '' },
  
  // Fix method parameter type annotations
  { pattern: /(\([\w\s,]*)\s*:\s*[A-Za-z0-9_<>[\]|,\s.]+(\s*[,)])/g, replacement: '$1$2' },
  
  // Fix method return type annotations
  { pattern: /\)\s*:\s*[A-Za-z0-9_<>[\]|,\s.]+\s*{/g, replacement: ') {' },
  
  // Fix variable type annotations
  { pattern: /(\w+)\s*:\s*[A-Za-z0-9_<>[\]|,\s.]+\s*=/g, replacement: '$1 =' },
  
  // Fix interface definitions
  { pattern: /\s*interface\s+\w+\s*{[\s\S]*?}/g, replacement: '' },
  
  // Fix type definitions
  { pattern: /\s*type\s+\w+\s*=.*?;/g, replacement: '' },
  
  // Fix enum definitions
  { pattern: /\s*enum\s+\w+\s*{[\s\S]*?}/g, replacement: '' },
  
  // Remove any remaining type assertions
  { pattern: /as\s+[A-Za-z0-9_<>[\]|,\s.]+/g, replacement: '' },
  
  // Fix type imports
  { pattern: /import\s+{\s*(.*?)type\s+(.*?)}\s+from/g, replacement: 'import { $1$2 } from' },
  
  // Remove generic type parameters
  { pattern: /<[A-Za-z0-9_,\s]+>/g, replacement: '' }
];

// Apply all replacements
replacements.forEach(({ pattern, replacement }) => {
  content = content.replace(pattern, replacement);
});

// Add code to detect and fix import issues at runtime
const importFixCode = `
// Runtime fixes for module imports
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  if (err.code === 'ERR_REQUIRE_ESM') {
    console.error('This appears to be an ES Module import error. Please check your imports and ensure they use require().');
  }
  process.exit(1);
});

`;

// Add the import fix code after 'use strict' but before the rest of the content
content = content.replace(/"use strict";\n\n/, `"use strict";\n\n${importFixCode}`);

// Write back if changed
if (content !== originalContent) {
  fs.writeFileSync(indexPath, content);
  console.log(`Fixed index.js successfully.`);
} else {
  console.log(`No TypeScript syntax found in index.js.`);
}

console.log('Index.js fix completed!'); 
#!/usr/bin/env node

/**
 * Comprehensive JavaScript syntax fixer
 * Fixes TypeScript-specific syntax in converted JavaScript files
 */

const fs = require('fs');
const path = require('path');

console.log('Starting comprehensive JavaScript syntax fixes...');

// Process all JS files in a directory recursively
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      fixJavaScriptFile(fullPath);
    }
  }
}

// Fix TypeScript artifacts in a JavaScript file
function fixJavaScriptFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Fix class fields with access modifiers and type annotations
  content = content.replace(/\s+(private|public|protected)\s+(\w+)(\s*:\s*[^;]+)?;/g, 
    (match, modifier, name) => {
      // Convert to constructor assignment
      return ``;  // Remove field declaration from class body
    });
  
  // Fix method parameter type annotations
  content = content.replace(/(\([\w\s,]*)\s*:\s*[A-Za-z0-9_<>[\]|,\s.]+(\s*[,)])/g, '$1$2');
  
  // Fix method return type annotations
  content = content.replace(/\)\s*:\s*[A-Za-z0-9_<>[\]|,\s.]+\s*{/g, ') {');
  
  // Fix constructor parameter properties
  content = content.replace(/constructor\s*\(\s*((?:private|public|protected)\s+\w+\s*:\s*[^,)]+,?\s*)+\)/g,
    (match) => {
      // Extract parameter names without modifiers and types
      const params = match.match(/(?:private|public|protected)\s+(\w+)\s*:[^,)]+/g) || [];
      const paramNames = params.map(p => p.replace(/(?:private|public|protected)\s+(\w+)\s*:[^,)]+/, '$1'));
      
      // Create a clean constructor with just the parameter names
      return `constructor(${paramNames.join(', ')})`;
    });
  
  // Generate constructor assignments for removed class fields
  const classMatches = content.match(/class\s+(\w+)(?:\s+extends\s+(\w+))?\s*{([^}]*)}/g) || [];
  
  for (const classMatch of classMatches) {
    const className = classMatch.match(/class\s+(\w+)/)[1];
    const classBody = classMatch.match(/{([^}]*)}/)[1];
    
    // Find removed fields (we need to add these to the constructor)
    const removedFields = originalContent.match(/\s+(private|public|protected)\s+(\w+)(\s*:\s*[^;]+)?;/g) || [];
    const fieldNames = removedFields.map(f => f.match(/\s+(private|public|protected)\s+(\w+)/)[2]);
    
    if (fieldNames.length > 0) {
      // Check if there's a constructor
      const hasConstructor = classBody.includes('constructor');
      
      if (hasConstructor) {
        // Add field assignments to existing constructor
        content = content.replace(/constructor\([^)]*\)\s*{/, (match) => {
          return match + '\n    ' + fieldNames.map(name => `this.${name} = ${name};`).join('\n    ');
        });
      } else {
        // Create a new constructor
        const constructorCode = `
  constructor(${fieldNames.join(', ')}) {
    ${fieldNames.map(name => `this.${name} = ${name};`).join('\n    ')}
  }`;
        
        // Insert constructor after class declaration
        content = content.replace(new RegExp(`class\\s+${className}(?:\\s+extends\\s+\\w+)?\\s*{`), 
          (match) => match + constructorCode);
      }
    }
  }
  
  // Fix remaining type annotations (variable declarations)
  content = content.replace(/(\w+)\s*:\s*[A-Za-z0-9_<>[\]|,\s.]+\s*=/g, '$1 =');
  
  // Handle NetworkConfig import specifically for config.service.js
  if (filePath.endsWith('config.service.js')) {
    // Add a special fix for the config.service.js file
    content = fixConfigService(content);
  }
  
  // Write the fixed content back to the file if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed TypeScript syntax in: ${filePath}`);
  }
}

// Special fix for config.service.js
function fixConfigService(content) {
  // Fix Class property syntax
  content = content.replace(/class\s+ConfigService\s*{[^{]*{/g, `class ConfigService {
  constructor() {
    this.config = {}; // Initialize config object
  }`);
  
  // Remove any TypeScript interface definitions
  content = content.replace(/interface\s+Config\s*{[\s\S]*?}/g, '');
  
  // Ensure NetworkConfig is properly defined
  if (!content.includes('const NetworkConfig =')) {
    content = `// Define NetworkConfig directly
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

` + content;
  }
  
  return content;
}

// Start processing the src directory
const srcDir = path.join(__dirname, 'src');
if (fs.existsSync(srcDir)) {
  console.log(`Processing source directory: ${srcDir}`);
  processDirectory(srcDir);
} else {
  console.log(`Source directory not found: ${srcDir}`);
}

console.log('JavaScript syntax fixes completed!'); 
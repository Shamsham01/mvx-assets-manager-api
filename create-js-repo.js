#!/usr/bin/env node

/**
 * Complete repository rewriter
 * This script will create a pure JavaScript version of the entire codebase
 * without any TypeScript artifacts or conversion issues.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Creating pure JavaScript version of the repository...');

// Directory setup
const SOURCE_DIR = 'src';
const TARGET_DIR = 'js-build';

// Create target directory if it doesn't exist
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Clean target directory
if (fs.existsSync(TARGET_DIR)) {
  const files = fs.readdirSync(TARGET_DIR);
  for (const file of files) {
    const filePath = path.join(TARGET_DIR, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      fs.rmSync(filePath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(filePath);
    }
  }
}

// Helper function to create directory if it doesn't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Helper function to read the source directory recursively and process each file
function processDirectory(sourceDir, targetDir) {
  ensureDirectoryExists(targetDir);
  
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    
    if (entry.isDirectory()) {
      const targetSubDir = path.join(targetDir, entry.name);
      processDirectory(sourcePath, targetSubDir);
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      const targetPath = path.join(targetDir, entry.name.replace('.ts', '.js'));
      convertTsToJs(sourcePath, targetPath);
    } else if (entry.isFile() && !entry.name.endsWith('.d.ts')) {
      // Copy non-TypeScript files (except declaration files)
      const targetPath = path.join(targetDir, entry.name);
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

// Special case file fixes
const specialCaseFixes = {
  'index.ts': (content) => {
    // Fix direct package.json import
    content = content.replace(/import packageJson from ['"]\.\.\/package\.json['"]/g, 
      "const packageJson = require('../package.json')");
    
    // Calculate rate limiting value directly
    content = content.replace(
      /windowMs: 15 \* 60 \* 1000,/g, 
      "windowMs: 900000, // 15 minutes"
    );
    
    // Remove shebang line if present (first line)
    if (content.startsWith('#!/usr/bin/env node')) {
      content = content.replace('#!/usr/bin/env node', '// JavaScript version');
    }
    
    return content;
  }
};

// Helper function to convert TS to JS
function convertTsToJs(sourcePath, targetPath) {
  console.log(`Converting ${sourcePath} to ${targetPath}`);
  
  // Read the file content
  let content = fs.readFileSync(sourcePath, 'utf8');
  const fileName = path.basename(sourcePath);
  
  // Remove shebang line if present
  if (content.startsWith('#!/usr/bin/env node')) {
    content = content.replace('#!/usr/bin/env node', '// JavaScript version');
  }
  
  // Apply special case fixes if any
  if (specialCaseFixes[fileName]) {
    content = specialCaseFixes[fileName](content);
  }
  
  // Fix common module imports
  content = content.replace(/import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g, 
    "const $1 = require('$2')");
  
  // Fix named imports
  content = content.replace(/import\s+{\s*([\w\s,]+)\s*}\s+from\s+['"]([^'"]+)['"]/g, 
    (match, imports, modulePath) => {
      const importItems = imports.split(',').map(i => i.trim());
      return `const { ${importItems.join(', ')} } = require('${modulePath}')`;
    });
  
  // Fix default imports
  content = content.replace(/import\s+([A-Za-z0-9_]+)\s+from\s+['"]([^'"]+)['"]/g, 
    "const $1 = require('$2')");
  
  // Remove type imports
  content = content.replace(/import\s+type.*?;/g, '');
  
  // Fix import statements with .ts extensions
  content = content.replace(/from ['"](.*)\.ts['"]/g, "from '$1.js'");
  content = content.replace(/require\(['"](.*)\.ts['"]\)/g, "require('$1.js')");
  
  // Replace network config properties
  content = content.replace(/minGasLimit/g, 'MinGasLimit');
  content = content.replace(/minGasPrice/g, 'MinGasPrice');
  content = content.replace(/gasPerDataByte/g, 'GasPerDataByte');
  
  // Replace error classes if needed
  content = content.replace(/ApiError/g, 'AppError');
  
  // Remove TypeScript interface and type declarations
  content = content.replace(/^\s*export\s+(interface|type)\s+.*?{[\s\S]*?}(?=\n|\r|$)/gm, '');
  content = content.replace(/^\s*(interface|type)\s+.*?{[\s\S]*?}(?=\n|\r|$)/gm, '');
  
  // Remove type parameters from generics
  content = content.replace(/<[^<>]*>/g, '');
  
  // Remove function return type annotations
  content = content.replace(/\):\s*[A-Za-z0-9_<>[\],\s|]+\s*=>/g, ') =>');
  content = content.replace(/\):\s*[A-Za-z0-9_<>[\],\s|]+\s*{/g, ') {');
  
  // Remove parameter type annotations
  content = content.replace(/(\(|\s)([A-Za-z0-9_]+):\s*[A-Za-z0-9_<>[\]|,\s.]+(\s*[,)])/g, '$1$2$3');
  
  // Remove variable type annotations
  content = content.replace(/:\s*[A-Za-z0-9_<>[\],\s|]+\s*=/g, ' =');
  
  // Fix class extends with generics
  content = content.replace(/extends\s+[A-Za-z0-9_]+<.*?>/g, (match) => {
    return match.replace(/<.*?>/, '');
  });
  
  // Convert export statements to CommonJS exports
  content = content.replace(/export\s+default\s+([A-Za-z0-9_]+);?/g, 'module.exports = $1;');
  content = content.replace(/export\s+{\s*([\w\s,]+)\s*};?/g, (match, exports) => {
    const exportItems = exports.split(',').map(e => {
      const trimmed = e.trim();
      return `  ${trimmed}: ${trimmed}`;
    });
    return `module.exports = {\n${exportItems.join(',\n')}\n};`;
  });
  
  // Fix exported const/let/function declarations
  content = content.replace(/export\s+(const|let|function|class)\s+([A-Za-z0-9_]+)/g, '$1 $2');
  
  // Convert ES imports to require for more compatibility
  if (sourcePath.includes('index.ts')) {
    // Replace imports with require
    content = content.replace(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g, 
      "const $1 = require('$2')");
    content = content.replace(/import\s+{\s*([\w\s,]+)\s*}\s+from\s+['"]([^'"]+)['"]/g, 
      (match, imports, path) => {
        const importList = imports.split(',').map(i => i.trim());
        return `const { ${importList.join(', ')} } = require('${path}')`;
      });
  }
  
  // Final pass to clean up any remaining issues
  content = cleanupRemainingIssues(content);
  
  // Write the modified content to target file
  fs.writeFileSync(targetPath, content);
}

// Clean up any remaining TypeScript-specific issues
function cleanupRemainingIssues(content) {
  // Remove any remaining type assertions
  content = content.replace(/as\s+[A-Za-z0-9_<>[\]|,\s.]+/g, '');
  
  // Clean up multiple exports if introduced by our regexes
  if (content.match(/module\.exports\s*=.*module\.exports\s*=/s)) {
    // If we have multiple module.exports, combine them
    const matches = content.match(/module\.exports\s*=\s*([^;]*);/g) || [];
    if (matches.length > 1) {
      // Remove all module.exports statements
      content = content.replace(/module\.exports\s*=\s*([^;]*);/g, '');
      
      // Add a single combined module.exports at the end
      content += '\n\nmodule.exports = {\n';
      for (let i = 0; i < matches.length; i++) {
        const exportedValue = matches[i].match(/module\.exports\s*=\s*([^;]*);/)[1];
        // If it's an object, merge its properties
        if (exportedValue.trim().startsWith('{') && exportedValue.trim().endsWith('}')) {
          const inner = exportedValue.trim().slice(1, -1).trim();
          if (inner) {
            content += `  ${inner},\n`;
          }
        } else {
          // Otherwise just export the value with a default name
          content += `  export${i + 1}: ${exportedValue},\n`;
        }
      }
      content += '};\n';
    }
  }
  
  return content;
}

// Process the source directory to the target directory
processDirectory(SOURCE_DIR, TARGET_DIR);

// Copy package.json with CommonJS configuration
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
packageJson.type = 'commonjs';
packageJson.main = 'index.js';
packageJson.engines = { "node": "18.19.1" };

// Update scripts for JS build
packageJson.scripts = {
  ...packageJson.scripts,
  "start": "node index.js",
  "dev": "nodemon index.js"
};

// Write the package.json to the target directory
fs.writeFileSync(path.join(TARGET_DIR, 'package.json'), JSON.stringify(packageJson, null, 2));

// Create index.js in the root to require the actual app
const indexContent = `// Main entry point
"use strict";

// Load the app
const { app } = require('./src/index.js');

// Export the app
module.exports = app;
`;
fs.writeFileSync(path.join(TARGET_DIR, 'index.js'), indexContent);

// Create .nvmrc file
fs.writeFileSync(path.join(TARGET_DIR, '.nvmrc'), '18.19.1');

// Create .node-version file
fs.writeFileSync(path.join(TARGET_DIR, '.node-version'), '18.19.1');

// Create nodemon.json config
const nodemonConfig = {
  "watch": ["."],
  "ext": "js,json",
  "ignore": ["node_modules/"],
  "exec": "node index.js"
};
fs.writeFileSync(path.join(TARGET_DIR, 'nodemon.json'), JSON.stringify(nodemonConfig, null, 2));

console.log(`JavaScript version created in ${TARGET_DIR} directory!`);
console.log(`To use it:`);
console.log(`1. Copy all files from ${TARGET_DIR} to your project root`);
console.log(`2. Run 'npm install'`);
console.log(`3. Start with 'npm start'`); 
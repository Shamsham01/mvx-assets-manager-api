const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all TypeScript files
function findTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
      findTsFiles(filePath, fileList);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Convert TypeScript to JavaScript
function convertTsToJs(filePath) {
  console.log(`Converting: ${filePath}`);
  
  // Read file content
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove shebang line if present
  if (content.startsWith('#!/usr/bin/env node')) {
    content = content.replace('#!/usr/bin/env node', '"use strict";');
  }
  
  // Remove TypeScript-specific syntax
  
  // Fix imports/exports
  content = content.replace(/import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g, 
    "const $1 = require('$2')");
  
  content = content.replace(/import\s+{\s*([\w\s,]+)\s*}\s+from\s+['"]([^'"]+)['"]/g, 
    (match, imports, modulePath) => {
      const importItems = imports.split(',').map(i => i.trim());
      return `const { ${importItems.join(', ')} } = require('${modulePath.replace('.ts', '')}')`;
    });
  
  content = content.replace(/import\s+([A-Za-z0-9_]+)\s+from\s+['"]([^'"]+)['"]/g, 
    "const $1 = require('$2')");
  
  // Remove type imports
  content = content.replace(/import\s+type.*?;/g, '');
  
  // Fix path extensions
  content = content.replace(/from ['"](.*)\.ts['"]/g, "from '$1'");
  content = content.replace(/require\(['"](.*)\.ts['"]\)/g, "require('$1')");
  
  // Remove interfaces and type definitions
  content = content.replace(/^\s*export\s+(interface|type)\s+.*?{[\s\S]*?}(?=\n|\r|$)/gm, '');
  content = content.replace(/^\s*(interface|type)\s+.*?{[\s\S]*?}(?=\n|\r|$)/gm, '');
  
  // Remove type parameters from generics
  content = content.replace(/<[^<>]*>/g, '');
  
  // Remove return type annotations
  content = content.replace(/\):\s*[A-Za-z0-9_<>[\],\s|]+\s*=>/g, ') =>');
  content = content.replace(/\):\s*[A-Za-z0-9_<>[\],\s|]+\s*{/g, ') {');
  
  // Remove parameter type annotations
  content = content.replace(/(\(|\s)([A-Za-z0-9_]+):\s*[A-Za-z0-9_<>[\]|,\s.]+(\s*[,)])/g, '$1$2$3');
  
  // Remove variable type annotations
  content = content.replace(/:\s*[A-Za-z0-9_<>[\],\s|]+\s*=/g, ' =');
  
  // Fix network config properties
  content = content.replace(/minGasLimit/g, 'MinGasLimit');
  content = content.replace(/minGasPrice/g, 'MinGasPrice');
  content = content.replace(/gasPerDataByte/g, 'GasPerDataByte');
  content = content.replace(/chainId(?!:)/g, 'ChainID');
  
  // Fix error classes
  content = content.replace(/ApiError/g, 'AppError');
  
  // Convert export statements
  content = content.replace(/export\s+default\s+([A-Za-z0-9_]+);?/g, 'module.exports = $1;');
  content = content.replace(/export\s+{\s*([\w\s,]+)\s*};?/g, (match, exports) => {
    const exportItems = exports.split(',').map(e => {
      const trimmed = e.trim();
      return `  ${trimmed}`;
    });
    return `module.exports = {\n${exportItems.join(',\n')}\n};`;
  });
  
  // Fix exported declarations
  content = content.replace(/export\s+(const|let|function|class)\s+([A-Za-z0-9_]+)/g, '$1 $2');
  
  // Remove any remaining type assertions
  content = content.replace(/as\s+[A-Za-z0-9_<>[\]|,\s.]+/g, '');
  
  // Get the JS file path
  const jsFilePath = filePath.replace('.ts', '.js');
  
  // Write converted content
  fs.writeFileSync(jsFilePath, content);
  
  // Delete the TypeScript file
  fs.unlinkSync(filePath);
  
  console.log(`Created: ${jsFilePath}`);
}

function updateConfigFiles() {
  console.log('Updating configuration files...');
  
  // Update package.json
  if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Set type to commonjs
    packageJson.type = 'commonjs';
    packageJson.main = 'index.js';
    
    // Update scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      "start": "node index.js",
      "dev": "nodemon index.js"
    };
    
    // Remove TypeScript dependencies
    const depsToRemove = [
      '@types/', 'typescript', 'ts-node'
    ];
    
    if (packageJson.dependencies) {
      Object.keys(packageJson.dependencies).forEach(dep => {
        if (depsToRemove.some(prefix => dep.startsWith(prefix))) {
          delete packageJson.dependencies[dep];
        }
      });
    }
    
    if (packageJson.devDependencies) {
      Object.keys(packageJson.devDependencies).forEach(dep => {
        if (depsToRemove.some(prefix => dep.startsWith(prefix))) {
          delete packageJson.devDependencies[dep];
        }
      });
    }
    
    // Write updated package.json
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  }
  
  // Update render.yaml
  if (fs.existsSync('render.yaml')) {
    let renderYaml = fs.readFileSync('render.yaml', 'utf8');
    
    // Update build command to skip TypeScript
    renderYaml = renderYaml.replace(/buildCommand:.*/, 'buildCommand: npm install');
    
    // Update start command
    renderYaml = renderYaml.replace(/startCommand:.*/, 'startCommand: node index.js');
    
    // Write updated render.yaml
    fs.writeFileSync('render.yaml', renderYaml);
  }
  
  // Create nodemon.json if it doesn't exist
  if (!fs.existsSync('nodemon.json')) {
    const nodemonConfig = {
      "watch": ["."],
      "ext": "js,json",
      "ignore": ["node_modules/"],
      "exec": "node index.js"
    };
    fs.writeFileSync('nodemon.json', JSON.stringify(nodemonConfig, null, 2));
  }
  
  // Remove TypeScript config files
  const tsConfigFiles = ['tsconfig.json', 'tsconfig.build.json'];
  for (const file of tsConfigFiles) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`Removed: ${file}`);
    }
  }
}

// Convert index.ts to index.js if needed
function ensureIndexJs() {
  if (fs.existsSync('src/index.ts') && !fs.existsSync('index.js')) {
    console.log('Creating root index.js...');
    
    const indexContent = '"use strict";\n\n// Load the app\nconst { app } = require(\'./src/index.js\');\n\n// Export the app\nmodule.exports = app;';
    fs.writeFileSync('index.js', indexContent);
  }
}

// Main conversion process
console.log('Starting TypeScript to JavaScript conversion...');

// Find all TypeScript files
const tsFiles = findTsFiles('.');
console.log(`Found ${tsFiles.length} TypeScript files to convert`);

// Convert each file
for (const file of tsFiles) {
  convertTsToJs(file);
}

// Update config files
updateConfigFiles();

// Ensure index.js exists
ensureIndexJs();

console.log('Conversion complete!');

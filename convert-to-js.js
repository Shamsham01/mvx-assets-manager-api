const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Converting TypeScript project to JavaScript...');

// Create build directory if it doesn't exist
if (!fs.existsSync('build')) {
  fs.mkdirSync('build', { recursive: true });
}

// Clean build directory
if (fs.existsSync('build')) {
  const files = fs.readdirSync('build');
  for (const file of files) {
    const filePath = path.join('build', file);
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
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    
    if (entry.isDirectory()) {
      const targetSubDir = path.join(targetDir, entry.name);
      ensureDirectoryExists(targetSubDir);
      processDirectory(sourcePath, targetSubDir);
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      const targetPath = path.join(targetDir, entry.name.replace('.ts', '.js'));
      convertTsToJs(sourcePath, targetPath);
    } else if (entry.isFile()) {
      // Copy non-TS files as is
      const targetPath = path.join(targetDir, entry.name);
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

// Helper function to convert TS to JS
function convertTsToJs(sourcePath, targetPath) {
  console.log(`Converting ${sourcePath} to ${targetPath}`);
  
  // Read the file content
  let content = fs.readFileSync(sourcePath, 'utf8');
  
  // Replace "ApiError" with "AppError"
  content = content.replace(/ApiError/g, 'AppError');
  
  // Replace network config properties
  content = content.replace(/minGasLimit/g, 'MinGasLimit');
  content = content.replace(/minGasPrice/g, 'MinGasPrice');
  content = content.replace(/gasPerDataByte/g, 'GasPerDataByte');
  
  // Remove TypeScript type annotations
  // Remove type imports
  content = content.replace(/import\s+type\s+.*?from\s+['"].*?['"]/g, '');
  
  // Remove interface and type declarations
  content = content.replace(/^\s*export\s+(interface|type)\s+.*?{[\s\S]*?}(?=\n)/gm, '');
  content = content.replace(/^\s*(interface|type)\s+.*?{[\s\S]*?}(?=\n)/gm, '');
  
  // Remove type parameters and return types
  content = content.replace(/<.*?>/g, '');
  content = content.replace(/: \w+(\[\])?/g, '');
  content = content.replace(/: \{ [^}]* \}/g, '');
  content = content.replace(/: \([^)]*\) =>/g, '=>');
  
  // Fix imports by removing .ts extensions
  content = content.replace(/from ['"](.*)\.ts['"]/g, "from '$1.js'");
  
  // Fix import statements with type assertions
  content = content.replace(/import\s*{.*?}\s*from/g, match => {
    return match.replace(/\s+as\s+\w+/g, '');
  });
  
  // Fix class declarations
  content = content.replace(/class\s+\w+\s+extends\s+\w+<.*?>/g, match => {
    return match.replace(/<.*?>/g, '');
  });
  
  // Fix function parameters
  content = content.replace(/\(([^)]*)\)(\s*:\s*\w+)?/g, (match, params) => {
    return `(${params.replace(/:\s*\w+(\[\])?/g, '').replace(/\s*\?\s*:/g, ':')})`;
  });
  
  // Write the modified content to target file
  fs.writeFileSync(targetPath, content);
}

// Process the src directory
processDirectory('src', 'build');

// Copy package.json to build directory
fs.copyFileSync('package.json', path.join('build', 'package.json'));

console.log('Conversion complete!'); 
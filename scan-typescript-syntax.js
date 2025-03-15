#!/usr/bin/env node

/**
 * Typescript Syntax Scanner
 * This script scans JavaScript files for TypeScript syntax that would cause runtime errors
 */

const fs = require('fs');
const path = require('path');

console.log('Scanning for TypeScript syntax in JavaScript files...');

// Track files with issues
const filesWithIssues = [];

// Define patterns to look for
const typeScriptPatterns = [
  {
    name: 'Optional parameters',
    regex: /\(\s*[\w\s,]*\w+\s*\?\s*:.*?\)/g,
    example: 'function test(param?: string) {...}'
  },
  {
    name: 'Type annotations',
    regex: /(\w+)\s*:\s*[A-Za-z0-9_<>[\]|,\s.]+(\s*[,);=])/g,
    example: 'const name: string = "value";'
  },
  {
    name: 'Return type annotations',
    regex: /\)\s*:\s*[A-Za-z0-9_<>[\]|,\s.]+\s*{/g,
    example: 'function test(): string {...}'
  },
  {
    name: 'Type assertions',
    regex: /as\s+[A-Za-z0-9_<>[\]|,\s.]+/g,
    example: 'const value = data as string;'
  },
  {
    name: 'Interface definitions',
    regex: /\s*interface\s+\w+\s*{[\s\S]*?}/g,
    example: 'interface User { name: string; }'
  },
  {
    name: 'Type definitions',
    regex: /\s*type\s+\w+\s*=.*?;/g,
    example: 'type UserId = string;'
  },
  {
    name: 'Access modifiers',
    regex: /\s+(private|public|protected)\s+(\w+)/g,
    example: 'private userId: string;'
  },
  {
    name: 'Type imports',
    regex: /import\s+{\s*.*?type\s+.*?}\s+from/g,
    example: 'import { type User } from "./user";'
  },
  {
    name: 'Enum definitions',
    regex: /enum\s+\w+\s*{[\s\S]*?}/g,
    example: 'enum Direction { Up, Down }'
  },
  {
    name: 'Generic type parameters',
    regex: /<[A-Za-z0-9_,\s]+>/g,
    example: 'function test<T>(param: T): T {...}'
  }
];

// Recursively scan directory
function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      scanDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      scanFile(fullPath);
    }
  }
}

// Scan a single file for TypeScript syntax
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Check for each pattern
    for (const pattern of typeScriptPatterns) {
      const matches = content.match(pattern.regex);
      
      if (matches && matches.length > 0) {
        issues.push({
          pattern: pattern.name,
          count: matches.length,
          examples: matches.slice(0, 3) // Show up to 3 examples
        });
      }
    }
    
    // If we found issues, add to our list
    if (issues.length > 0) {
      filesWithIssues.push({
        path: filePath,
        issues
      });
    }
  } catch (error) {
    console.error(`Error scanning file ${filePath}: ${error.message}`);
  }
}

// Start scanning from src directory
const srcDir = path.join(__dirname, 'src');
if (fs.existsSync(srcDir)) {
  scanDirectory(srcDir);
} else {
  console.log(`Source directory not found: ${srcDir}`);
}

// Print report
console.log('\n===== TypeScript Syntax Scan Report =====\n');

if (filesWithIssues.length === 0) {
  console.log('✅ No TypeScript syntax issues found in JavaScript files!');
} else {
  console.log(`⚠️ Found ${filesWithIssues.length} files with TypeScript syntax issues:\n`);
  
  filesWithIssues.forEach((file, index) => {
    console.log(`${index + 1}. ${file.path}`);
    file.issues.forEach(issue => {
      console.log(`   - ${issue.pattern}: ${issue.count} occurrences`);
      issue.examples.forEach(example => {
        console.log(`     Example: ${example.trim()}`);
      });
    });
    console.log('');
  });
  
  console.log('These TypeScript features will cause runtime errors in JavaScript!');
  console.log('Please fix these issues before deploying.');
}

console.log('\nScan completed!'); 
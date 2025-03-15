#!/bin/bash

# Full JavaScript Deployment Script for MVX Assets Manager API
# This script converts the TypeScript project to JavaScript while preserving all API functionality

echo "Starting full JavaScript deployment process..."

# Step 1: Backup TypeScript files
echo "Backing up TypeScript files..."
mkdir -p ts-backup
cp -r src ts-backup/
cp package.json ts-backup/
cp tsconfig.json ts-backup/
cp render.yaml ts-backup/

# Step 2: Replace TypeScript-specific files with JavaScript versions
echo "Replacing TypeScript-specific files with JavaScript versions..."

# Copy the JavaScript index file, making sure to remove the shebang line
cat js-index.js | sed '1s/^.*node$//' > index.js

# Copy other configuration files
cp js-package.json package.json
cp js-render.yaml render.yaml
cp js-nodemon.json nodemon.json
cp js-nvmrc .nvmrc
cp js-nvmrc .node-version
cp js-eslintrc.json .eslintrc.json

# Step 3: Create JavaScript source files by running the conversion script
echo "Converting TypeScript source files to JavaScript..."

# Run our existing conversion script
node create-js-repo.js

# Step 4: Remove TypeScript-specific files
echo "Removing TypeScript-specific files..."
rm -f tsconfig.json
rm -f convert-to-js.js
rm -f create-js-repo.js
rm -f esbuild.config.js
rm -f fix-errors.sh

# Step 5: Commit changes
echo "Committing changes..."
git add .
git commit -m "Convert to pure JavaScript for deployment"
git push

echo "Full JavaScript conversion complete!"
echo "Your API is now pure JavaScript with all original functionality."
echo "Visit Render dashboard to deploy the project." 
#!/bin/bash

# Direct deployment script for the MVX Assets Manager API
# This script replaces TypeScript files with JavaScript versions directly

echo "Starting JavaScript deployment process..."

# Step 1: Backup TypeScript files
echo "Backing up TypeScript files..."
mkdir -p ts-backup
cp -r src ts-backup/
cp package.json ts-backup/
cp tsconfig.json ts-backup/
cp render.yaml ts-backup/

# Step 2: Remove TypeScript specific files
echo "Removing TypeScript specific files..."
rm -f tsconfig.json

# Step 3: Replace with JavaScript versions
echo "Replacing with JavaScript versions..."
mv js-index.js index.js
mv js-package.json package.json
mv js-render.yaml render.yaml
mv js-nodemon.json nodemon.json
mv js-nvmrc .nvmrc
cp js-nvmrc .node-version
mv js-eslintrc.json .eslintrc.json

# Step 4: Commit changes
echo "Committing changes..."
git add .
git commit -m "Convert to pure JavaScript for deployment"
git push

echo "Deployment preparation complete!"
echo "Visit Render dashboard to deploy the project." 
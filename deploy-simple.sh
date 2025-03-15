#!/bin/bash

# Simple deployment script for MVX Assets Manager API
# This script replaces the complex TypeScript version with a simple JavaScript server

echo "Starting simple server deployment process..."

# Step 1: Create a new branch
echo "Creating a new branch for the simple server..."
git checkout -b simple-js-server

# Step 2: Remove TypeScript files
echo "Removing TypeScript files..."
rm -rf src
rm -f tsconfig.json
rm -f convert-to-js.js
rm -f create-js-repo.js
rm -f esbuild.config.js
rm -f fix-errors.sh
rm -f render.yaml

# Step 3: Add simple server files
echo "Adding simple server files..."
mv simple-server.js server.js
mv simple-package.json package.json
mv simple-render.yaml render.yaml
cp js-nvmrc .nvmrc
cp js-nvmrc .node-version

# Step 4: Create a simple README
echo "# MVX Assets Manager API - Simple Server" > README.md
echo "A simplified version of the MVX Assets Manager API." >> README.md
echo "## Running the server" >> README.md
echo "\`\`\`" >> README.md
echo "npm install" >> README.md
echo "npm start" >> README.md
echo "\`\`\`" >> README.md

# Step 5: Commit changes
echo "Committing changes..."
git add .
git commit -m "Simplified JavaScript server for deployment"
git push -u origin simple-js-server

echo "Simple server deployment preparation complete!"
echo "Create a new Render service using the 'simple-js-server' branch." 
#!/bin/bash

# Convert and deploy script for the MVX Assets Manager API
# This script converts the TypeScript project to JavaScript and prepares it for deployment

echo "Starting conversion process..."

# Step 1: Create directory structure for JavaScript files
mkdir -p js-build/src
mkdir -p js-build/src/config js-build/src/controllers js-build/src/egld js-build/src/esdt
mkdir -p js-build/src/meta-esdt js-build/src/middleware js-build/src/nft js-build/src/routes
mkdir -p js-build/src/services js-build/src/sft js-build/src/types js-build/src/utils

# Step 2: Copy JavaScript files
echo "Copying JavaScript configuration files..."
cp js-index.js js-build/index.js
cp js-package.json js-build/package.json
cp js-render.yaml js-build/render.yaml
cp js-nodemon.json js-build/nodemon.json
cp js-nvmrc js-build/.nvmrc
cp js-nvmrc js-build/.node-version
cp js-eslintrc.json js-build/.eslintrc.json

# Step 3: Run our existing script to convert TypeScript files
echo "Converting TypeScript files to JavaScript..."
cd js-build || exit 1
node ../create-js-repo.js

# Step 4: Prepare for deployment
echo "Preparing for deployment..."
git add .
git commit -m "Convert to pure JavaScript for deployment"
git push

echo "Conversion complete! The project is now ready for deployment."
echo "Visit Render dashboard to deploy the project." 
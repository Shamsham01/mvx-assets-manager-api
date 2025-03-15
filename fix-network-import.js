#!/usr/bin/env node

/**
 * Fix script for NetworkConfig import issue
 */

const fs = require('fs');
const path = require('path');

console.log('Fixing NetworkConfig import issue...');

// Fix config.service.js
const configServicePath = path.join(__dirname, 'src/config/config.service.js');
if (fs.existsSync(configServicePath)) {
  console.log(`Fixing ${configServicePath}`);
  let content = fs.readFileSync(configServicePath, 'utf8');
  
  // Replace the problematic import with a direct object definition
  content = content.replace(
    /const\s*{\s*NetworkConfig,\s*normalizeNetworkConfig\s*}\s*=\s*require\(['"]\.\.\/types\/network['"]\);/,
    `// Define NetworkConfig directly
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
};`
  );
  
  fs.writeFileSync(configServicePath, content);
}

// Remove the problematic .d.js file if it exists
const typesPath = path.join(__dirname, 'build/types/network.d.js');
if (fs.existsSync(typesPath)) {
  console.log(`Removing ${typesPath}`);
  fs.unlinkSync(typesPath);
}

console.log('Fix completed!'); 
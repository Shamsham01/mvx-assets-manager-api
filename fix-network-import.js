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
  
  // Read the entire file content
  let content = fs.readFileSync(configServicePath, 'utf8');
  
  // Check if the file contains the problematic import
  const hasNetworkImport = content.includes("require('../types/network')");
  
  if (hasNetworkImport) {
    console.log('Found network import, replacing with direct implementation...');
    
    // First, remove the original import line completely
    const lines = content.split('\n');
    const filteredLines = lines.filter(line => 
      !line.includes("require('../types/network')") &&
      !line.includes("NetworkConfig") &&
      !line.includes("normalizeNetworkConfig")
    );
    
    // Add our NetworkConfig implementation at the top of the file
    const networkConfigImpl = `// Define NetworkConfig directly
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
`;
    
    // Find a good position to insert our implementation - after the require statements
    let insertIndex = 0;
    for (let i = 0; i < filteredLines.length; i++) {
      if (filteredLines[i].includes('require(') || filteredLines[i].trim() === '') {
        insertIndex = i + 1;
      } else if (!filteredLines[i].startsWith('//') && !filteredLines[i].trim() === '') {
        break;
      }
    }
    
    // Insert our implementation
    filteredLines.splice(insertIndex, 0, networkConfigImpl);
    
    // Write the updated content back to the file
    fs.writeFileSync(configServicePath, filteredLines.join('\n'));
    console.log(`Updated ${configServicePath}`);
  } else {
    console.log('Network import not found, no changes needed');
  }
}

// Remove the problematic .d.js file if it exists
const typesPath = path.join(__dirname, 'build/types/network.d.js');
if (fs.existsSync(typesPath)) {
  console.log(`Removing ${typesPath}`);
  fs.unlinkSync(typesPath);
}

// Also check src/types directory for any network.js files
const srcTypesDir = path.join(__dirname, 'src/types');
if (fs.existsSync(srcTypesDir)) {
  const networkJsPath = path.join(srcTypesDir, 'network.js');
  if (fs.existsSync(networkJsPath)) {
    console.log(`Removing ${networkJsPath}`);
    fs.unlinkSync(networkJsPath);
  }
  
  const networkDJsPath = path.join(srcTypesDir, 'network.d.js');
  if (fs.existsSync(networkDJsPath)) {
    console.log(`Removing ${networkDJsPath}`);
    fs.unlinkSync(networkDJsPath);
  }
}

console.log('Fix completed!'); 
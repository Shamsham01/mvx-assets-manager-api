#!/usr/bin/env node

/**
 * Special fix script for wallet.js
 * Completely rewrites the file with proper JavaScript syntax
 */

const fs = require('fs');
const path = require('path');

console.log('Creating clean wallet.js file...');

const walletPath = path.join(__dirname, 'src/utils/wallet.js');

// Create a completely new version of wallet.js with proper JavaScript syntax
const newContent = `"use strict";

const fs = require('fs');
const path = require('path');
const { UserSigner } = require('@multiversx/sdk-wallet');
const { configService } = require('../config/config.service');

class WalletManager {
  constructor() {
    this.walletPem = null;
    this.signer = null;
    this.address = null;
  }

  async initialize() {
    try {
      // Get the path to the PEM file
      const pemPath = process.env.PRIVATE_KEY 
        ? process.env.PRIVATE_KEY 
        : path.join(configService.getPemPath(), 'wallet.pem');
      
      console.log(\`Using wallet PEM from: \${typeof pemPath === 'string' && pemPath.includes('/') ? pemPath : 'environment variable'}\`);
      
      // Load the PEM content
      this.walletPem = process.env.PRIVATE_KEY 
        ? process.env.PRIVATE_KEY 
        : fs.readFileSync(pemPath, { encoding: 'utf8' });
      
      // Create a UserSigner
      this.signer = UserSigner.fromPem(this.walletPem);
      
      // Get the wallet address
      this.address = this.signer.getAddress().bech32();
      
      console.log(\`Wallet initialized with address: \${this.address}\`);
      
      return this.address;
    } catch (error) {
      console.error('Failed to initialize wallet:', error);
      throw error;
    }
  }

  getSigner() {
    if (!this.signer) {
      throw new Error('Wallet not initialized. Call initialize() first.');
    }
    return this.signer;
  }

  getAddress() {
    if (!this.address) {
      throw new Error('Wallet not initialized. Call initialize() first.');
    }
    return this.address;
  }
}

// Create a singleton instance
const walletManager = new WalletManager();

// Export as CommonJS module
module.exports = {
  walletManager
};`;

// Write the new content to the file
fs.writeFileSync(walletPath, newContent);

console.log(`Successfully rewrote ${walletPath} with clean JavaScript syntax`);

// Also check if there's a built version and fix that too
const buildWalletPath = path.join(__dirname, 'build/src/utils/wallet.js');
if (fs.existsSync(buildWalletPath)) {
  fs.writeFileSync(buildWalletPath, newContent);
  console.log(`Also fixed build version at ${buildWalletPath}`);
}

console.log('Wallet fix completed!'); 
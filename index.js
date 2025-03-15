"use strict";

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { UserSigner } = require('@multiversx/sdk-wallet');
const { Address, TransactionsFactoryConfig, TransferTransactionsFactory, TokenTransfer, Token } = require('@multiversx/sdk-core');
const { ApiNetworkProvider } = require('@multiversx/sdk-network-providers');
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const BigNumber = require('bignumber.js');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Authorization token
const SECURE_TOKEN = process.env.SECURE_TOKEN || 'default-secure-token';

// Initialize Network Provider (defaulting to mainnet, but configurable)
const provider = new ApiNetworkProvider(
  process.env.API_PROVIDER || 'https://gateway.multiversx.com'
);

// Constants for usage fee
const FIXED_USD_FEE = process.env.FIXED_USD_FEE || 0.03; // $0.03 fixed fee
const REWARD_TOKEN = process.env.REWARD_TOKEN || "REWARD-cf6eac";
const TREASURY_WALLET = process.env.TREASURY_WALLET || "erd158k2c3aserjmwnyxzpln24xukl2fsvlk9x46xae4dxl5xds79g6sdz37qn";
const whitelistFilePath = path.join(__dirname, 'whitelist.json');

// In-memory store for tracking pending transactions
const pendingUsageFeeTransactions = new Map();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for PEM files

// Create whitelist file if it doesn't exist
if (!fs.existsSync(whitelistFilePath)) {
  fs.writeFileSync(whitelistFilePath, JSON.stringify([], null, 2));
  console.log('Created empty whitelist.json file');
}

// Token check middleware
const checkToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === `Bearer ${SECURE_TOKEN}`) {
    next();
  } else {
    res.status(401).json({ status: 'fail', message: 'Unauthorized' });
  }
};

// Helper: Get PEM and derive address
function getPemContent(req) {
  const pemContent = req.body.walletPem;
  if (!pemContent || typeof pemContent !== 'string' || !pemContent.includes('-----BEGIN PRIVATE KEY-----')) {
    throw new Error('Invalid PEM content');
  }
  return pemContent;
}

// Helper: Load whitelist from file
const loadWhitelist = () => {
  try {
    if (!fs.existsSync(whitelistFilePath)) {
      fs.writeFileSync(whitelistFilePath, JSON.stringify([], null, 2));
    }
    const data = fs.readFileSync(whitelistFilePath);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading whitelist:', error);
    return [];
  }
};

// Helper: Check if wallet is whitelisted
const isWhitelisted = (walletAddress) => {
  const whitelist = loadWhitelist();
  return whitelist.some(entry => entry.walletAddress === walletAddress);
};

// Helper: Fetch token decimals from MultiversX API
const getTokenDecimals = async (tokenTicker) => {
  const apiUrl = `https://api.multiversx.com/tokens/${tokenTicker}`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch token info: ${response.statusText}`);
  }
  const tokenInfo = await response.json();
  return tokenInfo.decimals || 0;
};

// Helper: Convert amount to blockchain-compatible value
const convertAmountToBlockchainValue = (amount, decimals) => {
  const factor = new BigNumber(10).pow(decimals);
  return new BigNumber(amount).multipliedBy(factor).toFixed(0);
};

// Helper: Fetch REWARD token price from MultiversX API
const getRewardPrice = async () => {
  try {
    // Fetch token info directly from MultiversX API
    const tokenResponse = await fetch(`https://api.multiversx.com/tokens?search=${REWARD_TOKEN}`);
    if (!tokenResponse.ok) {
      throw new Error(`Failed to fetch token info: ${tokenResponse.statusText}`);
    }
    
    const tokenData = await tokenResponse.json();
    if (!tokenData || !tokenData.length || !tokenData[0].price) {
      throw new Error('Token price not available');
    }
    
    // Get price directly from the API response
    const tokenPrice = new BigNumber(tokenData[0].price);
    
    if (tokenPrice.isZero() || !tokenPrice.isFinite()) {
      throw new Error('Invalid token price from API');
    }
    
    return tokenPrice.toNumber();
  } catch (error) {
    console.error('Error fetching REWARD price:', error);
    throw error;
  }
};

// Helper: Calculate dynamic usage fee based on REWARD price
const calculateDynamicUsageFee = async () => {
  const rewardPrice = await getRewardPrice();
  
  if (rewardPrice <= 0) {
    throw new Error('Invalid REWARD token price');
  }

  const rewardAmount = new BigNumber(FIXED_USD_FEE).dividedBy(rewardPrice);
  const decimals = await getTokenDecimals(REWARD_TOKEN);
  
  // Ensure the amount is not too small or too large
  if (!rewardAmount.isFinite() || rewardAmount.isZero()) {
    throw new Error('Invalid usage fee calculation');
  }

  return convertAmountToBlockchainValue(rewardAmount, decimals);
};

// Helper: Check transaction status
async function checkTransactionStatus(txHash, maxRetries = 20, retryInterval = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      // Only log first, last, and every 5th attempt to reduce noise
      if (i === 0 || i === maxRetries - 1 || i % 5 === 0) {
        console.log(`Checking transaction ${txHash} status (attempt ${i + 1}/${maxRetries})...`);
      }
      
      const txStatusUrl = `https://api.multiversx.com/transactions/${txHash}`;
      const response = await fetch(txStatusUrl, { timeout: 5000 });
      
      if (!response.ok) {
        if (response.status === 404) {
          // Transaction not yet visible, retry after interval
          await new Promise(resolve => setTimeout(resolve, retryInterval));
          continue;
        }
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const txStatus = await response.json();
      
      if (txStatus.status === "success") {
        console.log(`Transaction ${txHash} completed successfully.`);
        return { status: "success", txHash };
      } else if (txStatus.status === "fail" || txStatus.status === "invalid") {
        console.log(`Transaction ${txHash} failed with status: ${txStatus.status}`);
        return { 
          status: "fail", 
          txHash, 
          details: txStatus.error || txStatus.receipt?.data || 'No error details provided' 
        };
      }
      
      // Transaction still pending, retry after interval
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    } catch (error) {
      console.error(`Error checking transaction ${txHash}: ${error.message}`);
      // Continue retrying even after fetch errors
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }
  }
  
  // Max retries reached without definitive status
  console.log(`Transaction ${txHash} status undetermined after ${maxRetries} retries`);
  return { status: "pending", txHash };
}

// Helper: Send usage fee transaction
const sendUsageFee = async (pemContent, walletAddress) => {
  // Check if there's already a pending transaction for this wallet
  const pendingTx = pendingUsageFeeTransactions.get(walletAddress);
  if (pendingTx) {
    try {
      // Check if the pending transaction has completed
      const status = await checkTransactionStatus(pendingTx.txHash);
      
      // If transaction succeeded, return the existing transaction hash
      if (status.status === "success") {
        pendingUsageFeeTransactions.delete(walletAddress); // Clean up the record
        return pendingTx.txHash;
      }
      
      // If transaction failed, continue with creating a new one
      if (status.status === "fail") {
        pendingUsageFeeTransactions.delete(walletAddress); // Clean up the failed transaction
      } else if (status.status === "pending") {
        // Transaction is still pending, return the existing hash
        // This prevents double charging for slow transactions
        return pendingTx.txHash;
      }
    } catch (error) {
      // If the transaction check fails for any reason, clear it and try again
      pendingUsageFeeTransactions.delete(walletAddress);
    }
  }

  const signer = UserSigner.fromPem(pemContent);
  const senderAddress = signer.getAddress();
  const receiverAddress = new Address(TREASURY_WALLET);

  const accountOnNetwork = await provider.getAccount(senderAddress);
  const nonce = accountOnNetwork.nonce;

  // Calculate dynamic fee
  const dynamicFeeAmount = await calculateDynamicUsageFee();

  const factoryConfig = new TransactionsFactoryConfig({ chainID: "1" });
  const factory = new TransferTransactionsFactory({ config: factoryConfig });

  const tx = factory.createTransactionForESDTTokenTransfer({
    sender: senderAddress,
    receiver: receiverAddress,
    tokenTransfers: [
      new TokenTransfer({
        token: new Token({ identifier: REWARD_TOKEN }),
        amount: BigInt(dynamicFeeAmount),
      }),
    ],
  });

  tx.nonce = nonce;
  tx.gasLimit = BigInt(500000);

  await signer.sign(tx);
  const txHash = await provider.sendTransaction(tx);
  
  // Store the pending transaction with timestamp
  pendingUsageFeeTransactions.set(walletAddress, {
    txHash: txHash.toString(),
    timestamp: Date.now()
  });

  // We'll do a minimal initial check with just a few retries to avoid holding up the API
  // Full status tracking happens through the pendingUsageFeeTransactions system
  const status = await checkTransactionStatus(txHash.toString(), 3, 1000);
  
  if (status.status === "success") {
    pendingUsageFeeTransactions.delete(walletAddress); // Clean up on success
  } else if (status.status === "fail") {
    pendingUsageFeeTransactions.delete(walletAddress); // Clean up on failure
    throw new Error('Usage fee transaction failed. Ensure sufficient REWARD tokens are available.');
  }
  // For pending status, leave in the map for future checks
  
  return txHash.toString();
};

// Middleware: Handle usage fee
const handleUsageFee = async (req, res, next) => {
  try {
    const pemContent = getPemContent(req);
    const walletAddress = UserSigner.fromPem(pemContent).getAddress().toString();

    if (isWhitelisted(walletAddress)) {
      console.log(`Wallet ${walletAddress} is whitelisted. Skipping usage fee.`);
      return next();
    }

    const txHash = await sendUsageFee(pemContent, walletAddress);
    req.usageFeeHash = txHash;
    next();
  } catch (error) {
    console.error('Error processing usage fee:', error.message);
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// Periodic cleanup of old pending transactions (run every 30 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [wallet, txData] of pendingUsageFeeTransactions.entries()) {
    // Remove transactions older than 1 hour (3600000 ms)
    if (now - txData.timestamp > 3600000) {
      pendingUsageFeeTransactions.delete(wallet);
    }
  }
}, 1800000); // 30 minutes

// Routes
// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Authorization Endpoint for Make.com
app.post('/authorization', (req, res) => {
  try {
    const token = req.headers.authorization;
    if (token === `Bearer ${SECURE_TOKEN}`) {
      return res.json({ 
        status: 'success',
        message: "Authorization successful" 
      });
    }
    return res.status(401).json({ 
      status: 'fail', 
      message: "Unauthorized" 
    });
  } catch (error) {
    return res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

// Set Herotag Endpoint
app.post('/setHerotag', checkToken, handleUsageFee, async (req, res) => {
  try {
    const pemContent = getPemContent(req);
    const { address, herotag } = req.body;
    
    // Validate request body
    if (!address || !herotag) {
      return res.status(400).json({
        status: 'fail',
        message: 'Address and herotag are required'
      });
    }
    
    // Verify wallet ownership
    const signer = UserSigner.fromPem(pemContent);
    const walletAddress = signer.getAddress().toString();
    
    if (walletAddress !== address) {
      return res.status(400).json({
        status: 'fail',
        message: 'The provided PEM file does not match the specified address'
      });
    }
    
    // Check if herotag is valid
    if (!/^[a-zA-Z0-9]{3,25}$/.test(herotag)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Herotag must be 3-25 alphanumeric characters'
      });
    }

    // Check if herotag already exists
    try {
      const herotagResponse = await fetch(
        `${provider.getNetworkConfig().apiUrl}/usernames/${herotag.trim()}.elrond`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      
      if (herotagResponse.ok) {
        const data = await herotagResponse.json();
        return res.status(400).json({
          status: 'fail',
          message: `Herotag ${herotag}.elrond is already registered to address ${data.address}`
        });
      }
    } catch (error) {
      // If error, herotag doesn't exist, which is what we want
      console.log('Herotag check passed - not registered yet');
    }
    
    // Now implement the actual herotag registration
    try {
      // Get chain ID from network provider
      const networkConfig = await provider.getNetworkConfig();
      const chainID = networkConfig.ChainID;
      
      // Calculate DNS smart contract address for herotag
      const fullHerotag = `${herotag}.elrond`;
      
      // Helper function to calculate DNS contract address - adapted from src/utils.js
      const getDnsAddress = (name) => {
        // Based on the actual contract deployment
        // For mainnet/devnet, DNS contract is always the same
        return new Address('erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u');
      };
      
      const dnsScAddress = getDnsAddress(fullHerotag);
      
      // Get user account
      const userAccount = await provider.getAccount(signer.getAddress());
      
      // Build contract call for registering herotag
      const { ContractCallPayloadBuilder, ContractFunction, Transaction, BytesValue } = require('@multiversx/sdk-core');
      
      // Convert herotag to bytes properly
      const herotagBytesValue = BytesValue.fromUTF8(`${herotag}.elrond`);
      
      const data = new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('register'))
        .setArgs([herotagBytesValue])
        .build();
      
      // Create transaction
      const tx = new Transaction({
        data: data,
        gasLimit: 60000000, // Adjust gas limit for register operation
        receiver: dnsScAddress,
        sender: signer.getAddress(),
        value: 0,
        chainID: chainID
      });
      
      // Sign the transaction
      tx.setNonce(userAccount.nonce);
      const serializedTx = tx.serializeForSigning();
      const signature = await signer.sign(serializedTx);
      tx.applySignature(signature);
      
      // Send transaction to the network
      const txHash = await provider.sendTransaction(tx);
      console.log(`Herotag registration transaction submitted: ${txHash}`);
      
      // Return success response with transaction hash
      return res.status(200).json({
        status: 'success',
        data: {
          address,
          herotag: `${herotag}.elrond`,
          transactionHash: txHash,
          timestamp: new Date().toISOString(),
          usageFeeHash: req.usageFeeHash || 'N/A'
        }
      });
    } catch (error) {
      console.error('Herotag registration error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to register herotag on blockchain',
        details: error.message
      });
    }
  } catch (error) {
    console.error('Set Herotag error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to set herotag',
      details: error.message
    });
  }
});

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
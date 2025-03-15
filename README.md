# Simple MultiversX API

A streamlined API for interacting with the MultiversX blockchain, designed specifically for Make.com custom app integration.

## Features

- Token-based authorization for Make.com integration
- PEM wallet authentication for blockchain operations
- Usage fee system with REWARD token
- Whitelisting capability for trusted wallets
- Herotag management and registration on MultiversX blockchain

## Setup

### Prerequisites

- Node.js 18.x or higher

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/mvx-simple-api.git
cd mvx-simple-api
```

2. Install dependencies
```bash
npm install
```

### Required Environment Variables

The following environment variables are used by the application:

```
PORT=3000
NODE_ENV=development/production
SECURE_TOKEN=your-secure-token
API_PROVIDER=https://gateway.multiversx.com
CHAIN=mainnet

# Usage Fee Configuration
FIXED_USD_FEE=0.03
REWARD_TOKEN=REWARD-cf6eac
TREASURY_WALLET=your-treasury-wallet-address
```

These can be configured directly on Render.com or set locally for development.

### Running the API

#### Development
```bash
npm run dev
```

#### Production
```bash
npm start
```

## API Endpoints

### Health Check
```
GET /health
```
Returns the server status.

### Authorization
```
POST /authorization
```
Authenticates a Make.com request via secure token.

Headers:
```
Authorization: Bearer your-secure-token
```

Response:
```json
{
  "status": "success",
  "message": "Authorization successful"
}
```

### Set Herotag
```
POST /setHerotag
```
Registers a herotag for a given address on the MultiversX blockchain.

Headers:
```
Authorization: Bearer your-secure-token
```

Request body:
```json
{
  "walletPem": "-----BEGIN PRIVATE KEY-----\n... PEM content ...\n-----END PRIVATE KEY-----",
  "address": "erd1...",
  "herotag": "myherotag"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "address": "erd1...",
    "herotag": "myherotag.elrond",
    "transactionHash": "blockchain-transaction-hash",
    "timestamp": "2023-05-10T12:34:56.789Z",
    "usageFeeHash": "usage-fee-transaction-hash-or-N/A"
  }
}
```

This endpoint performs the following actions:
1. Validates the provided wallet ownership by checking the PEM file
2. Verifies the herotag isn't already registered
3. Creates and submits a blockchain transaction to register the herotag
4. Returns the transaction hash for tracking

Note: Registering a herotag is a blockchain operation that requires gas and is subject to the usage fee system.

## Wallet Whitelisting

You can whitelist wallets to bypass the usage fee by adding them to the `whitelist.json` file:

```json
[
  {
    "walletAddress": "erd1...",
    "name": "Wallet Name",
    "reason": "Reason for whitelisting",
    "dateAdded": "2023-05-10T12:00:00.000Z"
  }
]
```

## Usage Fee System

The API includes a usage fee system that charges users a small amount in REWARD tokens for each operation. The fee amount is calculated dynamically based on the current REWARD token price to maintain a fixed USD value (default: $0.03).

Whitelisted wallets are exempt from the usage fee.

## Make.com Integration

This API is designed to work seamlessly with Make.com custom apps:

1. In Make.com, create a new custom app
2. Set up an authorization module using the `/authorization` endpoint with the SECURE_TOKEN
3. Configure modules for each endpoint (e.g., setHerotag)
4. Each module should include the wallet PEM as a field in the request body

## Deployment on Render

This project includes a `render.yaml` file for easy deployment on Render.com:

1. Connect your GitHub repository to Render
2. The necessary environment variables are already configured in `render.yaml`
3. For sensitive values like `SECURE_TOKEN` and `TREASURY_WALLET`, you'll need to set these manually in the Render dashboard after deployment
4. Deploy your application

## License

MIT

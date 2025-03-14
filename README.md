# MultiversX Assets Manager API

A RESTful API service for managing MultiversX blockchain assets, based on Buildo Begins. This API is designed to work with make.com custom apps and provides endpoints for token operations, smart contract interactions, and blockchain utilities.

## Base URL
```
https://my-bulido-api.onrender.com
```

## Authentication
API uses API key authentication. Include your API key in the request headers:
```
X-API-Key: your-api-key
```

## Available Endpoints

### Token Operations

#### ESDT (Fungible Tokens)
- `POST /api/v1/esdt/issue` - Issue new ESDT token
- `POST /api/v1/esdt/roles/set` - Set special roles for ESDT
- `POST /api/v1/esdt/roles/unset` - Unset special roles for ESDT
- `POST /api/v1/esdt/mint` - Mint ESDT tokens
- `POST /api/v1/esdt/burn` - Burn ESDT tokens
- `POST /api/v1/esdt/transfer` - Transfer ESDT tokens
- `POST /api/v1/esdt/freeze` - Freeze ESDT tokens
- `POST /api/v1/esdt/unfreeze` - Unfreeze ESDT tokens
- `POST /api/v1/esdt/wipe` - Wipe ESDT tokens
- `POST /api/v1/esdt/pause` - Pause ESDT transactions
- `POST /api/v1/esdt/unpause` - Unpause ESDT transactions

#### NFT Operations
- `POST /api/v1/nft/issue` - Issue new NFT collection
- `POST /api/v1/nft/roles/set` - Set special roles for NFT
- `POST /api/v1/nft/roles/unset` - Unset special roles for NFT
- `POST /api/v1/nft/create` - Create new NFT
- `POST /api/v1/nft/transfer` - Transfer NFT

#### SFT Operations
- `POST /api/v1/sft/issue` - Issue new SFT collection
- `POST /api/v1/sft/roles/set` - Set special roles for SFT
- `POST /api/v1/sft/roles/unset` - Unset special roles for SFT
- `POST /api/v1/sft/create` - Create new SFT
- `POST /api/v1/sft/transfer` - Transfer SFT

#### Meta ESDT Operations
- `POST /api/v1/meta-esdt/issue` - Issue new Meta ESDT collection
- `POST /api/v1/meta-esdt/roles/set` - Set special roles
- `POST /api/v1/meta-esdt/roles/unset` - Unset special roles
- `POST /api/v1/meta-esdt/create` - Create Meta ESDT
- `POST /api/v1/meta-esdt/transfer` - Transfer Meta ESDT

### Utility Endpoints
- `POST /api/v1/utils/multi-transfer` - Transfer multiple tokens
- `POST /api/v1/utils/decode-transaction` - Decode transaction data
- `POST /api/v1/utils/herotag` - Create/check herotag
- `GET /api/v1/utils/converters` - Data conversion utilities

### Account Operations
- `POST /api/v1/account/store` - Store key-value data
- `POST /api/v1/account/claim-rewards` - Claim developer rewards
- `POST /api/v1/account/change-owner` - Change contract owner

## Request/Response Examples

### Issue ESDT Token
```json
POST /api/v1/esdt/issue

Request:
{
  "tokenName": "MyToken",
  "tokenTicker": "MTK",
  "initialSupply": "1000000000000000000",
  "decimals": 18,
  "canFreeze": true,
  "canWipe": true,
  "canPause": true,
  "canMint": true,
  "canBurn": true,
  "canChangeOwner": true,
  "canUpgrade": true,
  "canAddSpecialRoles": true
}

Response:
{
  "success": true,
  "data": {
    "tokenIdentifier": "MTK-a1b2c3",
    "transactionHash": "...",
    "status": "success"
  }
}
```

## Error Handling
The API uses standard HTTP status codes and returns error messages in the following format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

## Development Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create .env file:
```
PORT=3000
API_KEY=your-api-key
NETWORK=devnet  # or mainnet/testnet
CUSTOM_API_URL=https://devnet-api.multiversx.com
```

4. Run development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Make.com Integration

This API is designed to work seamlessly with make.com custom apps. Each endpoint corresponds to a module in your Make custom app. The request/response format is standardized to make integration straightforward.

## Security Considerations

1. Always store sensitive data (PEM files, private keys) securely
2. Use environment variables for configuration
3. Implement rate limiting in production
4. Monitor API usage and implement appropriate security measures

## License
MIT

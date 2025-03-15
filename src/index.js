"use strict";

const { exit, argv } = require('process');
const chalk = require('chalk');
const packageJson = require('../package.json');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const { rateLimit } = require('express-rate-limit');
const { configService } = require('./config/config.service');
const { walletManager } = require('./utils/wallet');
const { securityMiddleware } = require('./middleware/security.middleware');
const { swaggerSpec } = require('./config/swagger');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');
const { requestLogger } = require('./utils/logger');
const logger = require('./utils/logger');

const { derivePem } = require('./derive-pem');
const { init } = require('./init');
const { sendEsdt } = require('./esdt/send-esdt');
const { issueEsdt } = require('./esdt/issue-esdt');
const { mintBurnEsdt } = require('./esdt/mint-burn-esdt');
const { toggleSpecialRolesEsdt } = require('./esdt/toggle-special-roles-esdt');
const { sendEgld } = require('./egld/send-egld');
const { sendNft } = require('./nft/send-nft');
const { sendSft } = require('./sft/send-sft');
const { sendMetaEsdt } = require('./meta-esdt/send-meta-esdt');
const { herotag } = require('./herotag');
const { pauseUnpauseEsdt } = require('./esdt/pause-unpause');
const { freezeUnfreezeEsdt } = require('./esdt/freeze-unfreeze-esdt');
const { transferOwnershipEsdt } = require('./esdt/transfer-ownership-esdt');
const { wipeEsdt } = require('./esdt/wipe-esdt');
const { converters } = require('./converters');
const { issueSft } = require('./sft/issue-sft');
const { toggleSpecialRolesSft } = require('./sft/toggle-special-roles-sft');
const { createSft } = require('./sft/create-sft');
const { issueNft } = require('./nft/issue-nft');
const { toggleSpecialRolesNft } = require('./nft/toggle-special-roles-nft');
const { createNft } = require('./nft/create-nft');
const { claimDeveloperRewards } = require('./claim-dev-rewards');
const { changeOwnerAddress } = require('./change-owner-address');
const { issueMetaEsdt } = require('./meta-esdt/issue-meta-esdt');
const { toggleSpecialRolesMetaEsdt } = require('./meta-esdt/toggle-special-roles-meta-esdt');
const { createMetaEsdt } = require('./meta-esdt/create-meta-esdt');
const { accountStore } = require('./account-store');
const { changePropertiesEsdt } = require('./esdt/change-properties-esdt');
const { changePropertiesNft } = require('./nft/change-properties-nft');
const { changePropertiesSft } = require('./sft/change-properties-sft');
const { changePropertiesMetaEsdt } = require('./meta-esdt/change-properties-meta-esdt');
const { decodeTransaction } = require('./decode-transaction');
const { multiTransfer } = require('./multi-transfer');

// Import routes
const esdtRoutes = require('./routes/esdt.routes');
const nftRoutes = require('./routes/nft.routes');
const sftRoutes = require('./routes/sft.routes');
const metaEsdtRoutes = require('./routes/meta-esdt.routes');
const utilsRoutes = require('./routes/utils.routes');
const accountRoutes = require('./routes/account.routes');
const authRoutes = require('./routes/auth.routes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// API Key middleware
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      success,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid API key'
      }
    });
  }
  next();
};

// Add request logging
app.use(requestLogger);

// Routes
app.use('/authorization', authRoutes);
app.use('/api/v1/esdt', securityMiddleware, esdtRoutes);
app.use('/api/v1/nft', securityMiddleware, nftRoutes);
app.use('/api/v1/sft', securityMiddleware, sftRoutes);
app.use('/api/v1/meta-esdt', securityMiddleware, metaEsdtRoutes);
app.use('/api/v1/utils', securityMiddleware, utilsRoutes);
app.use('/api/v1/account', securityMiddleware, accountRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Handle 404 errors
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// Initialize wallet and start server
const startServer = async () => {
  try {
    await walletManager.initialize();
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
      logger.info(`Environment: ${configService.getEnvironment()}`);
      const network = configService.getNetwork();
      logger.info(`Network: ${network.ChainID === 'T' || network.ChainID === 'T' ? 'Testnet' : 'Mainnet'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', { reason, promise });
  process.exit(1);
});

startServer();


const commands = {
  general: [
    {
      name: 'derive-pem',
      fn,
      description: 'Derive PEM file from seed phrase',
    },
    {
      name: 'init',
      fn,
      description:
        'Initialize project (it can be dapp, example smart contract etc.)',
    },
    {
      name: 'herotag',
      fn,
      description:
        'Create a herotag and assign it to addres and check addresses of existing ones',
    },
    {
      name: 'converters',
      fn,
      description: 'A set of data converters.',
    },
    {
      name: 'claim-developer-rewards',
      fn,
      description:
        "Claim dev rewards from your smart contract. You have to use the owner's wallet address (PEM) when calling it",
    },
    {
      name: 'change-owner-address',
      fn,
      description:
        'You can change the owner address of the smart contract you own',
    },
    {
      name: 'account-store',
      fn,
      description:
        'A wallet owner can store key-value pairs by using the built-in function SaveKeyValue which receives any number of key-value pairs.',
    },
    {
      name: 'decode-transaction',
      fn,
      description:
        'You can decode the transaction data by providing a base64 encoded string or just the transaction data string. Plus you will need to provide the sender, receiver, and in case of EGLD transfer also value.',
    },
    {
      name: 'multi-transfer',
      fn,
      description:
        'Send multiple ESDTs (fungible, NFT, SFT, Meta) with one transaction',
    },
  ],
  egld: [
    {
      name: 'send-egld',
      fn,
      description: 'Send EGLD tokens',
    },
  ],
  esdt: [
    {
      name: 'issue-esdt',
      fn,
      description: 'Issue new ESDT token',
    },
    {
      name: 'set-special-roles-esdt',
      fn: () => toggleSpecialRolesEsdt('set'),
      description: 'Set special ESDT roles',
    },
    {
      name: 'unset-special-roles-esdt',
      fn: () => toggleSpecialRolesEsdt('unset'),
      description: 'Unset special ESDT roles',
    },
    {
      name: 'mint-burn-esdt',
      fn,
      description:
        "Mint or Burn the ESDT token supply (requires 'ESDTRoleLocalBurn', 'ESDTRoleLocalMint' roles)",
    },
    {
      name: 'pause-unpause-esdt',
      fn,
      description:
        "Pause or unpause all transactions of the token (requires 'canPause' role)",
    },
    {
      name: 'freeze-unfreeze-esdt',
      fn,
      description:
        "Freeze or unfreeze the token balance in a specific account, preventing transfers to and from that account (requires 'canFreeze' role)",
    },
    {
      name: 'wipe-esdt',
      fn,
      description:
        'Wipe out the tokens held by a previously frozen account, reducing the supply (Wiping the tokens of an Account is an operation designed to help token managers to comply with regulations.)',
    },
    {
      name: 'transfer-ownership-esdt',
      fn,
      description:
        "The manager of an ESDT token may transfer the management rights to another Account. This operation requires that the 'canChangeOwner' is set to true.",
    },
    {
      name: 'change-properties-esdt',
      fn,
      description:
        "Change ESDT token properties added when issuing the token, the 'canUpgrade' property h",
    },
    {
      name: 'send-esdt',
      fn,
      description: 'Send ESDT tokens',
    },
  ],
  sft: [
    {
      name: 'issue-sft',
      fn,
      description: 'Issue a new SFT collection',
    },
    {
      name: 'set-special-roles-sft',
      fn: () => toggleSpecialRolesSft('set'),
      description: 'Set special roles for SFT',
    },
    {
      name: 'unset-special-roles-sft',
      fn: () => toggleSpecialRolesSft('unset'),
      description: 'Unset special roles for SFT',
    },
    {
      name: 'create-sft',
      fn,
      description:
        'Create a new SFT with initial quantity, assets, attributes, etc.',
    },
    {
      name: 'change-properties-sft',
      fn,
      description:
        "Change SFT token properties added when issuing the token, the 'canUpgrade' property h",
    },
    {
      name: 'send-sft',
      fn,
      description: 'Send SFT tokens',
    },
  ],
  nft: [
    {
      name: 'issue-nft',
      fn,
      description: 'Issue a new NFT collection',
    },
    {
      name: 'set-special-roles-nft',
      fn: () => toggleSpecialRolesNft('set'),
      description: 'Set special roles for NFT',
    },
    {
      name: 'unset-special-roles-nft',
      fn: () => toggleSpecialRolesNft('unset'),
      description: 'Unset special roles for NFT',
    },
    {
      name: 'create-nft',
      fn,
      description: 'Create a new NFT with assets, attributes, etc.',
    },
    {
      name: 'change-properties-nft',
      fn,
      description:
        "Change NFT token properties added when issuing the token, the 'canUpgrade' property h",
    },
    {
      name: 'send-nft',
      fn,
      description: 'Send NFT tokens',
    },
  ],
  metaEsdt: [
    {
      name: 'issue-meta-esdt',
      fn,
      description: 'Issue a new Meta ESDT collection',
    },
    {
      name: 'set-special-roles-meta-esdt',
      fn: () => toggleSpecialRolesMetaEsdt('set'),
      description: 'Set special roles for Meta ESDT',
    },
    {
      name: 'unset-special-roles-meta-esdt',
      fn: () => toggleSpecialRolesMetaEsdt('unset'),
      description: 'Unset special roles for Meta ESDT',
    },
    {
      name: 'create-meta-esdt',
      fn,
      description:
        'Create a new Meta ESDT with initial quantity, assets, attributes, etc.',
    },
    {
      name: 'change-properties-meta-esdt',
      fn,
      description:
        "Change Meta ESDT token properties added when issuing the token, the 'canUpgrade' property h",
    },
    {
      name: 'send-meta-esdt',
      fn,
      description: 'Send Meta ESDT tokens',
    },
  ],
};

const flatCommandsCollection = Object.values(commands).flat();

const findCommandData = (
  commandsCollection,
  command) => {
  return commandsCollection.find((item) => item.name === command);
};

const args = argv;
const command = args ? args[2] : undefined;

// Show version number
if (command === '--version' || command === '-v') {
  console.log(packageJson.version);
  exit();
}

// Show the list of commands
if (
  !command ||
  ['--help', '-h'].includes(command) ||
  !findCommandData(flatCommandsCollection, command)
) {
  const sections = Object.keys(commands);

  let availableCommands = '';

  for (const section of sections) {
    availableCommands =
      availableCommands +
      chalk.underline(
        `${
          section.charAt(0).toUpperCase() + section.slice(1)
        } operations (example: buildo-begins ${chalk.bold(
          commands[section][0].name
        )})`
      ) +
      '\n\n';

    for (const cmd of commands[section]) {
      availableCommands =
        availableCommands + `${chalk.blue(cmd.name)}\n  ${cmd.description}\n\n`;
    }
  }

  availableCommands =
    availableCommands +
    `${chalk.underline(
      `Check version and list commands (example: buildo-begins ${chalk.bold(
        '--version'
      )})`
    )}\n\n${chalk.blue('--version (-v)\n--help (-h)')}`;

  console.log(
    `\n${chalk.bold(
      'Please provide a proper command. Available commands:'
    )}\n\n${availableCommands}\n\n${chalk.bold(
      'Please provide a proper command from the list above!\n'
    )}`
  );
  exit(9);
}

// Trigger command
findCommandData(flatCommandsCollection, command)?.fn();

const { Request, Response } = require('express');
const { UserSigner } = require('@multiversx/sdk-wallet');
const { walletManager } = require('../utils/wallet');
const logger = require('../utils/logger');

/**
 * Authorize connection by validating PEM content
 */
const authorize = async (req, res) => {
  try {
    const { walletPem } = req.body;

    // Try to create a signer from PEM content
    try {
      const signer = UserSigner.fromPem(walletPem);
      const address = signer.getAddress().bech32();

      // Store PEM content temporarily for the session
      walletManager.setWalletPem(walletPem);

      logger.info(`Authorization successful for address: ${address}`);

      return res.json({
        success,
        data: {
          address
        }
      });
    } catch (error) {
      logger.error('Invalid PEM content:', error);
      return res.status(400).json({
        success,
        error: {
          code: 'INVALID_PEM',
          message: 'Invalid PEM content provided'
        }
      });
    }
  } catch (error) {
    logger.error('Authorization error:', error);
    return res.status(500).json({
      success,
      error: {
        code: 'AUTHORIZATION_ERROR',
        message: 'Failed to process authorization request'
      }
    });
  }
}; 
import { Request, Response } from 'express';
import { UserSigner } from '@multiversx/sdk-wallet';
import { walletManager } from '../utils/wallet';
import logger from '../utils/logger';

/**
 * Authorize connection by validating PEM content
 */
export const authorize = async (req: Request, res: Response) => {
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
        success: true,
        data: {
          address
        }
      });
    } catch (error) {
      logger.error('Invalid PEM content:', error);
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PEM',
          message: 'Invalid PEM content provided'
        }
      });
    }
  } catch (error) {
    logger.error('Authorization error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'AUTHORIZATION_ERROR',
        message: 'Failed to process authorization request'
      }
    });
  }
}; 
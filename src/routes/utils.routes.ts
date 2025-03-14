import express from 'express';
import { body, validationResult } from 'express-validator';
import {
  handleMultiTransfer,
  handleDecodeTransaction,
  handleHerotag,
  handleConverters
} from '../controllers/utils.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Utils
 *   description: Utility operations for blockchain interactions
 */

/**
 * @swagger
 * /utils/multi-transfer:
 *   post:
 *     summary: Send multiple tokens in a single transaction
 *     tags: [Utils]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - tokens
 *             properties:
 *               to:
 *                 type: string
 *                 description: Recipient address
 *               tokens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - identifier
 *                     - amount
 *                   properties:
 *                     identifier:
 *                       type: string
 *                       description: Token identifier
 *                     nonce:
 *                       type: integer
 *                       description: Token nonce (for NFT/SFT)
 *                     amount:
 *                       type: string
 *                       description: Amount to transfer
 *     responses:
 *       200:
 *         description: Transfer successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/multi-transfer', validateMultiTransfer, (req, res) => handleResponse(req, res, handleMultiTransfer));

/**
 * @swagger
 * /utils/decode-transaction:
 *   post:
 *     summary: Decode a transaction's data
 *     tags: [Utils]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - data
 *               - sender
 *               - receiver
 *             properties:
 *               data:
 *                 type: string
 *                 description: Transaction data (base64 or plain)
 *               sender:
 *                 type: string
 *                 description: Sender address
 *               receiver:
 *                 type: string
 *                 description: Receiver address
 *               value:
 *                 type: string
 *                 description: Transaction value (for EGLD transfers)
 *     responses:
 *       200:
 *         description: Transaction decoded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/decode-transaction', validateDecodeTransaction, (req, res) => handleResponse(req, res, handleDecodeTransaction));

/**
 * @swagger
 * /utils/herotag:
 *   post:
 *     summary: Manage herotags (create or check)
 *     tags: [Utils]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [create, check]
 *                 description: Action to perform
 *               herotag:
 *                 type: string
 *                 description: Herotag to create or check
 *               address:
 *                 type: string
 *                 description: Address to associate with herotag
 *     responses:
 *       200:
 *         description: Operation successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/herotag', validateHerotag, (req, res) => handleResponse(req, res, handleHerotag));

/**
 * @swagger
 * /utils/converters:
 *   post:
 *     summary: Convert between different formats
 *     tags: [Utils]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *               - value
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [bech32ToHex, hexToBech32, valueToHex, hexToValue]
 *                 description: Conversion action to perform
 *               value:
 *                 type: string
 *                 description: Value to convert
 *     responses:
 *       200:
 *         description: Conversion successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/converters', validateConverters, (req, res) => handleResponse(req, res, handleConverters));

// Validation middleware
const validateMultiTransfer = [
  body('to').isString().notEmpty(),
  body('tokens').isArray(),
  body('tokens.*.identifier').isString().notEmpty(),
  body('tokens.*.amount').isString().notEmpty(),
  body('tokens.*.nonce').optional().isInt({ min: 0 }),
];

const validateDecodeTransaction = [
  body('data').isString().notEmpty(),
  body('sender').isString().notEmpty(),
  body('receiver').isString().notEmpty(),
  body('value').optional().isString(),
];

const validateHerotag = [
  body('action').isIn(['create', 'check']),
  body('herotag').optional().isString(),
  body('address').optional().isString(),
];

const validateConverters = [
  body('action').isIn(['bech32ToHex', 'hexToBech32', 'valueToHex', 'hexToValue']),
  body('value').isString().notEmpty(),
];

// Helper function for error handling
const handleValidationErrors = (req: express.Request, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request parameters',
        details: errors.array()
      }
    });
  }
  return null;
};

// Helper function for response handling
const handleResponse = async (req: express.Request, res: express.Response, operation: Function) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    const result = await operation(req.body);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: error.code || 'OPERATION_ERROR',
        message: error.message
      }
    });
  }
};

export default router; 
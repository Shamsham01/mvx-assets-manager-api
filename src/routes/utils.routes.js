const express = require('express');
const { body } = require('express-validator');
const { handleMultiTransfer, handleDecodeTransaction, handleHerotag, handleConverters } = require('../controllers/utils.controller');
const { handleValidationErrors } = require('../middleware/validation.middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Utils
 *   description: Utility operations for blockchain interactions
 */

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
router.post('/multi-transfer', validateMultiTransfer, handleValidationErrors, (req, res) => handleResponse(req, res, handleMultiTransfer));

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
router.post('/decode-transaction', validateDecodeTransaction, handleValidationErrors, (req, res) => handleResponse(req, res, handleDecodeTransaction));

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
 *                 enum, check]
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
router.post('/herotag', validateHerotag, handleValidationErrors, (req, res) => handleResponse(req, res, handleHerotag));

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
 *                 enum, hexToValue]
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
router.post('/converters', validateConverters, handleValidationErrors, (req, res) => handleResponse(req, res, handleConverters));

/**
 * @swagger
 * /api/v1/utils/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Utils]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   example: "2024-03-14T12:00:00Z"
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Helper function for response handling
const handleResponse = async (req, res, operation) => {
  try {
    const result = await operation(req.body);
    res.json({
      success,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    });
  }
};

module.exports = router; 
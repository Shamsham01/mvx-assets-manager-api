import express from 'express';
import { body, validationResult } from 'express-validator';
import {
  issueEsdt,
  mintBurnEsdt,
  sendEsdt,
  toggleEsdtRoles,
  freezeUnfreezeEsdt,
  wipeEsdt,
  transferEsdtOwnership,
  changeEsdtProperties
} from '../controllers/esdt.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ESDT
 *   description: ESDT token management operations
 */

/**
 * @swagger
 * /esdt/issue:
 *   post:
 *     summary: Issue a new ESDT token
 *     tags: [ESDT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tokenName
 *               - tokenTicker
 *               - initialSupply
 *               - decimals
 *               - properties
 *             properties:
 *               tokenName:
 *                 type: string
 *                 description: Name of the token
 *               tokenTicker:
 *                 type: string
 *                 description: Token ticker (3-10 characters)
 *               initialSupply:
 *                 type: string
 *                 description: Initial token supply
 *               decimals:
 *                 type: integer
 *                 minimum: 0
 *                 description: Number of decimals
 *               properties:
 *                 type: object
 *                 properties:
 *                   canFreeze:
 *                     type: boolean
 *                   canWipe:
 *                     type: boolean
 *                   canPause:
 *                     type: boolean
 *                   canMint:
 *                     type: boolean
 *                   canBurn:
 *                     type: boolean
 *                   canChangeOwner:
 *                     type: boolean
 *                   canUpgrade:
 *                     type: boolean
 *                   canAddSpecialRoles:
 *                     type: boolean
 *     responses:
 *       200:
 *         description: Token issued successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /esdt/mint-burn:
 *   post:
 *     summary: Mint or burn ESDT tokens
 *     tags: [ESDT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tokenIdentifier
 *               - amount
 *               - operation
 *             properties:
 *               tokenIdentifier:
 *                 type: string
 *                 description: Token identifier
 *               amount:
 *                 type: string
 *                 description: Amount to mint or burn
 *               operation:
 *                 type: string
 *                 enum: [mint, burn]
 *                 description: Operation to perform
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

/**
 * @swagger
 * /esdt/send:
 *   post:
 *     summary: Send ESDT tokens to an address
 *     tags: [ESDT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - tokenIdentifier
 *               - amount
 *             properties:
 *               to:
 *                 type: string
 *                 description: Recipient address
 *               tokenIdentifier:
 *                 type: string
 *                 description: Token identifier
 *               amount:
 *                 type: string
 *                 description: Amount to send
 *     responses:
 *       200:
 *         description: Transfer successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /esdt/roles:
 *   post:
 *     summary: Set or unset special roles for an address
 *     tags: [ESDT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tokenIdentifier
 *               - address
 *               - roles
 *               - action
 *             properties:
 *               tokenIdentifier:
 *                 type: string
 *                 description: Token identifier
 *               address:
 *                 type: string
 *                 description: Address to manage roles for
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [ESDTRoleLocalMint, ESDTRoleLocalBurn, ESDTRoleNFTCreate, ESDTRoleNFTBurn, ESDTRoleNFTUpdateAttributes]
 *               action:
 *                 type: string
 *                 enum: [set, unset]
 *                 description: Action to perform
 *     responses:
 *       200:
 *         description: Roles updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /esdt/freeze-unfreeze:
 *   post:
 *     summary: Freeze or unfreeze ESDT tokens for an address
 *     tags: [ESDT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tokenIdentifier
 *               - address
 *               - action
 *             properties:
 *               tokenIdentifier:
 *                 type: string
 *                 description: Token identifier
 *               address:
 *                 type: string
 *                 description: Address to freeze/unfreeze
 *               action:
 *                 type: string
 *                 enum: [freeze, unfreeze]
 *                 description: Action to perform
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

/**
 * @swagger
 * /esdt/wipe:
 *   post:
 *     summary: Wipe ESDT tokens from a frozen address
 *     tags: [ESDT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tokenIdentifier
 *               - address
 *             properties:
 *               tokenIdentifier:
 *                 type: string
 *                 description: Token identifier
 *               address:
 *                 type: string
 *                 description: Address to wipe tokens from
 *     responses:
 *       200:
 *         description: Tokens wiped successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /esdt/transfer-ownership:
 *   post:
 *     summary: Transfer ownership of an ESDT token
 *     tags: [ESDT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tokenIdentifier
 *               - newOwner
 *             properties:
 *               tokenIdentifier:
 *                 type: string
 *                 description: Token identifier
 *               newOwner:
 *                 type: string
 *                 description: New owner address
 *     responses:
 *       200:
 *         description: Ownership transferred successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /esdt/properties:
 *   post:
 *     summary: Change ESDT token properties
 *     tags: [ESDT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tokenIdentifier
 *               - properties
 *             properties:
 *               tokenIdentifier:
 *                 type: string
 *                 description: Token identifier
 *               properties:
 *                 type: object
 *                 properties:
 *                   canFreeze:
 *                     type: boolean
 *                   canWipe:
 *                     type: boolean
 *                   canPause:
 *                     type: boolean
 *                   canMint:
 *                     type: boolean
 *                   canBurn:
 *                     type: boolean
 *                   canChangeOwner:
 *                     type: boolean
 *                   canUpgrade:
 *                     type: boolean
 *                   canAddSpecialRoles:
 *                     type: boolean
 *     responses:
 *       200:
 *         description: Properties updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */

// Validation middleware
const validateIssueEsdt = [
  body('tokenName').isString().notEmpty(),
  body('tokenTicker').isString().notEmpty(),
  body('initialSupply').isString().notEmpty(),
  body('decimals').isInt({ min: 0 }),
  body('properties').isObject(),
  body('properties.canFreeze').isBoolean(),
  body('properties.canWipe').isBoolean(),
  body('properties.canPause').isBoolean(),
  body('properties.canMint').isBoolean(),
  body('properties.canBurn').isBoolean(),
  body('properties.canChangeOwner').isBoolean(),
  body('properties.canUpgrade').isBoolean(),
  body('properties.canAddSpecialRoles').isBoolean(),
];

const validateMintBurn = [
  body('tokenIdentifier').isString().notEmpty(),
  body('amount').isString().notEmpty(),
  body('operation').isIn(['mint', 'burn']),
];

const validateSend = [
  body('to').isString().notEmpty(),
  body('tokenIdentifier').isString().notEmpty(),
  body('amount').isString().notEmpty(),
];

const validateToggleRoles = [
  body('tokenIdentifier').isString().notEmpty(),
  body('address').isString().notEmpty(),
  body('roles').isArray(),
  body('action').isIn(['set', 'unset']),
];

const validateFreezeUnfreeze = [
  body('tokenIdentifier').isString().notEmpty(),
  body('address').isString().notEmpty(),
  body('action').isIn(['freeze', 'unfreeze']),
];

const validateWipe = [
  body('tokenIdentifier').isString().notEmpty(),
  body('address').isString().notEmpty(),
];

const validateTransferOwnership = [
  body('tokenIdentifier').isString().notEmpty(),
  body('newOwner').isString().notEmpty(),
];

const validateChangeProperties = [
  body('tokenIdentifier').isString().notEmpty(),
  body('properties').isObject(),
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

// Routes
router.post('/issue', validateIssueEsdt, (req, res) => handleResponse(req, res, issueEsdt));
router.post('/mint-burn', validateMintBurn, (req, res) => handleResponse(req, res, mintBurnEsdt));
router.post('/send', validateSend, (req, res) => handleResponse(req, res, sendEsdt));
router.post('/roles', validateToggleRoles, (req, res) => handleResponse(req, res, toggleEsdtRoles));
router.post('/freeze-unfreeze', validateFreezeUnfreeze, (req, res) => handleResponse(req, res, freezeUnfreezeEsdt));
router.post('/wipe', validateWipe, (req, res) => handleResponse(req, res, wipeEsdt));
router.post('/transfer-ownership', validateTransferOwnership, (req, res) => handleResponse(req, res, transferEsdtOwnership));
router.post('/properties', validateChangeProperties, (req, res) => handleResponse(req, res, changeEsdtProperties));

export default router; 
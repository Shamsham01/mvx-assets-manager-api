import express from 'express';
import { body, validationResult } from 'express-validator';
import {
  issueNft,
  createNft,
  sendNft,
  toggleNftRoles,
  changeNftProperties
} from '../controllers/nft.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: NFT
 *   description: NFT collection and token management operations
 */

/**
 * @swagger
 * /nft/issue:
 *   post:
 *     summary: Issue a new NFT collection
 *     tags: [NFT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tokenName
 *               - tokenTicker
 *               - properties
 *             properties:
 *               tokenName:
 *                 type: string
 *                 description: Name of the NFT collection
 *               tokenTicker:
 *                 type: string
 *                 description: Collection ticker (3-10 characters)
 *               properties:
 *                 type: object
 *                 properties:
 *                   canFreeze:
 *                     type: boolean
 *                     description: Allow freezing NFTs
 *                   canWipe:
 *                     type: boolean
 *                     description: Allow wiping NFTs
 *                   canPause:
 *                     type: boolean
 *                     description: Allow pausing transfers
 *                   canTransferNftCreateRole:
 *                     type: boolean
 *                     description: Allow transferring NFT creation role
 *                   canChangeOwner:
 *                     type: boolean
 *                     description: Allow changing collection owner
 *                   canUpgrade:
 *                     type: boolean
 *                     description: Allow collection upgrades
 *                   canAddSpecialRoles:
 *                     type: boolean
 *                     description: Allow adding special roles
 *     responses:
 *       200:
 *         description: NFT collection issued successfully
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
 * /nft/create:
 *   post:
 *     summary: Create a new NFT in a collection
 *     tags: [NFT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - collection
 *               - name
 *               - quantity
 *               - royalties
 *               - hash
 *               - attributes
 *               - uris
 *             properties:
 *               collection:
 *                 type: string
 *                 description: Collection identifier
 *               name:
 *                 type: string
 *                 description: NFT name
 *               quantity:
 *                 type: string
 *                 description: Number of copies to create
 *               royalties:
 *                 type: string
 *                 description: Royalties percentage (0-10000)
 *               hash:
 *                 type: string
 *                 description: Hash of the NFT content
 *               attributes:
 *                 type: string
 *                 description: Metadata attributes (JSON string)
 *               uris:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of URIs (media, metadata)
 *     responses:
 *       200:
 *         description: NFT created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /nft/send:
 *   post:
 *     summary: Send an NFT to another address
 *     tags: [NFT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - collection
 *               - nonce
 *             properties:
 *               to:
 *                 type: string
 *                 description: Recipient address
 *               collection:
 *                 type: string
 *                 description: Collection identifier
 *               nonce:
 *                 type: integer
 *                 minimum: 0
 *                 description: NFT nonce (unique identifier)
 *     responses:
 *       200:
 *         description: NFT sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /nft/roles:
 *   post:
 *     summary: Set or unset special roles for an address
 *     tags: [NFT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - collection
 *               - address
 *               - roles
 *               - action
 *             properties:
 *               collection:
 *                 type: string
 *                 description: Collection identifier
 *               address:
 *                 type: string
 *                 description: Address to manage roles for
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [ESDTRoleNFTCreate, ESDTRoleNFTBurn, ESDTRoleNFTUpdateAttributes, ESDTRoleNFTAddURI, ESDTTransferRole]
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
 * /nft/properties:
 *   post:
 *     summary: Change NFT collection properties
 *     tags: [NFT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - collection
 *               - properties
 *             properties:
 *               collection:
 *                 type: string
 *                 description: Collection identifier
 *               properties:
 *                 type: object
 *                 properties:
 *                   canFreeze:
 *                     type: boolean
 *                   canWipe:
 *                     type: boolean
 *                   canPause:
 *                     type: boolean
 *                   canTransferNftCreateRole:
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
const validateIssueNft = [
  body('tokenName').isString().notEmpty(),
  body('tokenTicker').isString().notEmpty(),
  body('properties').isObject(),
  body('properties.canFreeze').isBoolean(),
  body('properties.canWipe').isBoolean(),
  body('properties.canPause').isBoolean(),
  body('properties.canTransferNftCreateRole').isBoolean(),
  body('properties.canChangeOwner').isBoolean(),
  body('properties.canUpgrade').isBoolean(),
  body('properties.canAddSpecialRoles').isBoolean(),
];

const validateCreateNft = [
  body('collection').isString().notEmpty(),
  body('name').isString().notEmpty(),
  body('quantity').isString().notEmpty(),
  body('royalties').isString().notEmpty(),
  body('hash').isString().notEmpty(),
  body('attributes').isString().notEmpty(),
  body('uris').isArray(),
  body('uris.*').isString(),
];

const validateSendNft = [
  body('to').isString().notEmpty(),
  body('collection').isString().notEmpty(),
  body('nonce').isInt({ min: 0 }),
];

const validateToggleRoles = [
  body('collection').isString().notEmpty(),
  body('address').isString().notEmpty(),
  body('roles').isArray(),
  body('action').isIn(['set', 'unset']),
];

const validateChangeProperties = [
  body('collection').isString().notEmpty(),
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
router.post('/issue', validateIssueNft, (req, res) => handleResponse(req, res, issueNft));
router.post('/create', validateCreateNft, (req, res) => handleResponse(req, res, createNft));
router.post('/send', validateSendNft, (req, res) => handleResponse(req, res, sendNft));
router.post('/roles', validateToggleRoles, (req, res) => handleResponse(req, res, toggleNftRoles));
router.post('/properties', validateChangeProperties, (req, res) => handleResponse(req, res, changeNftProperties));

export default router; 
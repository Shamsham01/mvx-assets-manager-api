const express = require('express');
const { body, validationResult } = require('express-validator');
const { issueSft, createSft, sendSft, toggleSftRoles, changeSftProperties } = require('../controllers/sft.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: SFT
 *   description: Semi-Fungible Token (SFT) collection and token management operations
 */

/**
 * @swagger
 * /sft/issue:
 *   post:
 *     summary: Issue a new SFT collection
 *     tags: [SFT]
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
 *                 description: Name of the SFT collection
 *               tokenTicker:
 *                 type: string
 *                 description: Collection ticker (3-10 characters)
 *               properties:
 *                 type: object
 *                 properties:
 *                   canFreeze:
 *                     type: boolean
 *                     description: Allow freezing SFTs
 *                   canWipe:
 *                     type: boolean
 *                     description: Allow wiping SFTs
 *                   canPause:
 *                     type: boolean
 *                     description: Allow pausing transfers
 *                   canTransferNftCreateRole:
 *                     type: boolean
 *                     description: Allow transferring SFT creation role
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
 *         description: SFT collection issued successfully
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
 * /sft/create:
 *   post:
 *     summary: Create a new SFT in a collection
 *     tags: [SFT]
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
 *                 description: SFT name
 *               quantity:
 *                 type: string
 *                 description: Initial supply of tokens
 *               royalties:
 *                 type: string
 *                 description: Royalties percentage (0-10000)
 *               hash:
 *                 type: string
 *                 description: Hash of the SFT content
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
 *         description: SFT created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /sft/send:
 *   post:
 *     summary: Send SFTs to another address
 *     tags: [SFT]
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
 *               - quantity
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
 *                 description: SFT nonce (unique identifier)
 *               quantity:
 *                 type: string
 *                 description: Amount of tokens to send
 *     responses:
 *       200:
 *         description: SFTs sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /sft/roles:
 *   post:
 *     summary: Set or unset special roles for an address
 *     tags: [SFT]
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
 *                   enum, ESDTTransferRole]
 *               action:
 *                 type: string
 *                 enum, unset]
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
 * /sft/properties:
 *   post:
 *     summary: Change SFT collection properties
 *     tags: [SFT]
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
const validateIssueSft = [
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

const validateCreateSft = [
  body('collection').isString().notEmpty(),
  body('name').isString().notEmpty(),
  body('quantity').isString().notEmpty(),
  body('royalties').isString().notEmpty(),
  body('hash').isString().notEmpty(),
  body('attributes').isString().notEmpty(),
  body('uris').isArray(),
  body('uris.*').isString(),
];

const validateSendSft = [
  body('to').isString().notEmpty(),
  body('collection').isString().notEmpty(),
  body('nonce').isInt({ min: 0 }),
  body('quantity').isString().notEmpty(),
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
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success,
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
const handleResponse = async (req, res, operation) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    const result = await operation(req.body);
    res.json({
      success,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success,
      error: {
        code: error.code || 'OPERATION_ERROR',
        message: error.message
      }
    });
  }
};

// Routes
router.post('/issue', validateIssueSft, (req, res) => handleResponse(req, res, issueSft));
router.post('/create', validateCreateSft, (req, res) => handleResponse(req, res, createSft));
router.post('/send', validateSendSft, (req, res) => handleResponse(req, res, sendSft));
router.post('/roles', validateToggleRoles, (req, res) => handleResponse(req, res, toggleSftRoles));
router.post('/properties', validateChangeProperties, (req, res) => handleResponse(req, res, changeSftProperties));

module.exports = router; 
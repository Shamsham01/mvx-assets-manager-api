const express = require('express');
const { body, validationResult } = require('express-validator');
const { issueMetaEsdt, createMetaEsdt, sendMetaEsdt, toggleMetaEsdtRoles, changeMetaEsdtProperties } = require('../controllers/meta-esdt.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Meta-ESDT
 *   description: Meta-ESDT token management operations (tokens with metadata and attributes)
 */

/**
 * @swagger
 * /meta-esdt/issue:
 *   post:
 *     summary: Issue a new Meta-ESDT collection
 *     tags: [Meta-ESDT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tokenName
 *               - tokenTicker
 *               - numDecimals
 *               - properties
 *             properties:
 *               tokenName:
 *                 type: string
 *                 description: Name of the Meta-ESDT collection
 *               tokenTicker:
 *                 type: string
 *                 description: Collection ticker (3-10 characters)
 *               numDecimals:
 *                 type: integer
 *                 minimum: 0
 *                 description: Number of decimals for the token
 *               properties:
 *                 type: object
 *                 properties:
 *                   canFreeze:
 *                     type: boolean
 *                     description: Allow freezing tokens
 *                   canWipe:
 *                     type: boolean
 *                     description: Allow wiping tokens
 *                   canPause:
 *                     type: boolean
 *                     description: Allow pausing transfers
 *                   canTransferNftCreateRole:
 *                     type: boolean
 *                     description: Allow transferring token creation role
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
 *         description: Meta-ESDT collection issued successfully
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
 * /meta-esdt/create:
 *   post:
 *     summary: Create a new Meta-ESDT token in a collection
 *     tags: [Meta-ESDT]
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
 *                 description: Token name
 *               quantity:
 *                 type: string
 *                 description: Initial supply of tokens
 *               royalties:
 *                 type: string
 *                 description: Royalties percentage (0-10000)
 *               hash:
 *                 type: string
 *                 description: Hash of the token content
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
 *         description: Meta-ESDT token created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /meta-esdt/send:
 *   post:
 *     summary: Send Meta-ESDT tokens to another address
 *     tags: [Meta-ESDT]
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
 *                 description: Token nonce (unique identifier)
 *               quantity:
 *                 type: string
 *                 description: Amount of tokens to send
 *     responses:
 *       200:
 *         description: Tokens sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /meta-esdt/roles:
 *   post:
 *     summary: Set or unset special roles for an address
 *     tags: [Meta-ESDT]
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
 * /meta-esdt/properties:
 *   post:
 *     summary: Change Meta-ESDT collection properties
 *     tags: [Meta-ESDT]
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
const validateIssueMetaEsdt = [
  body('tokenName').isString().notEmpty(),
  body('tokenTicker').isString().notEmpty(),
  body('numDecimals').isInt({ min: 0 }),
  body('properties').isObject(),
  body('properties.canFreeze').isBoolean(),
  body('properties.canWipe').isBoolean(),
  body('properties.canPause').isBoolean(),
  body('properties.canTransferNftCreateRole').isBoolean(),
  body('properties.canChangeOwner').isBoolean(),
  body('properties.canUpgrade').isBoolean(),
  body('properties.canAddSpecialRoles').isBoolean(),
];

const validateCreateMetaEsdt = [
  body('collection').isString().notEmpty(),
  body('name').isString().notEmpty(),
  body('quantity').isString().notEmpty(),
  body('royalties').isString().notEmpty(),
  body('hash').isString().notEmpty(),
  body('attributes').isString().notEmpty(),
  body('uris').isArray(),
  body('uris.*').isString(),
];

const validateSendMetaEsdt = [
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
router.post('/issue', validateIssueMetaEsdt, (req, res) => handleResponse(req, res, issueMetaEsdt));
router.post('/create', validateCreateMetaEsdt, (req, res) => handleResponse(req, res, createMetaEsdt));
router.post('/send', validateSendMetaEsdt, (req, res) => handleResponse(req, res, sendMetaEsdt));
router.post('/roles', validateToggleRoles, (req, res) => handleResponse(req, res, toggleMetaEsdtRoles));
router.post('/properties', validateChangeProperties, (req, res) => handleResponse(req, res, changeMetaEsdtProperties));

module.exports = router; 
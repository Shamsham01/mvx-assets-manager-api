const express = require('express');
const { body, validationResult } = require('express-validator');
const { handleStoreValue, handleGetValue, handleClaimDevRewards, handleChangeOwner } = require('../controllers/account.controller');

const router = express.Router();

// Validation middleware - moved to top before routes
const validateStoreValue = [
  body('key').isString().notEmpty(),
  body('value').isString().notEmpty(),
];

const validateGetValue = [
  body('key').isString().notEmpty(),
];

const validateClaimDevRewards = [
  body('address').isString().notEmpty(),
];

const validateChangeOwner = [
  body('oldOwner').isString().notEmpty(),
  body('newOwner').isString().notEmpty(),
];

/**
 * @swagger
 * tags:
 *   name: Account
 *   description: Account management operations
 */

/**
 * @swagger
 * /account/store:
 *   post:
 *     summary: Store a key-value pair in the account storage
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - value
 *             properties:
 *               key:
 *                 type: string
 *                 description: The key to store
 *               value:
 *                 type: string
 *                 description: The value to store
 *     responses:
 *       200:
 *         description: Value stored successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/store', validateStoreValue, (req, res) => handleResponse(req, res, handleStoreValue));

/**
 * @swagger
 * /account/get:
 *   post:
 *     summary: Retrieve a value by key from the account storage
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *             properties:
 *               key:
 *                 type: string
 *                 description: The key to retrieve
 *     responses:
 *       200:
 *         description: Value retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/get', validateGetValue, (req, res) => handleResponse(req, res, handleGetValue));

/**
 * @swagger
 * /account/claim-rewards:
 *   post:
 *     summary: Claim developer rewards from a smart contract
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *             properties:
 *               address:
 *                 type: string
 *                 description: The smart contract address
 *     responses:
 *       200:
 *         description: Rewards claimed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/claim-rewards', validateClaimDevRewards, (req, res) => handleResponse(req, res, handleClaimDevRewards));

/**
 * @swagger
 * /account/change-owner:
 *   post:
 *     summary: Change the owner of a smart contract
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldOwner
 *               - newOwner
 *             properties:
 *               oldOwner:
 *                 type: string
 *                 description: The current owner address
 *               newOwner:
 *                 type: string
 *                 description: The new owner address
 *     responses:
 *       200:
 *         description: Owner changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/change-owner', validateChangeOwner, (req, res) => handleResponse(req, res, handleChangeOwner));

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

module.exports = router; 
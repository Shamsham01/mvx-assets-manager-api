const express = require('express');
const { body, validationResult } = require('express-validator');
const { authorize } = require('../controllers/auth.controller');
const { handleValidationErrors } = require('../middleware/validation.middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authorization
 *   description: Authorization management
 */

/**
 * @swagger
 * /authorization:
 *   post:
 *     summary: Validate PEM file and authorize connection
 *     tags: [Authorization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - walletPem
 *             properties:
 *               walletPem:
 *                 type: string
 *                 description: PEM file content
 *     responses:
 *       200:
 *         description: Authorization successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     address:
 *                       type: string
 *                       description: Wallet address derived from PEM
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

// Validation middleware
const validateAuthorization = [
  body('walletPem').isString().notEmpty().withMessage('PEM content is required'),
];

// Routes
router.post('/', validateAuthorization, handleValidationErrors, authorize);

module.exports = router; 
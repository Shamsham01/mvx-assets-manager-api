const { ValidationError } = require('../middleware/validation.middleware');

export type ErrorCode = 
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR'
  | 'ISSUE_ESDT_ERROR'
  | 'MINT_BURN_ESDT_ERROR'
  | 'SEND_ESDT_ERROR'
  | 'TOGGLE_ROLES_ERROR'
  | 'FREEZE_UNFREEZE_ERROR'
  | 'WIPE_ERROR'
  | 'TRANSFER_OWNERSHIP_ERROR'
  | 'CHANGE_PROPERTIES_ERROR'
  | 'ISSUE_NFT_ERROR'
  | 'CREATE_NFT_ERROR'
  | 'SEND_NFT_ERROR'
  | 'ISSUE_SFT_ERROR'
  | 'CREATE_SFT_ERROR'
  | 'SEND_SFT_ERROR'
  | 'ISSUE_META_ESDT_ERROR'
  | 'CREATE_META_ESDT_ERROR'
  | 'SEND_META_ESDT_ERROR'
  | 'MULTI_TRANSFER_ERROR'
  | 'DECODE_TRANSACTION_ERROR'
  | 'HEROTAG_ERROR'
  | 'CONVERTER_ERROR'
  | 'STORE_VALUE_ERROR'
  | 'GET_VALUE_ERROR'
  | 'CLAIM_REWARDS_ERROR'
  | 'CHANGE_OWNER_ERROR';

class AppError extends Error {
  constructor(
    public code,
    message) {
    super(message);
    this.name = 'AppError';
  }
}

class AuthError extends AppError {
  constructor(message) {
    super('UNAUTHORIZED', message);
    this.name = 'AuthError';
  }
}

const handleError = (error) => {
  if (error instanceof AppError) {
    return {
      success,
      error: {
        code,
        message: error.message
      }
    };
  }

  if (Array.isArray(error) && error.length > 0 && 'param' in error[0]) {
    const validationErrors = error ;
    return {
      success,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: validationErrors.map(err => ({
          param,
          msg,
          value: err.value
        }))
      }
    };
  }

  return {
    success,
    error: {
      code: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  };
}; 
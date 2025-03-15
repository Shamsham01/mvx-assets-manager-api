const { AppError } = require('../utils/errors');
const { multiTransfer } = require('../multi-transfer');
const { decodeTransaction } = require('../decode-transaction');
const { herotag } = require('../herotag');
const { converters } = require('../converters');

const multiTransfer = async (params) => {
  try {
    return await multiTransferOp(params);
  } catch (error) {
    throw new AppError('MULTI_TRANSFER_ERROR', error.message);
  }
};

const decodeTransaction = async (params) => {
  try {
    return await decodeTransactionOp(params);
  } catch (error) {
    throw new AppError('DECODE_TRANSACTION_ERROR', error.message);
  }
};

const herotag = async (params) => {
  try {
    return await herotagOp(params);
  } catch (error) {
    throw new AppError('HEROTAG_ERROR', error.message);
  }
};

const converters = async (params) => {
  try {
    return await convertersOp(params);
  } catch (error) {
    throw new AppError('CONVERTER_ERROR', error.message);
  }
}; 
const { multiTransfer, decodeTransaction, herotag, converters, MultiTransferParams, DecodeTransactionParams, HerotagParams, ConverterParams } = require('../services/utils.service');

const handleMultiTransfer = async (params) => {
  return await multiTransfer(params);
};

const handleDecodeTransaction = async (params) => {
  return await decodeTransaction(params);
};

const handleHerotag = async (params) => {
  return await herotag(params);
};

const handleConverters = async (params) => {
  return await converters(params);
}; 
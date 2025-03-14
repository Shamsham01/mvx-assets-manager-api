import {
  multiTransfer,
  decodeTransaction,
  herotag,
  converters,
  MultiTransferParams,
  DecodeTransactionParams,
  HerotagParams,
  ConverterParams
} from '../services/utils.service';

export const handleMultiTransfer = async (params: MultiTransferParams) => {
  return await multiTransfer(params);
};

export const handleDecodeTransaction = async (params: DecodeTransactionParams) => {
  return await decodeTransaction(params);
};

export const handleHerotag = async (params: HerotagParams) => {
  return await herotag(params);
};

export const handleConverters = async (params: ConverterParams) => {
  return await converters(params);
}; 
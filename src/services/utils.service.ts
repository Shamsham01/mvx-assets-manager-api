import { ApiError } from '../utils/errors';
import { multiTransfer as multiTransferOp } from '../multi-transfer';
import { decodeTransaction as decodeTransactionOp } from '../decode-transaction';
import { herotag as herotagOp } from '../herotag';
import { converters as convertersOp } from '../converters';

export interface MultiTransferParams {
  to: string;
  tokens: {
    identifier: string;
    nonce?: number;
    amount: string;
  }[];
}

export interface DecodeTransactionParams {
  data: string;
  sender: string;
  receiver: string;
  value?: string;
}

export interface HerotagParams {
  action: 'create' | 'check';
  herotag?: string;
  address?: string;
}

export interface ConverterParams {
  action: 'bech32ToHex' | 'hexToBech32' | 'valueToHex' | 'hexToValue';
  value: string;
}

export const multiTransfer = async (params: MultiTransferParams) => {
  try {
    return await multiTransferOp(params);
  } catch (error) {
    throw new ApiError('MULTI_TRANSFER_ERROR', error.message);
  }
};

export const decodeTransaction = async (params: DecodeTransactionParams) => {
  try {
    return await decodeTransactionOp(params);
  } catch (error) {
    throw new ApiError('DECODE_TRANSACTION_ERROR', error.message);
  }
};

export const herotag = async (params: HerotagParams) => {
  try {
    return await herotagOp(params);
  } catch (error) {
    throw new ApiError('HEROTAG_ERROR', error.message);
  }
};

export const converters = async (params: ConverterParams) => {
  try {
    return await convertersOp(params);
  } catch (error) {
    throw new ApiError('CONVERTER_ERROR', error.message);
  }
}; 
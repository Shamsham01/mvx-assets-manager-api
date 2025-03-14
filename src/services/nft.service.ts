import { ApiError } from '../utils/errors';
import { issueNft as issueNftOp } from '../nft/issue-nft';
import { toggleSpecialRolesNft } from '../nft/toggle-special-roles-nft';
import { createNft as createNftOp } from '../nft/create-nft';
import { sendNft as sendNftOp } from '../nft/send-nft';
import { changePropertiesNft as changePropertiesNftOp } from '../nft/change-properties-nft';

export interface IssueNftParams {
  tokenName: string;
  tokenTicker: string;
  properties: {
    canFreeze: boolean;
    canWipe: boolean;
    canPause: boolean;
    canTransferNftCreateRole: boolean;
    canChangeOwner: boolean;
    canUpgrade: boolean;
    canAddSpecialRoles: boolean;
  };
}

export interface CreateNftParams {
  collection: string;
  name: string;
  quantity: string;
  royalties: string;
  hash: string;
  attributes: string;
  uris: string[];
}

export interface SendNftParams {
  to: string;
  collection: string;
  nonce: number;
}

export interface ToggleRolesParams {
  collection: string;
  address: string;
  roles: string[];
  action: 'set' | 'unset';
}

export interface ChangePropertiesParams {
  collection: string;
  properties: {
    canFreeze?: boolean;
    canWipe?: boolean;
    canPause?: boolean;
    canTransferNftCreateRole?: boolean;
    canChangeOwner?: boolean;
    canUpgrade?: boolean;
    canAddSpecialRoles?: boolean;
  };
}

export const issueNFT = async (params: IssueNftParams) => {
  try {
    return await issueNftOp(params);
  } catch (error) {
    throw new ApiError('ISSUE_NFT_ERROR', error.message);
  }
};

export const createNFT = async (params: CreateNftParams) => {
  try {
    return await createNftOp(params);
  } catch (error) {
    throw new ApiError('CREATE_NFT_ERROR', error.message);
  }
};

export const sendNFT = async (params: SendNftParams) => {
  try {
    return await sendNftOp(params);
  } catch (error) {
    throw new ApiError('SEND_NFT_ERROR', error.message);
  }
};

export const toggleRoles = async (params: ToggleRolesParams) => {
  try {
    return await toggleSpecialRolesNft(params.action)(params);
  } catch (error) {
    throw new ApiError('TOGGLE_ROLES_ERROR', error.message);
  }
};

export const changeProperties = async (params: ChangePropertiesParams) => {
  try {
    return await changePropertiesNftOp(params);
  } catch (error) {
    throw new ApiError('CHANGE_PROPERTIES_ERROR', error.message);
  }
}; 
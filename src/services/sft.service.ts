import { ApiError } from '../utils/errors';
import { issueSft as issueSftOp } from '../sft/issue-sft';
import { toggleSpecialRolesSft } from '../sft/toggle-special-roles-sft';
import { createSft as createSftOp } from '../sft/create-sft';
import { sendSft as sendSftOp } from '../sft/send-sft';
import { changePropertiesSft as changePropertiesSftOp } from '../sft/change-properties-sft';

export interface IssueSftParams {
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

export interface CreateSftParams {
  collection: string;
  name: string;
  quantity: string;
  royalties: string;
  hash: string;
  attributes: string;
  uris: string[];
}

export interface SendSftParams {
  to: string;
  collection: string;
  nonce: number;
  quantity: string;
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

export const issueSFT = async (params: IssueSftParams) => {
  try {
    return await issueSftOp(params);
  } catch (error) {
    throw new ApiError('ISSUE_SFT_ERROR', error.message);
  }
};

export const createSFT = async (params: CreateSftParams) => {
  try {
    return await createSftOp(params);
  } catch (error) {
    throw new ApiError('CREATE_SFT_ERROR', error.message);
  }
};

export const sendSFT = async (params: SendSftParams) => {
  try {
    return await sendSftOp(params);
  } catch (error) {
    throw new ApiError('SEND_SFT_ERROR', error.message);
  }
};

export const toggleRoles = async (params: ToggleRolesParams) => {
  try {
    return await toggleSpecialRolesSft(params.action)(params);
  } catch (error) {
    throw new ApiError('TOGGLE_ROLES_ERROR', error.message);
  }
};

export const changeProperties = async (params: ChangePropertiesParams) => {
  try {
    return await changePropertiesSftOp(params);
  } catch (error) {
    throw new ApiError('CHANGE_PROPERTIES_ERROR', error.message);
  }
}; 
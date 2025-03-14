import { ApiError } from '../utils/errors';
import { issueMetaEsdt as issueMetaEsdtOp } from '../meta-esdt/issue-meta-esdt';
import { toggleSpecialRolesMetaEsdt } from '../meta-esdt/toggle-special-roles-meta-esdt';
import { createMetaEsdt as createMetaEsdtOp } from '../meta-esdt/create-meta-esdt';
import { sendMetaEsdt as sendMetaEsdtOp } from '../meta-esdt/send-meta-esdt';
import { changePropertiesMetaEsdt as changePropertiesMetaEsdtOp } from '../meta-esdt/change-properties-meta-esdt';

export interface IssueMetaEsdtParams {
  tokenName: string;
  tokenTicker: string;
  numDecimals: number;
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

export interface CreateMetaEsdtParams {
  collection: string;
  name: string;
  quantity: string;
  royalties: string;
  hash: string;
  attributes: string;
  uris: string[];
}

export interface SendMetaEsdtParams {
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

export const issueMetaESDT = async (params: IssueMetaEsdtParams) => {
  try {
    return await issueMetaEsdtOp(params);
  } catch (error) {
    throw new ApiError('ISSUE_META_ESDT_ERROR', error.message);
  }
};

export const createMetaESDT = async (params: CreateMetaEsdtParams) => {
  try {
    return await createMetaEsdtOp(params);
  } catch (error) {
    throw new ApiError('CREATE_META_ESDT_ERROR', error.message);
  }
};

export const sendMetaESDT = async (params: SendMetaEsdtParams) => {
  try {
    return await sendMetaEsdtOp(params);
  } catch (error) {
    throw new ApiError('SEND_META_ESDT_ERROR', error.message);
  }
};

export const toggleRoles = async (params: ToggleRolesParams) => {
  try {
    return await toggleSpecialRolesMetaEsdt(params.action)(params);
  } catch (error) {
    throw new ApiError('TOGGLE_ROLES_ERROR', error.message);
  }
};

export const changeProperties = async (params: ChangePropertiesParams) => {
  try {
    return await changePropertiesMetaEsdtOp(params);
  } catch (error) {
    throw new ApiError('CHANGE_PROPERTIES_ERROR', error.message);
  }
}; 
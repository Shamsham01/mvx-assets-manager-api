import { ApiError } from '../utils/errors';
import { issueEsdt as issueEsdtOp } from '../esdt/issue-esdt';
import { mintBurnEsdt as mintBurnEsdtOp } from '../esdt/mint-burn-esdt';
import { toggleSpecialRolesEsdt } from '../esdt/toggle-special-roles-esdt';
import { sendEsdt as sendEsdtOp } from '../esdt/send-esdt';
import { pauseUnpauseEsdt as pauseUnpauseEsdtOp } from '../esdt/pause-unpause';
import { freezeUnfreezeEsdt as freezeUnfreezeEsdtOp } from '../esdt/freeze-unfreeze-esdt';
import { wipeEsdt as wipeEsdtOp } from '../esdt/wipe-esdt';
import { transferOwnershipEsdt as transferOwnershipEsdtOp } from '../esdt/transfer-ownership-esdt';
import { changePropertiesEsdt as changePropertiesEsdtOp } from '../esdt/change-properties-esdt';

export interface IssueEsdtParams {
  tokenName: string;
  tokenTicker: string;
  initialSupply: string;
  decimals: number;
  properties: {
    canFreeze: boolean;
    canWipe: boolean;
    canPause: boolean;
    canMint: boolean;
    canBurn: boolean;
    canChangeOwner: boolean;
    canUpgrade: boolean;
    canAddSpecialRoles: boolean;
  };
}

export interface MintBurnEsdtParams {
  tokenIdentifier: string;
  amount: string;
  operation: 'mint' | 'burn';
}

export interface SendEsdtParams {
  to: string;
  tokenIdentifier: string;
  amount: string;
}

export interface ToggleRolesParams {
  tokenIdentifier: string;
  address: string;
  roles: string[];
  action: 'set' | 'unset';
}

export interface FreezeUnfreezeParams {
  tokenIdentifier: string;
  address: string;
  action: 'freeze' | 'unfreeze';
}

export interface WipeParams {
  tokenIdentifier: string;
  address: string;
}

export interface TransferOwnershipParams {
  tokenIdentifier: string;
  newOwner: string;
}

export interface ChangePropertiesParams {
  tokenIdentifier: string;
  properties: {
    canFreeze?: boolean;
    canWipe?: boolean;
    canPause?: boolean;
    canMint?: boolean;
    canBurn?: boolean;
    canChangeOwner?: boolean;
    canUpgrade?: boolean;
    canAddSpecialRoles?: boolean;
  };
}

export const issueESDT = async (params: IssueEsdtParams) => {
  try {
    return await issueEsdtOp(params);
  } catch (error) {
    throw new ApiError('ISSUE_ESDT_ERROR', error.message);
  }
};

export const mintBurnESDT = async (params: MintBurnEsdtParams) => {
  try {
    return await mintBurnEsdtOp(params);
  } catch (error) {
    throw new ApiError('MINT_BURN_ESDT_ERROR', error.message);
  }
};

export const sendESDT = async (params: SendEsdtParams) => {
  try {
    return await sendEsdtOp(params);
  } catch (error) {
    throw new ApiError('SEND_ESDT_ERROR', error.message);
  }
};

export const toggleRoles = async (params: ToggleRolesParams) => {
  try {
    return await toggleSpecialRolesEsdt(params.action)(params);
  } catch (error) {
    throw new ApiError('TOGGLE_ROLES_ERROR', error.message);
  }
};

export const freezeUnfreeze = async (params: FreezeUnfreezeParams) => {
  try {
    return await freezeUnfreezeEsdtOp(params);
  } catch (error) {
    throw new ApiError('FREEZE_UNFREEZE_ERROR', error.message);
  }
};

export const wipe = async (params: WipeParams) => {
  try {
    return await wipeEsdtOp(params);
  } catch (error) {
    throw new ApiError('WIPE_ERROR', error.message);
  }
};

export const transferOwnership = async (params: TransferOwnershipParams) => {
  try {
    return await transferOwnershipEsdtOp(params);
  } catch (error) {
    throw new ApiError('TRANSFER_OWNERSHIP_ERROR', error.message);
  }
};

export const changeProperties = async (params: ChangePropertiesParams) => {
  try {
    return await changePropertiesEsdtOp(params);
  } catch (error) {
    throw new ApiError('CHANGE_PROPERTIES_ERROR', error.message);
  }
}; 
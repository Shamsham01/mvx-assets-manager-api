import {
  issueESDT,
  mintBurnESDT,
  sendESDT,
  toggleRoles,
  freezeUnfreeze,
  wipe,
  transferOwnership,
  changeProperties,
  IssueEsdtParams,
  MintBurnEsdtParams,
  SendEsdtParams,
  ToggleRolesParams,
  FreezeUnfreezeParams,
  WipeParams,
  TransferOwnershipParams,
  ChangePropertiesParams
} from '../services/esdt.service';
import { ApiError } from '../utils/errors';

export const issueEsdt = async (params: IssueEsdtParams) => {
  try {
    const result = await issueESDT(params);

    return {
      tokenIdentifier: result.tokenIdentifier,
      transactionHash: result.hash,
      status: result.status
    };
  } catch (error) {
    throw new ApiError('ISSUE_ESDT_ERROR', error.message);
  }
};

export const mintBurnEsdt = async (params: MintBurnEsdtParams) => {
  return await mintBurnESDT(params);
};

export const sendEsdt = async (params: SendEsdtParams) => {
  return await sendESDT(params);
};

export const toggleEsdtRoles = async (params: ToggleRolesParams) => {
  return await toggleRoles(params);
};

export const freezeUnfreezeEsdt = async (params: FreezeUnfreezeParams) => {
  return await freezeUnfreeze(params);
};

export const wipeEsdt = async (params: WipeParams) => {
  return await wipe(params);
};

export const transferEsdtOwnership = async (params: TransferOwnershipParams) => {
  return await transferOwnership(params);
};

export const changeEsdtProperties = async (params: ChangePropertiesParams) => {
  return await changeProperties(params);
}; 
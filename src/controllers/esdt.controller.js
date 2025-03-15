const { issueESDT, mintBurnESDT, sendESDT, toggleRoles, freezeUnfreeze, wipe, transferOwnership, changeProperties, IssueEsdtParams, MintBurnEsdtParams, SendEsdtParams, ToggleRolesParams, FreezeUnfreezeParams, WipeParams, TransferOwnershipParams, ChangePropertiesParams } = require('../services/esdt.service');
const { AppError } = require('../utils/errors');

const issueEsdt = async (params) => {
  try {
    const result = await issueESDT(params);

    return {
      tokenIdentifier,
      transactionHash,
      status: result.status
    };
  } catch (error) {
    throw new AppError('ISSUE_ESDT_ERROR', error.message);
  }
};

const mintBurnEsdt = async (params) => {
  return await mintBurnESDT(params);
};

const sendEsdt = async (params) => {
  return await sendESDT(params);
};

const toggleEsdtRoles = async (params) => {
  return await toggleRoles(params);
};

const freezeUnfreezeEsdt = async (params) => {
  return await freezeUnfreeze(params);
};

const wipeEsdt = async (params) => {
  return await wipe(params);
};

const transferEsdtOwnership = async (params) => {
  return await transferOwnership(params);
};

const changeEsdtProperties = async (params) => {
  return await changeProperties(params);
}; 
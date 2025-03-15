const { AppError } = require('../utils/errors');
const { issueEsdt } = require('../esdt/issue-esdt');
const { mintBurnEsdt } = require('../esdt/mint-burn-esdt');
const { toggleSpecialRolesEsdt } = require('../esdt/toggle-special-roles-esdt');
const { sendEsdt } = require('../esdt/send-esdt');
const { pauseUnpauseEsdt } = require('../esdt/pause-unpause');
const { freezeUnfreezeEsdt } = require('../esdt/freeze-unfreeze-esdt');
const { wipeEsdt } = require('../esdt/wipe-esdt');
const { transferOwnershipEsdt } = require('../esdt/transfer-ownership-esdt');
const { changePropertiesEsdt } = require('../esdt/change-properties-esdt');

const issueESDT = async (params) => {
  try {
    return await issueEsdtOp(params);
  } catch (error) {
    throw new AppError('ISSUE_ESDT_ERROR', error.message);
  }
};

const mintBurnESDT = async (params) => {
  try {
    return await mintBurnEsdtOp(params);
  } catch (error) {
    throw new AppError('MINT_BURN_ESDT_ERROR', error.message);
  }
};

const sendESDT = async (params) => {
  try {
    return await sendEsdtOp(params);
  } catch (error) {
    throw new AppError('SEND_ESDT_ERROR', error.message);
  }
};

const toggleRoles = async (params) => {
  try {
    return await toggleSpecialRolesEsdt(params.action)(params);
  } catch (error) {
    throw new AppError('TOGGLE_ROLES_ERROR', error.message);
  }
};

const freezeUnfreeze = async (params) => {
  try {
    return await freezeUnfreezeEsdtOp(params);
  } catch (error) {
    throw new AppError('FREEZE_UNFREEZE_ERROR', error.message);
  }
};

const wipe = async (params) => {
  try {
    return await wipeEsdtOp(params);
  } catch (error) {
    throw new AppError('WIPE_ERROR', error.message);
  }
};

const transferOwnership = async (params) => {
  try {
    return await transferOwnershipEsdtOp(params);
  } catch (error) {
    throw new AppError('TRANSFER_OWNERSHIP_ERROR', error.message);
  }
};

const changeProperties = async (params) => {
  try {
    return await changePropertiesEsdtOp(params);
  } catch (error) {
    throw new AppError('CHANGE_PROPERTIES_ERROR', error.message);
  }
}; 
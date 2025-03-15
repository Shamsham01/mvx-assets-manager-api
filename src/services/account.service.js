const { AppError } = require('../utils/errors');
const { storeKeyValue, getKeyValue } = require('../account-store');
const { claimDevRewards } = require('../claim-dev-rewards');
const { changeOwnerAddress } = require('../change-owner-address');

const storeValue = async (params) => {
  try {
    return await storeKeyValue(params);
  } catch (error) {
    throw new AppError('STORE_VALUE_ERROR', error.message);
  }
};

const getValue = async (params) => {
  try {
    return await getKeyValue(params);
  } catch (error) {
    throw new AppError('GET_VALUE_ERROR', error.message);
  }
};

const claimDevRewards = async (params) => {
  try {
    return await claimDevRewardsOp(params);
  } catch (error) {
    throw new AppError('CLAIM_REWARDS_ERROR', error.message);
  }
};

const changeOwner = async (params) => {
  try {
    return await changeOwnerAddressOp(params);
  } catch (error) {
    throw new AppError('CHANGE_OWNER_ERROR', error.message);
  }
}; 
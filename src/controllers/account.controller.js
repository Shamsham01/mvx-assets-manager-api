const { storeValue, getValue, claimDevRewards, changeOwner, StoreKeyValueParams, GetKeyValueParams, ClaimDevRewardsParams, ChangeOwnerParams } = require('../services/account.service');

const handleStoreValue = async (params) => {
  return await storeValue(params);
};

const handleGetValue = async (params) => {
  return await getValue(params);
};

const handleClaimDevRewards = async (params) => {
  return await claimDevRewards(params);
};

const handleChangeOwner = async (params) => {
  return await changeOwner(params);
}; 
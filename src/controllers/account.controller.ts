import {
  storeValue,
  getValue,
  claimDevRewards,
  changeOwner,
  StoreKeyValueParams,
  GetKeyValueParams,
  ClaimDevRewardsParams,
  ChangeOwnerParams
} from '../services/account.service';

export const handleStoreValue = async (params: StoreKeyValueParams) => {
  return await storeValue(params);
};

export const handleGetValue = async (params: GetKeyValueParams) => {
  return await getValue(params);
};

export const handleClaimDevRewards = async (params: ClaimDevRewardsParams) => {
  return await claimDevRewards(params);
};

export const handleChangeOwner = async (params: ChangeOwnerParams) => {
  return await changeOwner(params);
}; 
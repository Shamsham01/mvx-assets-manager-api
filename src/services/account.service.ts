import { ApiError } from '../utils/errors';
import { storeKeyValue, getKeyValue } from '../account-store';
import { claimDevRewards as claimDevRewardsOp } from '../claim-dev-rewards';
import { changeOwnerAddress as changeOwnerAddressOp } from '../change-owner-address';

export interface StoreKeyValueParams {
  key: string;
  value: string;
}

export interface GetKeyValueParams {
  key: string;
}

export interface ClaimDevRewardsParams {
  address: string;
}

export interface ChangeOwnerParams {
  oldOwner: string;
  newOwner: string;
}

export const storeValue = async (params: StoreKeyValueParams) => {
  try {
    return await storeKeyValue(params);
  } catch (error) {
    throw new ApiError('STORE_VALUE_ERROR', error.message);
  }
};

export const getValue = async (params: GetKeyValueParams) => {
  try {
    return await getKeyValue(params);
  } catch (error) {
    throw new ApiError('GET_VALUE_ERROR', error.message);
  }
};

export const claimDevRewards = async (params: ClaimDevRewardsParams) => {
  try {
    return await claimDevRewardsOp(params);
  } catch (error) {
    throw new ApiError('CLAIM_REWARDS_ERROR', error.message);
  }
};

export const changeOwner = async (params: ChangeOwnerParams) => {
  try {
    return await changeOwnerAddressOp(params);
  } catch (error) {
    throw new ApiError('CHANGE_OWNER_ERROR', error.message);
  }
}; 
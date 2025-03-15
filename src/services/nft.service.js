const { AppError } = require('../utils/errors');
const { issueNft } = require('../nft/issue-nft');
const { toggleSpecialRolesNft } = require('../nft/toggle-special-roles-nft');
const { createNft } = require('../nft/create-nft');
const { sendNft } = require('../nft/send-nft');
const { changePropertiesNft } = require('../nft/change-properties-nft');

const issueNFT = async (params) => {
  try {
    return await issueNftOp(params);
  } catch (error) {
    throw new AppError('ISSUE_NFT_ERROR', error.message);
  }
};

const createNFT = async (params) => {
  try {
    return await createNftOp(params);
  } catch (error) {
    throw new AppError('CREATE_NFT_ERROR', error.message);
  }
};

const sendNFT = async (params) => {
  try {
    return await sendNftOp(params);
  } catch (error) {
    throw new AppError('SEND_NFT_ERROR', error.message);
  }
};

const toggleRoles = async (params) => {
  try {
    return await toggleSpecialRolesNft(params.action)(params);
  } catch (error) {
    throw new AppError('TOGGLE_ROLES_ERROR', error.message);
  }
};

const changeProperties = async (params) => {
  try {
    return await changePropertiesNftOp(params);
  } catch (error) {
    throw new AppError('CHANGE_PROPERTIES_ERROR', error.message);
  }
}; 
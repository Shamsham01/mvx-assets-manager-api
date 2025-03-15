const { issueNFT, createNFT, sendNFT, toggleRoles, changeProperties, IssueNftParams, CreateNftParams, SendNftParams, ToggleRolesParams, ChangePropertiesParams } = require('../services/nft.service');

const issueNft = async (params) => {
  return await issueNFT(params);
};

const createNft = async (params) => {
  return await createNFT(params);
};

const sendNft = async (params) => {
  return await sendNFT(params);
};

const toggleNftRoles = async (params) => {
  return await toggleRoles(params);
};

const changeNftProperties = async (params) => {
  return await changeProperties(params);
}; 
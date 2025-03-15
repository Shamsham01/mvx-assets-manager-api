const { issueSFT, createSFT, sendSFT, toggleRoles, changeProperties, IssueSftParams, CreateSftParams, SendSftParams, ToggleRolesParams, ChangePropertiesParams } = require('../services/sft.service');

const issueSft = async (params) => {
  return await issueSFT(params);
};

const createSft = async (params) => {
  return await createSFT(params);
};

const sendSft = async (params) => {
  return await sendSFT(params);
};

const toggleSftRoles = async (params) => {
  return await toggleRoles(params);
};

const changeSftProperties = async (params) => {
  return await changeProperties(params);
}; 
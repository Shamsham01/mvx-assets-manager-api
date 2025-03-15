const { issueMetaESDT, createMetaESDT, sendMetaESDT, toggleRoles, changeProperties, IssueMetaEsdtParams, CreateMetaEsdtParams, SendMetaEsdtParams, ToggleRolesParams, ChangePropertiesParams } = require('../services/meta-esdt.service');

const issueMetaEsdt = async (params) => {
  return await issueMetaESDT(params);
};

const createMetaEsdt = async (params) => {
  return await createMetaESDT(params);
};

const sendMetaEsdt = async (params) => {
  return await sendMetaESDT(params);
};

const toggleMetaEsdtRoles = async (params) => {
  return await toggleRoles(params);
};

const changeMetaEsdtProperties = async (params) => {
  return await changeProperties(params);
}; 
const { AppError } = require('../utils/errors');
const { issueMetaEsdt } = require('../meta-esdt/issue-meta-esdt');
const { toggleSpecialRolesMetaEsdt } = require('../meta-esdt/toggle-special-roles-meta-esdt');
const { createMetaEsdt } = require('../meta-esdt/create-meta-esdt');
const { sendMetaEsdt } = require('../meta-esdt/send-meta-esdt');
const { changePropertiesMetaEsdt } = require('../meta-esdt/change-properties-meta-esdt');

const issueMetaESDT = async (params) => {
  try {
    return await issueMetaEsdtOp(params);
  } catch (error) {
    throw new AppError('ISSUE_META_ESDT_ERROR', error.message);
  }
};

const createMetaESDT = async (params) => {
  try {
    return await createMetaEsdtOp(params);
  } catch (error) {
    throw new AppError('CREATE_META_ESDT_ERROR', error.message);
  }
};

const sendMetaESDT = async (params) => {
  try {
    return await sendMetaEsdtOp(params);
  } catch (error) {
    throw new AppError('SEND_META_ESDT_ERROR', error.message);
  }
};

const toggleRoles = async (params) => {
  try {
    return await toggleSpecialRolesMetaEsdt(params.action)(params);
  } catch (error) {
    throw new AppError('TOGGLE_ROLES_ERROR', error.message);
  }
};

const changeProperties = async (params) => {
  try {
    return await changePropertiesMetaEsdtOp(params);
  } catch (error) {
    throw new AppError('CHANGE_PROPERTIES_ERROR', error.message);
  }
}; 
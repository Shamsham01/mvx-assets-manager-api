const { AppError } = require('../utils/errors');
const { issueSft } = require('../sft/issue-sft');
const { toggleSpecialRolesSft } = require('../sft/toggle-special-roles-sft');
const { createSft } = require('../sft/create-sft');
const { sendSft } = require('../sft/send-sft');
const { changePropertiesSft } = require('../sft/change-properties-sft');

const issueSFT = async (params) => {
  try {
    return await issueSftOp(params);
  } catch (error) {
    throw new AppError('ISSUE_SFT_ERROR', error.message);
  }
};

const createSFT = async (params) => {
  try {
    return await createSftOp(params);
  } catch (error) {
    throw new AppError('CREATE_SFT_ERROR', error.message);
  }
};

const sendSFT = async (params) => {
  try {
    return await sendSftOp(params);
  } catch (error) {
    throw new AppError('SEND_SFT_ERROR', error.message);
  }
};

const toggleRoles = async (params) => {
  try {
    return await toggleSpecialRolesSft(params.action)(params);
  } catch (error) {
    throw new AppError('TOGGLE_ROLES_ERROR', error.message);
  }
};

const changeProperties = async (params) => {
  try {
    return await changePropertiesSftOp(params);
  } catch (error) {
    throw new AppError('CHANGE_PROPERTIES_ERROR', error.message);
  }
}; 
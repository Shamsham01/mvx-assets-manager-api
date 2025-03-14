import {
  issueSFT,
  createSFT,
  sendSFT,
  toggleRoles,
  changeProperties,
  IssueSftParams,
  CreateSftParams,
  SendSftParams,
  ToggleRolesParams,
  ChangePropertiesParams
} from '../services/sft.service';

export const issueSft = async (params: IssueSftParams) => {
  return await issueSFT(params);
};

export const createSft = async (params: CreateSftParams) => {
  return await createSFT(params);
};

export const sendSft = async (params: SendSftParams) => {
  return await sendSFT(params);
};

export const toggleSftRoles = async (params: ToggleRolesParams) => {
  return await toggleRoles(params);
};

export const changeSftProperties = async (params: ChangePropertiesParams) => {
  return await changeProperties(params);
}; 
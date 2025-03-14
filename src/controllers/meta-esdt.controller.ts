import {
  issueMetaESDT,
  createMetaESDT,
  sendMetaESDT,
  toggleRoles,
  changeProperties,
  IssueMetaEsdtParams,
  CreateMetaEsdtParams,
  SendMetaEsdtParams,
  ToggleRolesParams,
  ChangePropertiesParams
} from '../services/meta-esdt.service';

export const issueMetaEsdt = async (params: IssueMetaEsdtParams) => {
  return await issueMetaESDT(params);
};

export const createMetaEsdt = async (params: CreateMetaEsdtParams) => {
  return await createMetaESDT(params);
};

export const sendMetaEsdt = async (params: SendMetaEsdtParams) => {
  return await sendMetaESDT(params);
};

export const toggleMetaEsdtRoles = async (params: ToggleRolesParams) => {
  return await toggleRoles(params);
};

export const changeMetaEsdtProperties = async (params: ChangePropertiesParams) => {
  return await changeProperties(params);
}; 
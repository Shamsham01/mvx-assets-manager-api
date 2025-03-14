import {
  issueNFT,
  createNFT,
  sendNFT,
  toggleRoles,
  changeProperties,
  IssueNftParams,
  CreateNftParams,
  SendNftParams,
  ToggleRolesParams,
  ChangePropertiesParams
} from '../services/nft.service';

export const issueNft = async (params: IssueNftParams) => {
  return await issueNFT(params);
};

export const createNft = async (params: CreateNftParams) => {
  return await createNFT(params);
};

export const sendNft = async (params: SendNftParams) => {
  return await sendNFT(params);
};

export const toggleNftRoles = async (params: ToggleRolesParams) => {
  return await toggleRoles(params);
};

export const changeNftProperties = async (params: ChangePropertiesParams) => {
  return await changeProperties(params);
}; 
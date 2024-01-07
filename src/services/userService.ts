import { APP_API } from "src/@core/static/api.constant";
import { get, post, deleteCall } from "../@core/services/masterServices";
import { setApiBaseUrl } from "src/@core/services/interceptor";

export const getUserInfo = () => {
  setApiBaseUrl();
  return get(APP_API.userProfile).then((response) => response?.data);
};

export const checkUsername = (username: string) => {
  setApiBaseUrl();
  const url = APP_API.checkUser.replace('{username}', username)
  return get(url).then((response) => response?.data);
};

export const checkEmail = (email: string) => {
  setApiBaseUrl();
  const url = APP_API.checkEmail.replace('{email}', email)
  return get(url).then((response) => response?.data);
};


export const getUserProfile = () => {
  setApiBaseUrl();
  return get(APP_API.userProfile).then(
    (response) => response?.data)
};

export const postUserProfile = (profile: any) => {
  setApiBaseUrl();
  return post(APP_API.userProfile, profile).then(
    (response) => response?.data
  )
};

export const deactivateUser = () => {
  setApiBaseUrl();
  return deleteCall(APP_API.deactivateUser).then(
    (response) => response?.data
  );
};

export const getWorkspcaes = () => {
  setApiBaseUrl();
  return get(APP_API.getListOfWorkspaces).then(
    (response) => response?.data)
}

export const getOrganisations = () => {
  setApiBaseUrl();
  return get(APP_API.OrgList).then(
    (response) => response?.data)
}
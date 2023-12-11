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


export const userProfile = (uProfile: any, call: string) => {
  setApiBaseUrl();
  return call === "post" ? post(APP_API.userProfile, uProfile).then(
    (response) => response?.data
  ) : get(APP_API.userProfile).then(
    (response) => response?.data)
};

export const deactivateUser = () => {
  setApiBaseUrl();
  return deleteCall(APP_API.deactivateUser).then(
    (response) => response?.data
  );
};
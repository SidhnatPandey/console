import { AxiosResponse } from "axios";
import { get, post } from "../@core/services/masterServices";
import { APP_API } from "src/@core/static/api.constant";
import { setApiBaseUrl } from "src/@core/services/interceptor";

export const signUp = (user: any) => {
  setApiBaseUrl();
  return post(APP_API.registerUser, user).then(
    (response) => response?.data
  );
};

export const login = (
  loginDetail: any,
  apiFunction: (partialUrl: string, data: any) => Promise<AxiosResponse<any, any>>
) => {
  setApiBaseUrl();
  return apiFunction(APP_API.login, loginDetail).then((response) => response?.data);
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

export const forgotPassword = (email: string) => {
  setApiBaseUrl();
  return post(APP_API.forgetPassword, { email }).then(
    (response) => response?.data
  );
};


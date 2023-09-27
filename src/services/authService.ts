import { AxiosResponse } from "axios";
import { getPublic, postPublic } from "./masterServices";

export const signUp = (user: any) => {
  return postPublic("/initializ/v1/registerUser", user).then(
    (response) => response.data
  );
};

export const login = (
  loginDetail: any,
  apiFunction: (partialUrl: string, data: any, params?: {}) => Promise<AxiosResponse<any, any>>
) => {
  return apiFunction("/login", loginDetail).then((response) => response.data);
};

export const checkUsername = (username: string) => {
  return getPublic(`/checkUser/${username}`).then((response) => response.data);
};

export const checkEmail = (email: string) => {
  return getPublic(`/checkEmail/${email}`).then((response) => response.data);
};

export const forgotPassword = (email: string) => {
  return postPublic("/initializ/v1/forgetPassword", { email }).then(
    (response) => response.data
  );
};


import { getPublic, postPublic } from "./masterServices";

export const signUp = (user: any) => {
  return postPublic("/initializ/v1/registerUser", user).then(
    (response) => response.data
  );
};

export const login = (loginDetail: any) => {
  return postPublic("/login", loginDetail).then((response) => response.data);
};

export const checkUsername = (username: string) => {
  return getPublic(`/checkUser/${username}`).then((response) => response.data);
};

export const checkEmail = (email: string) => {
  return getPublic(`/checkEmail/${email}`).then((response) => response.data);
};

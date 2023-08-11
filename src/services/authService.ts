import { get, post } from "./masterServices";

export const signUp = (user: any) => {
  return post("/initializ/v1/registerUser", user).then(
    (response) => response.data
  );
};

export const login = (loginDetail: any) => {
  return post("/login", loginDetail).then((response) => response.data);
};

export const checkUsername = (username: string) => {
  return get(`/checkUser/${username}`).then((response) => response.data);
};

export const checkEmail = (email: string) => {
  return get(`/checkEmail/${email}`).then((response) => response.data);
};

import httpClient from "./masterServices";

export const signUp = (user: any) => {
  return httpClient.post("/initializ/v1/registerUser", user).then(
    (response) => response.data
  );
};

export const login = (loginDetail: any) => {
  return httpClient.post("/login", loginDetail).then((response) => response.data);
};

export const checkUsername = (username: string) => {
  return httpClient.get(`/checkUser/${username}`).then((response) => response.data);
};

export const checkEmail = (email: string) => {
  return httpClient.get(`/checkEmail/${email}`).then((response) => response.data);
};

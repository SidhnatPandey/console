import { get, post } from './masterServices';

export const signUp = (user: any) => {
    return post("/auth/register", user).then((response) => response.data);
};

export const login = (loginDetail: any) => {
    return post("/auth/login", loginDetail).then((response) => response.data);
};
import { APP_API } from "src/@core/static/api.constant";
import { get, post } from "../@core/services/masterServices";
import { setApiBaseUrl } from "src/@core/services/interceptor";

export const getUserInfo = () => {
    setApiBaseUrl();
    return get(APP_API.UserInfo).then((response) => response?.data);
  };
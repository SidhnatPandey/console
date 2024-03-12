import { deleteCall, get, post, put } from "src/@core/services/masterServices";
import { setApiBaseUrl } from "src/@core/services/interceptor";
import { APP_API } from "src/@core/static/api.constant";

export const saveKeys = (org_id: string, user_id: string, keysData: any) => {
  setApiBaseUrl("secret");
  let url = APP_API.savekey.replace("{org_id}", org_id);
  url = url.replace("{userId}", user_id);
  return post(url, keysData).then((response) => response?.data);
};

export const getkeys = () => {
  setApiBaseUrl("secret");
  let url = APP_API.getkey;
  return get(url).then((response) => response?.data);
};

export const getsecretkeys = (workspace_id: string, environment: string) => {
  setApiBaseUrl("secret");
  let url = APP_API.getsecret.replace("{workspace_id}",workspace_id);
  url = url.replace("{environment}", environment)
  return get(url)
};

export const saveSecret = (request: any) => {
  setApiBaseUrl("secret");
  let url = APP_API.saveSecret;
  return post(url, request).then((response) => response?.data);
};

export const updateEditedSecret = (request: any) => {
  setApiBaseUrl("secret");
  let url = APP_API.updateSecret;
  return put(url, request).then((response) => response?.data);
};

export const deleteSecret = (request: any) => {
  setApiBaseUrl("secret");
  let url = APP_API.deleteSecret;
  return deleteCall(url,request).then((response) => response?.data);
};
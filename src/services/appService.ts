import { APP_API } from "src/@core/static/api.constant";
import { deleteCall, get, post } from "../@core/services/masterServices";
import { setApiBaseUrl } from "src/@core/services/interceptor";

export const appNameExists = (appName: any) => {
  setApiBaseUrl();
  const url = APP_API.checkAppNameExists.replace("{appName}", appName);
  return get(url).then((response) => response?.data);
};
export const sendCode = (code: string) => {
  setApiBaseUrl();
  const url = APP_API.sendGitCode.replace("{code}", code);
  return get(url).then((response) => response?.data);
};

export const getGitOwner = () => {
  setApiBaseUrl();
  return get(APP_API.gitOwner).then((response) => response?.data);
};

export const getRepositories = (gituser: string) => {
  setApiBaseUrl();
  const url = APP_API.getRepositories.replace("{gituser}", gituser);
  return get(url).then((response) => response?.data);
};

export const getBranch = (repo: string, gituser: string) => {
  setApiBaseUrl();
  const arr = repo.split("/");
  let url = APP_API.getBranches.replace("{repoOwner}", arr[0]);
  url = url.replace("{repoName}", arr[1]);
  url = url.replace("{gituser}", gituser);
  return get(url).then((response) => response?.data);
};

export const saveApp = (app: any) => {
  setApiBaseUrl();
  return post(APP_API.saveApp, app).then(
    (response) => response?.data
  )
}

export const appList = (workspaceId: string) => {
  setApiBaseUrl();
  const url = APP_API.appList + '?workspaceId=' + workspaceId;
  return get(url).then((response) => response?.data);
};

export const appDetails = (id: any) => {
  setApiBaseUrl();
  let url = APP_API.appDetails;
  url = url.replace("{appId}", id);
  return get(url).then((response) => response?.data);
};

export const destroyApp = (id: string) => {
  setApiBaseUrl();
  let url = APP_API.destroyApp;
  url = url.replace("{appId}", id);
  return deleteCall(url).then((response) => response?.data);
}

export const workspace = (workspace: any) => {
  setApiBaseUrl();
  return post(APP_API.createWorkspace, workspace).then(
    (response) => response?.data
  )
}



import { APP_API } from "src/@core/static/api.constant";
import { deleteCall, get, post } from "../@core/services/masterServices";
import { setApiBaseUrl } from "src/@core/services/interceptor";

export const appNameExists = (appName: any) => {
  setApiBaseUrl();
  const url = APP_API.checkAppNameExists.replace("{appName}", appName);
  return get(url).then((response) => response?.data);
};
export const sendCode = (code: string, workspaceId: string) => {
  setApiBaseUrl();
  let url = APP_API.sendGitCode.replace("{code}", code);
  url = url + '&workspace_id=' + workspaceId
  return get(url).then((response) => response?.data);
};

export const getGitOwner = (workspaceId: string) => {
  setApiBaseUrl();
  const url = APP_API.gitOwner + '?workspace_id=' + workspaceId
  return get(url).then((response) => response?.data);
};

export const getRepositories = (gituser: string, workspaceId: string) => {
  setApiBaseUrl();
  let url = APP_API.getRepositories.replace("{gituser}", gituser);
  url = url + '&workspace_id=' + workspaceId
  return get(url).then((response) => response?.data);
};

export const getBranch = (repo: string, gituser: string, workspaceId: string) => {
  setApiBaseUrl();
  const arr = repo.split("/");
  let url = APP_API.getBranches.replace("{repoOwner}", arr[0]);
  url = url.replace("{repoName}", arr[1]);
  url = url.replace("{gituser}", gituser);
  url = url + '&workspace_id=' + workspaceId
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
  const url = APP_API.appList + '?workspace_id=' + workspaceId;
  return get(url).then((response) => response?.data);
};

export const appDetails = (id: any, workspaceId: string) => {
  setApiBaseUrl();
  let url = APP_API.appDetails;
  url = url.replace("{appId}", id);
  url = url + '?workspace_id=' + workspaceId
  return get(url).then((response) => response?.data);
};

export const destroyApp = (id: string, workspaceId: string) => {
  setApiBaseUrl();
  let url = APP_API.destroyApp;
  url = url.replace("{appId}", id);
  url = url + '?workspace_id=' + workspaceId
  return deleteCall(url).then((response) => response?.data);
}

export const workspace = (workspace: any) => {
  setApiBaseUrl();
  return post(APP_API.createWorkspace, workspace).then(
    (response) => response?.data
  )
}

export const getListOfUsersWorkspaces = (workspaceId: string) => {
  setApiBaseUrl();
  const url = `${APP_API.getListOfUsersWorkspaces}?workspace_id=${workspaceId}`;
  return get(url).then((response) => response?.data);
};

export const addUserToWorkspace = (payload: any) => {
  setApiBaseUrl();
  const url = `${APP_API.addUser}`;
  return post(url, payload).then(
    (response) => response?.data
  );
};

export const removeUserFromWorkspace = (payload: any) => {
  setApiBaseUrl();
  const url = `${APP_API.removeUser}`;
  return post(url, payload).then(
    (response) => response?.data
  );
};

export const deleteWorkspace = (workspaceId: string) => {
  setApiBaseUrl();
  const url = `${APP_API.delete}?workspace_id=${workspaceId}`;
  return deleteCall(url).then(response => response?.data);
};

export const orguser = () => {
  setApiBaseUrl();
  const url = APP_API.orgUserList;
  return get(url).then(response => response?.data);
}

export const rebuild = (appId: string, workspaceId: string) => {
  setApiBaseUrl();
  const url = APP_API.rebuild.replace('{appId}', appId).replace('{wid}', workspaceId);
  return get(url).then(response => response?.data)
}
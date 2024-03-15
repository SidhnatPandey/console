export const LOCALSTORAGE_CONSTANTS = {
  token: "accessToken",
  userInfo: "userData",
  refreshToken: "refreshToken",
  userName: "username",
  ogrId: "orgId",
  homeRoute: "default_route",
  workspace: "workspaceId",
  planId: "selectedPlanId",
  orgKey: "orgKey",
  privateKey: "privateKey",
};

export const SESSIONSTORAGE_CONSTANTS = {
  appName: "appName",
  creatAppName: "createAppName",
};

export const PERMISSION_CONSTANTS = {
  // workspaces
  workspace: "workspace",
  addWorkspace: "add-workspace",
  workspaceSettings: "workspace-settings",
  workspaceApps: "workspace-apps",

  // other
  security: "security-dashboard",
  secret: "secret-dashboard",
  document: "document",
  profile: "profile",
  editProfile: "edit-profile",
  orgSetting: "org-setting",

  //app
  appDashboard: "app-dashboard",
  deleteApp: "app-delete",
  createApp: "create-app",
  orgError: "orgError",
  workspaceError: "workspaceError",
};

//instances
export const AI_SIZE = [
  {
    type: "Extra Small",
    ram: "0.5 GB",
    vcpu: 0.1,
  },
  {
    type: "Small",
    ram: "1 GB",
    vcpu: 0.5,
  },
  {
    type: "Default",
    ram: "2GB",
    vcpu: 1,
  },
  {
    type: "Large",
    ram: "4 GB",
    vcpu: 2,
  },
];

export const ENV_TYPE = [
  { value: "secret", displauValue: "secret" },
  { value: "secret_ref", displauValue: "secretRef" },
  { value: "env", displauValue: "env" },
];

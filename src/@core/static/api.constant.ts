export const APP_API = {
  // Auth
  forgetPassword: "forgetPassword",
  checkEmail: "checkEmail/{email}",
  login: "login",
  checkUser: "checkUser/{username}",
  registerUser: "registerUser",
  checkAppNameExists: "apps/checkAppNameExists?application_name={appName}",
  userInfo: "userInfo",
  userProfile: "userProfile",
  deactivateUser: "deleteUser",
  checkDeleteCriteria: "checkDeleteCriteria",

  // Create-App
  sendGitCode: "code?code={code}",
  gitOwner: "gitOwner",
  saveApp: `apps`,
  getRepositories: "repositories?git_user={gituser}",
  getBranches: "repos/{repoOwner}/{repoName}/branches?git_user={gituser}",
  destroyApp: "apps/{appId}",

  //app Dashboard
  supplyChainRuns: "supplychainruns/latest?appid={appId}",
  appList: "apps",
  supplyChainSteps: "supplychainruns/{runId}/steps?stage={stage}",
  appDetails: "apps/{appId}",
  appMatrix: "app/metrics?deployment={appName}",
  approval: "changeapprovalstatus",
  appLogs: "apps/{appId}/logs?env=",
  rebuild: "manualrun?app_id={appId}&workspace_id={wid}",

  // Security
  vulernabilities:
    "vulernabilities?workspace_id={workspace_id}&run_type={run_type}",
  getScans:
    "vulernabilities/scans?workspace_id={workspace_id}&run_type={run_type}",
  allVulnerabilities:
    "vulernabilities/all?workspace_id={workspace_id}&run_type={run_type}",
  cveVulernabilities:
    "vulernabilities/app?app_id={app_id}&run_type={run_type}&workspace_id={workspace_id}",
  cveHistoryChart:
    "vulernabilities/appVulnHistory?app_id={app_id}&run_type={run_type}&workspace_id={workspace_id}",
  appsAffectedByCve:
    "vulernabilities/apps/affected?cve_id={cve_id}&run_type={run_type}&workspace_id={workspace_id}",
  epssScore: "epssScore?cve_id={cve_id}",
  sbom: "sbom?app_id={app_id}&run_type={run_type}&workspace_id={workspace_id}",
  downloadAppVulCve:
    "vulernabilities/downloadAppVuln?app_id={app_id}&run_type={run_type}&workspace_id={workspace_id}",
  overallExpo:
    "overallexpo?workspace_id={workspace_id}&run_type={run_type}&app_id={app_id}",

  //Workspace
  createWorkspace: "workspace",
  getListOfWorkspaces: "workspace",
  getListOfUsersWorkspaces: "workspace/all",
  addUser: "workspace/addUser",
  removeUser: "workspace/removeUser",
  delete: "workspace/delete",

  //Organisation
  OrgList: "organization",
  orgUserList: "organization/users",
  removeOrgUser: "organization/removeUserFromOrg?user_id=",
  inviteUser: "inviteUser",
  getOrg: "organization/info",

  //billing
  getPlans: "plans",
  saveCard:
    "cards?session_id={sessionId}&customer_id={customerId}&plan_id={planId}",
  getCards: "cards",
  deleteCard: "cards/{paymentMethod}",
  makeCardDefault: "cards/{paymentMethod}/setdefault?customer_id={customerId}",
  updateCard: "cards/{cardId}",
  listOfInvoices: "invoices",
};

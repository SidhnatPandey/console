export const APP_API = {
    // Auth
    forgetPassword: 'forgetPassword',
    checkEmail: 'checkEmail/{email}',
    login: "login",
    checkUser: 'checkUser/{username}',
    registerUser: "registerUser",
    checkAppNameExists: "apps/checkAppNameExists?application_name={appName}",
    userInfo: 'userInfo',
    userProfile: "userProfile",
    deactivateUser: "deleteUser",
    checkDeleteCriteria: "checkDeleteCriteria",

    // Create-App
    sendGitCode: 'code?code={code}',
    gitOwner: 'gitOwner',
    saveApp: `apps`,
    getRepositories: 'repositories?git_user={gituser}',
    getBranches: 'repos/{repoOwner}/{repoName}/branches?git_user={gituser}',
    destroyApp: 'apps/{appId}',

    //app Dashboard
    supplyChainRuns: 'supplychainruns/latest?appid={appId}',
    appList: 'apps',
    supplyChainSteps: 'supplychainruns/{runId}/steps?stage={stage}',
    appDetails: 'apps/{appId}',
    appMatrix: 'app/metrics?deployment={appName}',
    approval: 'changeapprovalstatus',
    appLogs: 'apps/{appId}/logs?env=',
    rebuild: 'manualrun?app_id=',

    // Security 
    vulernabilities: 'vulernabilities?workspace_id={workspace_id}&run_type={run_type}',
    getScans: 'vulernabilities/scans?workspace_id={workspace_id}&run_type={run_type}',
    allVulnerabilities: 'vulernabilities/all?workspace_id={workspace_id}&run_type={run_type}',
    CveVulernabilities:'vulernabilities/app?app_id={app_id}&run_type={run_type}&workspace_id={workspace_id}',

    //Workspace
    createWorkspace: 'workspace',
    getListOfWorkspaces: 'workspace',
    getListOfUsersWorkspaces: 'workspace/all',
    addUser: 'workspace/addUser',
    removeUser: 'workspace/removeUser',
    delete: 'workspace/delete',

    //Organisation
    OrgList: 'organization',
    orgUserList: 'organization/users',
    removeOrgUser: 'organization/removeUserFromOrg?user_id=',
    inviteUser: 'inviteUser'
}
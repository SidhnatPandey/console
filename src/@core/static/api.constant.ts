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

    // Security 
    vulernabilities: 'vulernabilities',
    getScans: 'vulernabilities/scans',
    allVulnerabilities: 'vulernabilities/all',

    //Workspace
    createWorkspace: 'workspace',
    getListOfWorkspaces: 'workspace',

    //Organisation
    OrgList: 'organization',
    orgUserList: 'organization/users',
    removeOrgUser: 'organization/removeUserFromOrg',
    inviteUser: 'inviteUser'
}
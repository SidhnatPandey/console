export const APP_API = {
    // Auth
    forgetPassword: 'initializ/v1/forgetPassword',
    checkEmail: 'initializ/v1/checkEmail/{email}',
    login: "initializ/v1/login",
    checkUser: 'initializ/v1/checkUser/{username}',
    registerUser: "initializ/v1/registerUser",
    checkAppNameExists: "initializ/v1/apps/checkAppNameExists?application_name={appName}",
    userInfo: 'initializ/v1/userInfo',

    // Create-App
    sendGitCode: 'initializ/v1/code?code={code}',
    gitOwner: 'initializ/v1/gitOwner',
    saveApp: `initializ/v1/apps`,
    getRepositories: 'initializ/v1/repositories?git_user={gituser}',
    getBranches: 'initializ/v1/repos/{repoOwner}/{repoName}/branches?git_user={gituser}',

    //app Dashboard
    supplyChainRuns: 'initializ/v1/supplychainruns/latest?appid={appId}',
    appList: 'initializ/v1/apps',
    supplyChainSteps: 'initializ/v1/supplychainruns/{runId}/steps?stage={stage}',
    appDetails: 'initializ/v1/apps/{appId}',
    appMatrix: 'initializ/v1/app/metrics?deployment={appName}',
    approval: 'initializ/v1/changeapprovalstatus',
    appLogs: 'initializ/v1/apps/{appId}/logs?env=',

    // Security 
    vulernabilities: 'security/v1/vulernabilities',
    getScans: '/security/v1/vulernabilities/scans',
    allVulnerabilities: 'security/v1/vulernabilities/all'
}
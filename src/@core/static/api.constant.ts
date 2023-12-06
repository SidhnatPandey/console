export const APP_API = {
    // Auth
    forgetPassword: 'initializ/v1/forgetPassword',
    checkEmail: 'checkEmail/{email}',
    login: "login",
    checkUser: 'checkUser/{username}',
    registerUser: "initializ/v1/registerUser",
    checkAppNameExists: "/initializ/v1/apps/checkAppNameExists?application_name={appName}",
    userProfile: "http://localhost:8089/initializ/v1/userProfile",

    // Create-App
    sendGitCode: 'code?code={code}',
    gitOwner: 'gitOwner',
    saveApp: `initializ/v1/apps`,
    getRepositories: 'repositories?git_user={gituser}',
    getBranches: 'repos/{repoOwner}/{repoName}/branches?git_user={gituser}',

    //app Dashboard
    supplyChainRuns: 'initializ/v1/supplychainruns/latest?appid={appId}',
    appList: 'initializ/v1/apps',
    supplyChainSteps: 'initializ/v1/supplychainruns/{runId}/steps?stage={stage}',
    appDetails: 'initializ/v1/apps/{appId}',
    appMatrix: 'initializ/v1/app/metrics?deployment={appName}',
    approval: 'initializ/v1/changeapprovalstatus',
    appLogs: 'initializ/v1/apps/{appId}/logs',

    // Security 
    vulernabilities: 'security/v1/vulernabilities',
    getScans: '/security/v1/vulernabilities/scans',
    allVulnerabilities: 'security/v1/vulernabilities/all'
}
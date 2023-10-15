export const APP_API = {
    // Auth
    forgetPassword: 'initializ/v1/forgetPassword',
    checkEmail: 'checkEmail/{email}',
    login: "login",
    checkUser: 'username/{username}',
    registerUser: "initializ/v1/registerUser",
    checkAppNameExists :"/initializ/v1/apps/checkAppNameExists?application_name={appName}",

    // Create-App
    sendGitCode: 'code?code={code}',
    gitOwner: 'gitOwner',
    saveApp: `initializ/v1/apps`,
    getRepositories: 'repositories?git_user={gituser}',
    getBranches: 'repos/{repoOwner}/{repoName}/branches?git_user={gituser}',
    supplyChainRuns: 'initializ/v1/supplychainruns/latest?appid={appId}',
    supplyChainSteps: 'initializ/v1/supplychainruns/{runId}/steps?stage={stage}'
}
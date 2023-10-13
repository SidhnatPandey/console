export const APP_API = {
    // Auth
    forgetPassword: 'initializ/v1/forgetPassword',
    checkEmail: 'checkEmail/{email}',
    login: "login",
    checkUser: 'username/{username}',
    registerUser: "initializ/v1/registerUser",

    // Create-App
    sendGitCode: 'code?code={code}',
    gitOwner: 'gitOwner',
    saveApp: `initializ/v1/apps`,
    getRepositories: 'repositories?git_user={gituser}',
    getBranches: 'repos/{repoOwner}/{repoName}/branches?git_user={gituser}',
    supplyChainRuns: 'initializ/v1/supplychainruns/latest?appid={appId}',
    appList: 'initializ/v1/apps?userId={userId}',
    supplyChainSteps: 'initializ/v1/supplychainruns/{runId}/steps?stage={stage}'
}
import { get } from './masterServices';

export const sendCode = (code: string) => {
    return get(`/code?code=${code}`).then(
        (response) => response.data
    );
}

export const getGitOwner = () => {
    return get("/gitOwner").then(
        (response) => response.data
    );
}

export const getRepositories = (gituser: string) => {
    return get(`/repositories?git_user=${gituser}`).then(
        (response) => response.data
    );
}

export const getBranch = (repo: string, gituser: string) => {
    return get(`/branches?repository=${repo}&git_user=${gituser}`).then(
        (response) => response.data
    );
}
import { APP_API } from 'src/@core/static/api.constant';
import { get, post } from '../../@core/services/masterServices';

export const sendCode = (code: string) => {
    return get(`${APP_API.sendGitCode} + ${code}`).then(
        (response) => response?.data
    );
}

export const getGitOwner = () => {
    return get(APP_API.gitOwner).then(
        (response) => response?.data
    );
}

export const getRepositories = (gituser: string) => {
    return get(`repositories?git_user=${gituser}`).then(
        (response) => response?.data
    );
}

export const getBranch = (repo: string, gituser: string) => {
    const arr = repo.split("/");
    return get(`repos/${arr[0]}/${arr[1]}/branches?git_user=${gituser}`).then(
        (response) => response?.data
    );
}

export const saveApp = (app: any) => {
    return post(`initializ/v1/apps`, app).then(
        (response) => response?.data
    )
}
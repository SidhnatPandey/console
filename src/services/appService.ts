import { APP_API } from 'src/@core/static/api.constant';
import { get, post } from '../@core/services/masterServices';

export const sendCode = (code: string) => {
    const url = APP_API.sendGitCode.replace('{code}', code)
    return get(url).then(
        (response) => response?.data
    );
}

export const getGitOwner = () => {
    return get(APP_API.gitOwner).then(
        (response) => response?.data
    );
}

export const getRepositories = (gituser: string) => {
    const url = APP_API.getRepositories.replace('{gituser}', gituser)
    return get(url).then(
        (response) => response?.data
    );
}

export const getBranch = (repo: string, gituser: string) => {
    const arr = repo.split("/");
    let url = APP_API.getBranches.replace('{repoOwner}', arr[0]);
    url = url.replace('{repoName}', arr[1]);
    url = url.replace('{gituser}', gituser);
    return get(url).then(
        (response) => response?.data
    );
}

export const saveApp = (app: any) => {
    return post(APP_API.saveApp, app).then(
        (response) => response?.data
    )
}

export const appList = () => {
    const url = APP_API.appList;
    return get(url).then((response) => response?.data);
};


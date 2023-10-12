import { get } from "src/@core/services/masterServices";
import { APP_API } from "src/@core/static/api.constant";

export const supplyChainRuns = (appId: string) => {
    let url = APP_API.supplyChainRuns;
    url = url.replace('{appId}', appId)
    return get(url).then((response) => response?.data);
};

export const appList = (userId: string) => {
    let url = APP_API.appList;
    url = url.replace('{userId}', userId)
    return get(url).then((response) => response?.data);
};


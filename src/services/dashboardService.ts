import { setApiBaseUrl } from "src/@core/services/interceptor";
import { get, post } from "src/@core/services/masterServices";
import { APP_API } from "src/@core/static/api.constant";

export const supplyChainRuns = (appId: string) => {
    setApiBaseUrl();
    let url = APP_API.supplyChainRuns;
    url = url.replace('{appId}', appId)
    return get(url).then((response) => response?.data);
};

export const supplyChainSteps = (url: string) => {
    setApiBaseUrl();
    return get(url).then((response) => response?.data);
};

export const approval = (data: any) => {
    setApiBaseUrl();
    return post(APP_API.approval, data).then((response) => response?.data);
}

export const getAppLogs = async (url: string) => {
    setApiBaseUrl();
    const response = await get(url);
    return response;
}
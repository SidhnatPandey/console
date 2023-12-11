import { setApiBaseUrl } from "src/@core/services/interceptor";
import { get, post } from "src/@core/services/masterServices";
import { APP_API } from "src/@core/static/api.constant";

export const supplyChainRuns = (appId: string) => {
    setApiBaseUrl();
    let url = APP_API.supplyChainRuns;
    url = url.replace('{appId}', appId)
    return get(url).then((response) => response?.data);
};

export const supplyChainSteps = (runId: string, runStep: string) => {
    setApiBaseUrl();
    let url = APP_API.supplyChainSteps;
    url = url.replace('{runId}', runId)
    url = url.replace('{stage}', runStep)
    return get(url).then((response) => response?.data);
};

export const matrixData = (appName: string) => {
    setApiBaseUrl();
    let url = APP_API.appMatrix;
    url = url.replace('{appName}', appName);
    return get(url).then((response) => response?.data);
}

export const approval = (data: any) => {
    setApiBaseUrl();
    return post(APP_API.approval, data).then((response) => response?.data);
}

export const getAppLogs = (appId: string, env: string) => {
    setApiBaseUrl();
    let url = APP_API.appLogs;
    url = url.replace('{appId}', appId);
    url = url + env.toLowerCase();
    return get(url).then((response) => response?.data)
}

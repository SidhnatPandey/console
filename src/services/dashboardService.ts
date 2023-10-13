import { get } from "src/@core/services/masterServices";
import { APP_API } from "src/@core/static/api.constant";

export const supplyChainRuns = (appId: string) => {
    let url = APP_API.supplyChainRuns;
    url = url.replace('{appId}', appId)
    return get(url).then((response) => response?.data);
};

export const supplyChainSteps = (runId: string, runStep: string) => {
    let url = APP_API.supplyChainSteps;
    url = url.replace('{runId}', runId )
    url = url.replace('{stage}', runStep )
    return get(url).then((response) => response?.data);
};

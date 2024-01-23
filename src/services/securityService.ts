import { APP_API } from "src/@core/static/api.constant";
import { get, post } from "../@core/services/masterServices";
import { setApiBaseUrl } from "src/@core/services/interceptor";

export const vulnerabilitiesList = (workspace_id:string,run_type:string) => {
    setApiBaseUrl('security');
    let url = APP_API.vulernabilities.replace('{workspace_id}', workspace_id);
    url = url.replace('{run_type}', run_type);
    return get(url).then((response) => response?.data);
};

export const getScans = (workspace_id:string,run_type:string,app_id?:string) => {
    setApiBaseUrl("security");
    let url = APP_API.getScans.replace('{workspace_id}', workspace_id);
    url = url.replace('{run_type}', run_type);
    if(app_id) 
    {url = url + '&app_id=' + app_id  }
    return get(url).then((response) => response?.data);
};

export const getAllvulnerabilities = (workspace_id:string,run_type:string,app_id?:string) => {
    setApiBaseUrl('security');
    let url = APP_API.allVulnerabilities.replace('{workspace_id}', workspace_id);
    url = url.replace('{run_type}', run_type);
    if(app_id) 
    {url = url + '&app_id=' + app_id  }
    return get(url).then((response) => response?.data);
};


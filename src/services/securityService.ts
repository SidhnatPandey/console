import { APP_API } from "src/@core/static/api.constant";
import { get, post } from "../@core/services/masterServices";
import { setApiBaseUrl } from "src/@core/services/interceptor";

export const vulnerabilitiesList = () => {
    setApiBaseUrl('security');
    const url = APP_API.vulernabilities;
    return get(url).then((response) => response?.data);
};

export const getScans = () => {
    setApiBaseUrl("security");
    const url = APP_API.getScans;
    return get(url).then((response) => response?.data);
};
import { setApiBaseUrl } from "src/@core/services/interceptor";
import { post } from "src/@core/services/masterServices";
import { APP_API } from "src/@core/static/api.constant";

export const saveKeys = (
    org_id: string,
    user_id: string,
    keysData: any
) => {
    setApiBaseUrl("secret");
    console.log("saveKeys", keysData);
    console.log("saveKeys", org_id, user_id);
    let url = APP_API.savekey.replace("{org_id}", org_id);
    url = url.replace("{userId}", user_id);
    return post(url, keysData).then(
        (response) => response?.data
    )
};



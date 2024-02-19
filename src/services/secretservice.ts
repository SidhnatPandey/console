import { setApiBaseUrl } from "src/@core/services/interceptor";
import { post } from "src/@core/services/masterServices";
import { APP_API } from "src/@core/static/api.constant";

export const saveKeys = async (keysData: any) => {
    setApiBaseUrl("secret");
    return post(APP_API.userProfile, keysData).then(
        (response) => response?.data
    )
};

import { AxiosInstance } from "axios";

const requestInterceptor = (axiosInstance: AxiosInstance) => {
    axiosInstance.interceptors.request.use((config) => {
        const jwtToken = "Bearer Token from Localstorage";
        config.headers["Authorization"] = jwtToken;
        return config;
    }, (error) => {

    });
};
export default requestInterceptor;
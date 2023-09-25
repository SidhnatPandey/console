import { AxiosInstance, AxiosResponse } from "axios";
import { useRouter } from "next/router";
const DEBUG = process.env.REACT_APP_NODE_ENV !== "production";

const responseInterceptor = (axiosInstance: AxiosInstance) => {

    const router = useRouter()

    axiosInstance.interceptors.response.use((response) => {
        //Response Successful
        return response;
    }, (error) => {
        if (error?.status?.code === 401) {
            //Unauthorized
            //clear sotrage
            localStorage.clear();
            //redirect to Login
            router.push('/login')
        } else {
            //dispatch your error in a more user friendly manner
            if (DEBUG) {
                //easier debugging
                console.group("Error");
                console.log(error);
                console.groupEnd();
            }
        }
    });
};
export default responseInterceptor;
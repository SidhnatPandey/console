import axios from 'axios';
import { LOCALSTORAGE_CONSTANTS } from 'src/@core/static/app.constant';
import { env } from 'next-runtime-env';

const baseUrl = env('NEXT_PUBLIC_BASE_URL');

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
    baseURL: baseUrl, // Your API base URL
});

// Request Interceptor: Modify or add headers to outgoing requests
axiosInstance.interceptors.request.use(
    (config) => {
        // You can modify headers, add authentication tokens, etc.
        const jwtToken = window.localStorage.getItem(LOCALSTORAGE_CONSTANTS.token);
        const user = JSON.parse(window.localStorage.getItem(LOCALSTORAGE_CONSTANTS.userInfo)!);

        if (jwtToken) { config.headers["Authorization"] = `Bearer ${jwtToken}` }
        if (user) { config.headers["App-User"] = user.username }
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle responses globally
axiosInstance.interceptors.response.use(
    (response) => {
        // You can modify the response data or handle it as needed
        return response;
    },
    (error) => {
        // Handle response errors
        if (error?.response) {
            if (error?.response.status === 401) {
                // clear localstorage and send user to login page
                localStorage.clear();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
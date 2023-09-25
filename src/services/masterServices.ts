import axios from 'axios';
import requestInterceptor from './interceptors/request-interceptor';
import responseInterceptor from './interceptors/response-interceptor';


const httpClient = axios.create({
  baseURL: 'http://localhost:8089', // Replace with your API's base URL
});


responseInterceptor(httpClient);
requestInterceptor(httpClient);

export default httpClient;
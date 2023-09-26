import axios, { AxiosRequestConfig } from 'axios';

export const BASE_URL = 'http://localhost:8089';

export const get = async (partialUrl: string, params = {}) => {
  try {
    const url = constructUrl(partialUrl);
    const requestConfig: AxiosRequestConfig = { headers: getHeaders() };
    const response = await axios.get(url, requestConfig);
    return response;
  } catch (error) {
    console.error('Error :', error);
    throw error;
  }
};

export const post = async (partialUrl: string, data: any, params = {}) => {
  try {
    const url = constructUrl(partialUrl);
    const requestConfig: AxiosRequestConfig = { headers: getHeaders() };
    const response = await axios.post(url, data, requestConfig);
    return response;
  } catch (error) {
    console.error('Error :', error);
    throw error;
  }
};


export const getPublic = async (partialUrl: string, params = {}) => {
  try {
    const url = constructUrl(partialUrl);
    const response = await axios.get(url, { params });
    return response;
  } catch (error) {
    console.error('Error :', error);
    throw error;
  }
};

export const postPublic = async (partialUrl: string, data: any, params = {}) => {
  try {
    const url = constructUrl(partialUrl);
    const response = await axios.post(url, data, { params });
    return response;
  } catch (error) {
    console.error('Error :', error);
    throw error;
  }
};

const constructUrl = (url: string) => {
  return BASE_URL + url;
}

const getHeaders = () => {
  const token = window.localStorage.getItem('accessToken');
  const user = JSON.parse(window.localStorage.getItem('userData')!);
  return {
    Authorization: `Bearer ${token}`,
    'App-User': user.username
  }
}
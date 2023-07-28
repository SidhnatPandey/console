import axios from 'axios';

export const BASE_URL = 'http://localhost:8081';


export const get = async (partialUrl: string, params = {}) => {
  try {
    const url = constructUrl(partialUrl);
    const response = await axios.get(url, { params });
    return response;
  } catch (error) {
    console.error('Error :', error);
    throw error;
  }
};

export const post = async (partialUrl: string, data: any, params = {}) => {
  try {
    const url = constructUrl(partialUrl);
    const response = await axios.post(url, data, { params });
    return response;
  } catch (error) {
    console.error('Error :', error);
    throw error;
  }
};

let constructUrl = (url: string) => {
  return BASE_URL + url;
}
import axiosInstance from './interceptor';

export const get = async (url: string, params = {}) => {
  try {
    const response = await axiosInstance.get(url);
    return response;
  } catch (error) {
    console.error('Error :', error);
  }
};

export const post = async (url: string, data: any, params = {}) => {
  try {
    const response = await axiosInstance.post(url, data);
    return response;
  } catch (error) {
    console.error('Error :', error);
  }
};


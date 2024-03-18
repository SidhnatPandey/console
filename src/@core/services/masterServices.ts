import axiosInstance from './interceptor';

export const get = async (url: string) => {
  try {
    const response = await axiosInstance.get(url);
    return response;
  } catch (error) {
    console.error('Error :', error);
  }
};

export const post = async (url: string, data: any) => {
  try {
    const response = await axiosInstance.post(url, data);
    return response;
  } catch (error) {
    console.error('Error :', error);
  }
};

export const put = async (url: string, data: any) => {
  try {
    const response = await axiosInstance.put(url, data);
    return response;
  } catch (error) {
    console.error('Error :', error);
  }
};

export const deleteCall = async (url: string, request: any = null) => {
  try {
    const response = await axiosInstance.delete(url, { data: request });
    return response;
  } catch (error) {
    console.error('Error :', error);
  }
};


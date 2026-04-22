import axiosInstance from './axiosInstance';

export const loginApi = credentials =>
  axiosInstance.post('/auth/login', credentials);

export const logoutApi = () =>
  axiosInstance.post('/auth/logout');

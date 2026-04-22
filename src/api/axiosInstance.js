import axios from 'axios';
import {store} from '../store';
import {forceLogout} from '../store/slices/authSlice';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {'Content-Type': 'application/json'},
});

axiosInstance.interceptors.request.use(config => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !isLoginRequest) {
      store.dispatch(forceLogout());
    }
    return Promise.reject(error.response?.data || error);
  },
);

export default axiosInstance;

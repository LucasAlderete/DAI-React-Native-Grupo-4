import axios from 'axios';
import { tokenStorage } from './tokenStorage';

// const API_URL = 'http://192.168.0.93:8080/api/';
const API_URL = 'http://192.168.0.62:8080/api/';
// const API_URL = 'http://192.168.0.31:8080/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API error:', err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api;

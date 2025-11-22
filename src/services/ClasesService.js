import axios from 'axios';
import API_CONFIG from '../config/apiConfig';

const API_URL = API_CONFIG.BASE_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getClases = async () => {
  try {
    const response = await apiClient.get('/clases');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClaseById = async (id) => {
  try {
    const response = await apiClient.get(`/clases/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiClient;

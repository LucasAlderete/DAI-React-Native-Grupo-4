import axios from 'axios';
import API_CONFIG from '../config/apiConfig';

const API_HOST = API_CONFIG.HOST;

const apiClient = axios.create({
  baseURL: API_HOST,
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
    console.error('News API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getNews = async () => {
  try {
    const response = await apiClient.get('/api/news');
    const data = response.data || [];
    return data.slice().sort((a, b) => {
      if (a.order == null && b.order == null) return 0;
      if (a.order == null) return 1;
      if (b.order == null) return -1;
      return a.order - b.order;
    });
  } catch (error) {
    throw error;
  }
};

export default apiClient;

import axios from 'axios';

// const API_BASE_URL = 'http://10.0.2.2:8080/api';
const API_BASE_URL = 'http://192.168.0.62:8080/api';


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Aca se puede agregar el token si es necesario
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// curl --location 'http://localhost:8080/api/clases?page=0&size=10'
export const getClases = async () => {
  try {
    const response = await apiClient.get('/clases');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// curl --location 'http://localhost:8080/api/clases/1'
export const getClaseById = async (id) => {
  try {
    const response = await apiClient.get(`/clases/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiClient;

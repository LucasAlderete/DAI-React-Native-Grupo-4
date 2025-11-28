import axios from 'axios';
import { tokenStorage } from './tokenStorage';
import API_CONFIG from '../config/apiConfig';

const API_URL = `${API_CONFIG.BASE_URL}/`;

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

/**
 * Categoriza el error y retorna un mensaje amigable en español
 * @param {Error} error - El error de axios
 * @returns {string} - Mensaje amigable para el usuario
 */
const categorizarError = (error) => {
  // Error de red o timeout
  if (error.code === 'ECONNABORTED' || error.message === 'timeout of 10000ms exceeded') {
    return 'La solicitud tardó demasiado. Por favor, intenta nuevamente.';
  }

  // Error de conexión de red
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return 'Se perdió la conexión con el servidor. Verifica tu conexión a internet.';
  }

  // Error sin respuesta del servidor
  if (!error.response) {
    return 'No se pudo conectar con el servidor. Verifica tu conexión.';
  }

  const status = error.response?.status;
  const data = error.response?.data;

  // Errores HTTP por código de estado
  switch (status) {
    case 400:
      return data?.message || 'Solicitud incorrecta. Verifica los datos ingresados.';
    
    case 401:
      return data?.message || 'No autorizado. Por favor, inicia sesión nuevamente.';
    
    case 403:
      return data?.message || 'No tienes permisos para realizar esta acción.';
    
    case 404:
      return data?.message || 'El recurso solicitado no fue encontrado.';
    
    case 408:
      return 'La solicitud tardó demasiado. Por favor, intenta nuevamente.';
    
    case 409:
      return data?.message || 'Conflicto. El recurso ya existe o no puede ser procesado.';
    
    case 422:
      return data?.message || 'Error de validación. Verifica los datos ingresados.';
    
    case 429:
      return 'Demasiadas solicitudes. Por favor, espera un momento e intenta nuevamente.';
    
    case 500:
      return data?.message || 'Error interno del servidor. Por favor, intenta más tarde.';
    
    case 502:
      return 'El servidor no está disponible. Por favor, intenta más tarde.';
    
    case 503:
      return 'El servicio no está disponible temporalmente. Por favor, intenta más tarde.';
    
    case 504:
      return 'Tiempo de espera agotado. Por favor, intenta nuevamente.';
    
    default:
      // Si hay un mensaje del backend, usarlo; sino, mensaje genérico
      if (data?.message) {
        return data.message;
      }
      return `Error al procesar la solicitud. (${status || 'Desconocido'})`;
  }
};

api.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Obtener mensaje categorizado
    const mensajeAmigable = categorizarError(err);
    
    // Agregar el mensaje amigable al error para que esté disponible en los catch
    err.userMessage = mensajeAmigable;
    
    return Promise.reject(err);
  }
);

export default api;

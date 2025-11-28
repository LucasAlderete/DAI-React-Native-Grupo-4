import api from './api';
import API_CONFIG from '../config/apiConfig';
import { tokenStorage } from './tokenStorage';

export const getUsuario = async () => {
  const response = await api.get('/usuario/perfil');
  return response.data;
};

export const updateUsuarioPerfil = async (usuarioData) => {
  const response = await api.put('/usuario/perfil', usuarioData);

  // si back devuelve nuevo token guardarlo
  if (response.data?.token) {
    await tokenStorage.saveToken(response.data.token);

    // actualizar axios con el nuevo token
    api.defaults.headers.common['Authorization'] =
      `Bearer ${response.data.token}`;
  }

  return response.data;
};

export const uploadUsuarioImagen = async (formData) => {
  const response = await api.put('/usuario/perfil/imagen', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getFullFotoUrl = (fotoUrl) => {
  if (!fotoUrl) return null;
  return `${API_CONFIG.HOST}${fotoUrl}`;
};

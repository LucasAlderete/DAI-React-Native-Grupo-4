import api from './api';

export const getUsuario = async () => {
  const response = await api.get('/usuario/perfil');
  return response.data;
};

export const updateUsuarioPerfil = async (usuarioData) => {
  const response = await api.put('/usuario/perfil', usuarioData);
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
  return `http://192.168.0.62:8080${fotoUrl}`;
};

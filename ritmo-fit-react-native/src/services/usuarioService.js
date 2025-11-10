import apiClient from './clasesService';
import * as ImagePicker from 'expo-image-picker';

// GET /usuario/perfil
export const getUsuario = async (token) => {
  try {
    const response = await apiClient.get('/usuario/perfil', {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// PUT /usuario/perfil
export const updateUsuarioPerfil = async (token, usuarioData) => {
  try {
    const response = await apiClient.put('/usuario/perfil', usuarioData, {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// PUT usuario/perfil/imagen
export const uploadUsuarioImagen = async (token, imagen) => {
  try {
    const formData = new FormData();
    formData.append('imagen', {
      uri: imagen,
      name: 'perfil.jpg',
      type: 'image/jpeg',
    });

    const response = await apiClient.put('/usuario/perfil/imagen', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Abrir galeria con Expo Imagen Picker
export const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }

  return null;
};
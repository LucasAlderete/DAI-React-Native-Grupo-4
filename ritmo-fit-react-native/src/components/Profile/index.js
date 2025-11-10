import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {
  getUsuario,
  updateUsuarioPerfil,
  uploadUsuarioImagen,
} from '../../services/usuarioService';
import * as ImagePicker from 'expo-image-picker';

const Profile = ({ navigation, token }) => {
  const [usuario, setUsuario] = useState(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [fotoUri, setFotoUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);

  useEffect(() => {
    fetchPerfil();
    requestGalleryPermission();
  }, []);

  // Solicitar permiso para acceder a la galería
  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Se necesita permiso para acceder a la galería de imágenes');
      setHasGalleryPermission(false);
    } else {
      setHasGalleryPermission(true);
    }
  };

  const fetchPerfil = async () => {
    try {
      setLoading(true);
      const data = await getUsuario(token);
      setUsuario(data);
      setNombre(data.nombre);
      setEmail(data.email);
      setFotoUri(data.fotoUrl ? `http://10.0.2.2:8080${data.fotoUrl}` : null);
      setError(null);
    } catch (err) {
      console.error('Error fetching perfil:', err);
      setError('Error al cargar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePerfil = async () => {
    try {
      setUpdating(true);
      const updatedData = {};
      if (nombre !== usuario.nombre) updatedData.nombre = nombre;
      if (email !== usuario.email) updatedData.email = email;

      if (Object.keys(updatedData).length > 0) {
        const response = await updateUsuarioPerfil(token, updatedData);
        setUsuario(response);
        setNombre(response.nombre);
        setEmail(response.email);
      }

      alert('Perfil actualizado');
    } catch (err) {
      console.error('Error updating perfil:', err);
      alert('Error al actualizar perfil');
    } finally {
      setUpdating(false);
    }
  };

  const handlePickImage = async () => {
    if (!hasGalleryPermission) {
      alert('No se tienen permisos para abrir la galería');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setFotoUri(uri);
        const response = await uploadUsuarioImagen(token, uri);
        setFotoUri(`http://192.168.0.62:8080${response.fotoUrl}`);
        alert('Imagen actualizada');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Error al subir imagen');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity onPress={handlePickImage}>
        <Image
          source={
            fotoUri
              ? { uri: fotoUri }
              : require('../../../assets/ic_default_avatar.png')
          }
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={styles.updateButton}
        onPress={handleUpdatePerfil}
        disabled={updating}
      >
        <Text style={styles.updateButtonText}>
          {updating ? 'Actualizando...' : 'Actualizar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
    flexGrow: 1,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    backgroundColor: '#E5E7EB',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    width: '100%',
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  updateButton: {
    marginTop: 24,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 16,
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    color: '#DC2626',
    marginBottom: 12,
    fontSize: 14,
  },
});

export default Profile;

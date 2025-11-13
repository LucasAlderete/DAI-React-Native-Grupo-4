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
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  getUsuario,
  updateUsuarioPerfil,
  uploadUsuarioImagen,
} from '../../services/usuarioService';
import { authService } from '../../services/authService';
import API_CONFIG from '../../config/apiConfig';

const ProfileScreen = ({ navigation }) => {
  const [usuario, setUsuario] = useState(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [fotoUri, setFotoUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);

  useEffect(() => {
    requestGalleryPermission();
    fetchPerfil();
  }, []);

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasGalleryPermission(status === 'granted');
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la galería.');
    }
  };

  const fetchPerfil = async () => {
    setLoading(true);
    try {
      const data = await getUsuario();
      if (!data) throw new Error('Datos vacíos');

      setUsuario(data);
      setNombre(data.nombre || '');
      setEmail(data.email || '');
      
      const fotoBack = data.fotoUrl
      ? `${API_CONFIG.HOST}${encodeURI(data.fotoUrl)}?t=${Date.now()}`
      : `${API_CONFIG.HOST}/uploads/default-profile.png`;

      setFotoUri(fotoBack);

    } catch (error) {
      console.log('Error al cargar perfil:', error);
      Alert.alert('Error', 'No se pudo cargar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePerfil = async () => {
    if (!usuario) return;
    try {
      setUpdating(true);
      const updatedData = {};
      if (nombre !== usuario.nombre) updatedData.nombre = nombre;
      if (email !== usuario.email) updatedData.email = email;

      if (Object.keys(updatedData).length === 0) {
        Alert.alert('Info', 'No hay cambios para actualizar.');
        return;
      }

      const updatedUsuario = await updateUsuarioPerfil(updatedData);
      setUsuario(updatedUsuario);
      setNombre(updatedUsuario.nombre);
      setEmail(updatedUsuario.email);
      Alert.alert('Éxito', 'Perfil actualizado.');
    } catch (error) {
      console.log('Error al actualizar perfil:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil.');
    } finally {
      setUpdating(false);
    }
  };

  const handlePickImage = async () => {
    if (!hasGalleryPermission) {
      Alert.alert('Error', 'No se tienen permisos para abrir la galería.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        let uri = asset.uri;
        if (Platform.OS === 'ios') uri = uri.replace('file://', '');

        const uriParts = uri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        const formData = new FormData();
        formData.append('imagen', {
          uri: Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri,
          name: `perfil.${fileType}`,
          type: `image/${fileType}`,
        });

        const updatedUsuario = await uploadUsuarioImagen(formData);

        setFotoUri(
          updatedUsuario.fotoUrl
            ? `${API_CONFIG.HOST}${encodeURI(updatedUsuario.fotoUrl)}?t=${Date.now()}`
            : null
        );
        setUsuario(updatedUsuario);
        Alert.alert('Éxito', 'Imagen de perfil actualizada.');
      }
    } catch (error) {
      console.log('Error al subir imagen:', error);
      Alert.alert('Error', 'No se pudo subir la imagen.');
    }
  };

  const handleLogout = async () => {
      try {
        await authService.logout();
        Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente.');
  
      } catch (error) {
        Alert.alert('Error', 'No se pudo cerrar sesión.');
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
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: 120 }]}>
        
      <TouchableOpacity onPress={handlePickImage}>
        <Image
          key={fotoUri}
          source={{ uri: fotoUri }}
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Tu nombre"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="Tu correo electrónico"
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

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
    width: '50%',
    alignItems: 'center',
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
    width: '50%',
    alignItems: 'center',
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
});

export default ProfileScreen;

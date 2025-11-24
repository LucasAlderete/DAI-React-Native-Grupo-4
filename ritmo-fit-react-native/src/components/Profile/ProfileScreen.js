import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  getUsuario,
  updateUsuarioPerfil,
  uploadUsuarioImagen,
  getFullFotoUrl,
} from '../../services/usuarioService';
import { authService } from '../../services/authService';
import { ThemeContext } from '../../context/ThemeContext';
import ThemeToggle from '../ThemeToggle';
import { lightColors, darkColors } from '../../config/colors';

const ProfileScreen = ({ navigation }) => {
  const [usuario, setUsuario] = useState(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [fotoUri, setFotoUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const colors = darkMode ? darkColors : lightColors;

  useEffect(() => {
    fetchPerfil();
  }, []);

  const fetchPerfil = async () => {
    try {
      setLoading(true);
      const data = await getUsuario();
      if (!data) throw new Error('Datos vacíos');
      setUsuario(data);
      setNombre(data.nombre || '');
      setEmail(data.email || '');
      setFotoUri(getFullFotoUrl(data.fotoUrl));
      setError(null);
    } catch (err) {
      setError("Error al cargar el perfil");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePerfil = async () => {
    if (!usuario) return;
    try {
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
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'No se puede acceder a la galería sin permisos.');
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
        const uriParts = uri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        const formData = new FormData();
        formData.append('imagen', {
          uri,
          name: `perfil.${fileType}`,
          type: `image/${fileType}`,
        });

        const updatedUsuario = await uploadUsuarioImagen(formData);

        setFotoUri(getFullFotoUrl(updatedUsuario.fotoUrl));
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

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity styles={styles.retryButton} onPress={fetchPerfil}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <View 
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.headerBorder,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.text }]}>Mi Perfil</Text>
        <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity onPress={handlePickImage}>
          <Image
            key={fotoUri}
            source={{ uri: fotoUri }}
            style={styles.profileImage}
          />
        </TouchableOpacity>

        <Text style={[styles.label, { color: colors.textSecondary }]}>Nombre</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Tu nombre"
          placeholderTextColor={colors.placeholder}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Tu email"
          placeholderTextColor={colors.placeholder}
        />

        <TouchableOpacity
          style={[styles.button, styles.updateButton]}
          onPress={handleUpdatePerfil}
        >
          <Text style={styles.buttonText}>Actualizar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.logoutButton]} 
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
    
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
   header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
  },
  content: {
    marginTop: 20,
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    width: '100%',
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    marginBottom: 15,
  },
  button: {
    width: '90%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  updateButton: {
    backgroundColor: '#2563EB',
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#DC2626',
  },
  buttonText: {
    color: '#FFF',
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
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;


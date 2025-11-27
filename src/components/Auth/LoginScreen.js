import React, { useContext, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { apiService } from '../../services/apiService';
import { ThemeContext } from '../../context/ThemeContext';
import { lightColors, darkColors } from '../../config/colors';
import { tokenStorage } from '../../services/tokenStorage';
import { startPolling } from '../../workers/pollingService';
import { authEvents } from '../../services/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { darkMode } = useContext(ThemeContext);
  const colors = darkMode ? darkColors : lightColors;

  const handleLogin = async () => {
    try {
      const res = await apiService.login({ email, password });
      const { token, nombre, email: userEmail, id } = res.data;

      if (!token) return Alert.alert('Error', 'No se recibió token.');
      if (!id) return Alert.alert('Error', 'El backend no envió el ID del usuario.');

      const userReal = { id, email: userEmail, nombre };

      await tokenStorage.saveToken(token);
      await tokenStorage.saveUser(userReal);

      startPolling(userReal.id);

      authEvents.emit({ type: 'login' });

    } catch (err) {
      Alert.alert('Error', err.response?.data?.mensaje || 'Error al iniciar sesión');
    }
  };


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Iniciar Sesión</Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="Email"
        placeholderTextColor={colors.placeholder}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="Contraseña"
        placeholderTextColor={colors.placeholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />


      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.buttonSecondaryText}>Registrarse</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.buttonLink}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text style={[styles.buttonLinkText, { color: colors.text }]}>
          Olvidé mi contraseña
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 40,
  },

  input: {
    width: '90%',
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 18,
    fontSize: 16,
  },

  button: {
    marginTop: 10,
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 14,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },

  buttonSecondary: {
    marginTop: 12,
    backgroundColor: '#9CA3AF',
    paddingVertical: 16,
    borderRadius: 14,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 2,
  },

  buttonSecondaryText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },

  buttonLink: {
    marginTop: 16,
    paddingVertical: 6,
  },

  buttonLinkText: {
    fontSize: 15,
    fontWeight: '500',
    opacity: 0.85,
  },
});

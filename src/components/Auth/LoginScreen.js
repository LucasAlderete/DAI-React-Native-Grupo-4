// LoginScreen.js
import React, { useContext, useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
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

        if (!token) {
          Alert.alert('Error', 'No se recibió token.');
          return;
        }

        if (!id) {
          Alert.alert('Error', 'El backend no envió el ID del usuario.');
          return;
        }

        const userReal = { id, email: userEmail, nombre };

        await tokenStorage.saveToken(token);
        await tokenStorage.saveUser(userReal);

        console.log("💾 Usuario guardado:", userReal);

        startPolling();
        authEvents.notify({ type: 'login' });

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

      <Button title="Iniciar sesión" onPress={handleLogin} />
      <View style={{ height: 12 }} />
      <Button title="Registrarse" onPress={() => navigation.navigate('Register')} />
      <View style={{ height: 12 }} />
      <Button title="Olvidé mi contraseña" onPress={() => navigation.navigate('ForgotPassword')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: {
    width: '90%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
});

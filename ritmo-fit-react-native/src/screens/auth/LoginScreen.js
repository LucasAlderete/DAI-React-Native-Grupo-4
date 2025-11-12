import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { authService } from '../../services/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Campos incompletos', 'Por favor ingresa email y contraseña');
      return;
    }

    try {
      const res = await authService.login(email, password);

      if (res.mensaje?.toLowerCase().includes('código')) {
        Alert.alert('Código enviado', 'Se envió un código a tu correo.');
        navigation.navigate('VerifyCode', { email, password });
      }
      else if (res.token) {
        Alert.alert('Bienvenido', 'Inicio de sesión exitoso');
      } else {
        Alert.alert('Error', res.mensaje || 'No se pudo iniciar sesión');
      }
    } catch (err) {
      Alert.alert('Error', err.response?.data?.mensaje || 'Error al iniciar sesión');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#222',
    textAlign: 'center',
  },
  input: {
    width: '90%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
  },
});

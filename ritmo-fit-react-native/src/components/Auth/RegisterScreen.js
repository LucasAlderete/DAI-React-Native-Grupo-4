import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { authService } from '../../services/authService';
import { ThemeContext } from '../../context/ThemeContext';

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { theme } = useContext(ThemeContext);

  const handleRegister = async () => {
    if (!nombre || !email || !password) {
      Alert.alert('Completa todos los campos');
      return;
    }

    try {
      setLoading(true);

      const registerResponse = await authService.register(nombre, email, password);

      const otpResponse = await authService.resendOtp(email);

      Alert.alert('Código enviado', `Se envió un código al correo ${email}`);

      navigation.navigate('VerifyCode', { nombre, email, password });

    } catch (err) {
      console.error('❌ Error en registro/OTP:', err);
      Alert.alert('Error', err.message || 'No se pudo enviar el código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Registro</Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            color: theme.text,
          }
        ]}
        placeholder="Nombre"
        placeholderTextColor={theme.placeholder}
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            color: theme.text,
          }
        ]}
        placeholder="Email"
        placeholderTextColor={theme.placeholder}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            color: theme.text,
          }
        ]}
        placeholder="Contraseña"
        placeholderTextColor={theme.placeholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title={loading ? 'Procesando...' : 'Registrarse'}
        onPress={handleRegister}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    width: '90%',
  },
});

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { authService } from '../../services/authService';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleSend = async () => {
    if (!email) {
      Alert.alert('Atención', 'Por favor, ingresa tu correo electrónico.');
      return;
    }

    try {
      const resp = await authService.resendOtp(email);

      Alert.alert('Código enviado', 'Revisá tu correo electrónico para continuar.');
      navigation.navigate('VerifyCode', { email });
    } catch (err) {
      Alert.alert('Error', err.response?.data?.mensaje || 'No se pudo enviar el código.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar contraseña</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Button title="Enviar código" onPress={handleSend} />
      <View style={{ height: 12 }} />
      <Button title="Volver al inicio de sesión" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 32,
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

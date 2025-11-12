import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { authService } from '../../services/authService';

const VerifyCodeScreen = ({ route }) => {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Por favor ingresá el código recibido.');
      return;
    }

    setLoading(true);

    try {
      const data = await authService.verifyOtp(email, code);

      if (data?.token) {
        Alert.alert('Éxito', 'Código verificado correctamente');

        await authService.validateToken();

      } else {
        Alert.alert('Atención', data?.mensaje || 'Código verificado, pero no se recibió token.');
      }
    } catch (error) {
      Alert.alert('Error', 'Código inválido o expirado.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authService.resendOtp(email);
      Alert.alert('Éxito', 'Se envió un nuevo código a tu correo.');
    } catch {
      Alert.alert('Error', 'No se pudo reenviar el código.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificar código</Text>
      <Text style={styles.subtitle}>Hemos enviado un código a tu correo: {email}</Text>

      <TextInput
        style={styles.input}
        placeholder="Ingresá el código"
        keyboardType="number-pad"
        value={code}
        onChangeText={setCode}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={handleVerify}>
            <Text style={styles.buttonText}>Verificar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.link} onPress={handleResend}>
            <Text style={styles.linkText}>Reenviar código</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default VerifyCodeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', padding: 24 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 15, textAlign: 'center', color: '#666', marginBottom: 25 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16, textAlign: 'center' },
  button: { backgroundColor: '#007AFF', paddingVertical: 12, borderRadius: 8, marginTop: 25 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 16 },
  link: { marginTop: 15 },
  linkText: { textAlign: 'center', color: '#007AFF', fontSize: 15 },
});

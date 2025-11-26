import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { authService } from '../../services/authService';
import { ThemeContext } from '../../context/ThemeContext';
import { lightColors, darkColors } from '../../config/colors';
import { tokenStorage } from '../../services/tokenStorage';
import { startPolling } from '../../workers/pollingService';

const VerifyCodeScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const { darkMode } = useContext(ThemeContext);
  const colors = darkMode ? darkColors : lightColors;

  const handleVerify = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Por favor ingresá el código recibido.');
      return;
    }

    setLoading(true);
    console.log("📨 Verificando código OTP:", code);

    try {
      const data = await authService.verifyOtp(email, code);
      console.log("📥 Respuesta del backend:", data);

      if (data?.token) {
        console.log("🔑 Token recibido, guardando...");
        await tokenStorage.saveToken(data.token);

        if (data.usuario) {
          console.log("👤 Usuario recibido, guardando:", data.usuario);
          await tokenStorage.saveUser(data.usuario);

          console.log("⚙ Llamando a startPolling() desde VerifyCode");
          startPolling(data.usuario.id);

          console.log("📡 Polling iniciado con userId =", data.usuario.id);
          navigation.replace("MainTabs");
        } else {
          Alert.alert('Atención', 'Token recibido pero usuario faltante.');
          console.log("⚠ Token recibido pero SIN usuario");
        }
      } else {
        Alert.alert('Atención', 'Código verificado, pero no se recibió token.');
      }
    } catch (err) {
      console.log("💥 Error en verifyOtp:", err);
      Alert.alert('Error', 'Código inválido o expirado.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authService.resendOtp(email);
      Alert.alert('Éxito', 'Se envió un nuevo código a tu correo.');
    } catch (err) {
      Alert.alert('Error', 'No se pudo reenviar el código.');
      console.log("💥 Error al reenviar OTP:", err);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Verificar código</Text>

      <Text style={[styles.subtitle, { color: colors.text }]}>Hemos enviado un código a tu correo: {email}</Text>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }
        ]}
        placeholder="Ingresá el código"
        placeholderTextColor={colors.placeholder}
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
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 25 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 16, textAlign: 'center' },
  button: { backgroundColor: '#007AFF', paddingVertical: 12, borderRadius: 8, marginTop: 25 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 16 },
  link: { marginTop: 15 },
  linkText: { textAlign: 'center', color: '#007AFF', fontSize: 15 },
});

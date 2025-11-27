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

        // Usamos los datos reales que vienen del backend
        const usuario = {
          id: data.id,
          email: data.email,
          nombre: data.nombre,
          fotoUrl: data.fotoUrl,
        };
        console.log("👤 Usuario usado:", usuario);
        await tokenStorage.saveUser(usuario);

        console.log("⚙ Llamando a startPolling() con userId:", usuario.id);
        startPolling(usuario.id);

        navigation.replace("MainTabs");
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
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
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

          <TouchableOpacity style={styles.buttonSecondary} onPress={handleResend}>
            <Text style={styles.buttonSecondaryText}>Reenviar código</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default VerifyCodeScreen;

const styles = StyleSheet.create({
container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },

title: { fontSize: 28, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 25 },

input: {
width: '90%',
height: 52,
borderWidth: 1,
borderRadius: 14,
paddingHorizontal: 15,
marginBottom: 18,
fontSize: 16,
textAlign: 'center',
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

buttonText: { color: '#FFF', fontSize: 17, fontWeight: '600' },

buttonSecondary: {
marginTop: 25,
backgroundColor: '#9CA3AF',
paddingVertical: 16,
borderRadius: 14,
width: '90%',
alignItems: 'center',
shadowColor: '#000',
shadowOpacity: 0.15,
shadowRadius: 6,
elevation: 3,
},

buttonSecondaryText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
});

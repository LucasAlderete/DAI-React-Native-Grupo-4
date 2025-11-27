import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { authService } from '../../services/authService';
import { ThemeContext } from '../../context/ThemeContext';
import { lightColors, darkColors } from '../../config/colors';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const { darkMode } = useContext(ThemeContext);
  const colors = darkMode ? darkColors : lightColors;

  const handleSend = async () => {
    if (!email) {
      Alert.alert('Atención', 'Por favor, ingresa tu correo electrónico.');
      console.log('[FORGOT PASSWORD] Email vacío');
      return;
    }

    console.log('[FORGOT PASSWORD] Intentando enviar OTP para email:', email);

    try {
      const response = await authService.resendOtp(email); // pasar solo string
      console.log('[FORGOT PASSWORD] Respuesta de resendOtp:', response);

      Alert.alert('Código enviado', 'Revisá tu correo electrónico para continuar.');
      navigation.navigate('VerifyCode', { email });
    } catch (err) {
      console.error('[FORGOT PASSWORD] Error al enviar OTP:', err);

      Alert.alert('Error', err.message || 'No se pudo enviar el código.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Recuperar contraseña</Text>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
        ]}
        placeholder="Correo electrónico"
        placeholderTextColor={colors.placeholder}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Enviar código</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonSecondaryText}>Volver al inicio de sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
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

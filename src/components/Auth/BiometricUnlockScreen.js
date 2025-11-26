// BiometricUnlockScreen.js
import * as LocalAuthentication from 'expo-local-authentication';
import React, { useEffect, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { lightColors, darkColors } from '../../config/colors';
import { tokenStorage } from '../../services/tokenStorage';
import { startPolling } from '../../workers/pollingService';

export default function BiometricUnlockScreen({ navigation }) {
  const { darkMode } = useContext(ThemeContext);
  const colors = darkMode ? darkColors : lightColors;

  useEffect(() => {
    (async () => {
      console.log("🔐 Pantalla biométrica montada");

      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Autenticarse con biometría',
          fallbackLabel: 'Usar contraseña',
        });

        if (!result?.success) {
          console.log("❌ Falló autenticación biométrica");
          Alert.alert('Falló la autenticación', 'No se pudo verificar la biometría.');
          return;
        }

        console.log("✔ Autenticado correctamente");
        navigation.replace('MainTabs');

        let user = await tokenStorage.getUser();
        console.log("📦 Usuario recuperado de storage:", user);

        if (!user || !user.id) {
          user = { id: 1, nombre: 'BiometricUser', isBiometric: true };
          console.log('ℹ Usuario biométrico TEMPORAL:', user);
        } else {
          console.log('✔ Usuario REAL recuperado:', user);

          console.log("⚙ Llamando a startPolling(user.id) desde biométrico");
          startPolling(user.id);

          console.log('📡 Polling iniciado con userId=', user.id);
        }

      } catch (err) {
        console.error('💥 Error en biometría:', err);
        Alert.alert('Error', 'Ocurrió un error al intentar autenticar.');
      }
    })();
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Autenticación Biométrica</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Usar contraseña</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, marginBottom: 25, fontWeight: '600' },
  button: { marginTop: 10, backgroundColor: '#007bff', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 10 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

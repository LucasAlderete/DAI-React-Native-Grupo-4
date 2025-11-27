import * as LocalAuthentication from 'expo-local-authentication';
import React, { useEffect, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { tokenStorage } from '../../services/tokenStorage';
import { startPolling } from '../../workers/pollingService';

export default function BiometricUnlockScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    (async () => {

      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Autenticarse con biometría',
          fallbackLabel: 'Usar contraseña',
        });

        if (!result?.success) {
          Alert.alert('Falló la autenticación', 'No se pudo verificar la biometría.');
          return;
        }

        navigation.replace('MainTabs');

        let user = await tokenStorage.getUser();

        if (!user || !user.id) {
          user = { id: 1, nombre: 'BiometricUser', isBiometric: true };
        } else {
          console.log('Usuario recuperado:', user);
          startPolling(user.id);

        }

      } catch (err) {
        Alert.alert('Error', 'Ocurrió un error al intentar autenticar.');
      }
    })();
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Autenticación Biométrica</Text>

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

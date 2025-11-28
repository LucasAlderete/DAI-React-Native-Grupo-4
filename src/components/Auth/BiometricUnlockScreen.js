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
          fallbackLabel: 'Acceder',
        });

        let user = await tokenStorage.getUser();

        if (result?.success) {
          if (!user || !user.id) {
            navigation.replace('Login');
          } else {
            console.log('Usuario recuperado:', user);
            startPolling(user.id);
            navigation.replace('MainTabs');
          }
        } else {
          Alert.alert('Falló la autenticación', 'No se pudo verificar la biometría.');
        }
      } catch (err) {
        Alert.alert('Error', 'Ocurrió un error al intentar autenticar.');
      }
    })();
  }, [navigation]);

  const handleUsePassword = async () => {
    const user = await tokenStorage.getUser();
    if (!user || !user.id) {
      navigation.replace('Login'); // Lleva a Login solo si no hay usuario
    } else {
      startPolling(user.id);
      navigation.replace('MainTabs'); // Si hay usuario, ir a MainTabs
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Autenticación Biométrica</Text>

      <TouchableOpacity style={styles.button} onPress={handleUsePassword}>
        <Text style={styles.buttonText}>Acceder</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 25,
    fontWeight: '600',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

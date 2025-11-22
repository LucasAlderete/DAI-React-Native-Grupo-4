import * as LocalAuthentication from 'expo-local-authentication';
import { useContext, useEffect } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { lightColors, darkColors } from '../../config/colors';

export default function BiometricUnlockScreen({ navigation }) {

  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const colors = darkMode ? darkColors : lightColors;

  useEffect(() => {
    (async () => {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticarse con biometría',
      });
      if (result.success) {
        Alert.alert('Autenticación exitosa');
        navigation.replace('MainTabs');
      } else {
        Alert.alert('Falló la autenticación');
      }
    })();
  }, []);

 return (

  <View style={[styles.container, { backgroundColor: colors.background }]}>

      <Text style={[styles.title, { color: colors.text }]}>
        Autenticación Biométrica
      </Text>

      <TouchableOpacity
        style={[styles.button]}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Usar contraseña</Text>
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


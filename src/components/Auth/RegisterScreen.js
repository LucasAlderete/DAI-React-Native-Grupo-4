import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { authService } from '../../services/authService';
import { ThemeContext } from '../../context/ThemeContext';
import { lightColors, darkColors } from '../../config/colors';

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { darkMode } = useContext(ThemeContext);
  const colors = darkMode ? darkColors : lightColors;

  const handleRegister = async () => {
    if (!nombre || !email || !password) {
      Alert.alert('Completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      console.log('[REGISTER] Iniciando registro...', { nombre, email });

      const registerRes = await authService.register(nombre, email, password);
      console.log('[REGISTER] Registro exitoso:', registerRes);

      Alert.alert('Código enviado', `Se envió un código al correo ${email}`);

      navigation.navigate('VerifyCode', { email });

    } catch (err) {
      console.error('[REGISTER] Error general:', err);
      Alert.alert('Error', err.message || 'No se pudo completar el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <Text style={[styles.title, { color: colors.text }]}>Registro</Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text
          }
        ]}
        placeholder="Nombre"
        placeholderTextColor={colors.placeholder}
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text
          }
        ]}
        placeholder="Email"
        placeholderTextColor={colors.placeholder}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text
          }
        ]}
        placeholder="Contraseña"
        placeholderTextColor={colors.placeholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Procesando...' : 'Registrarse'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonSecondaryText}>Ya tengo una cuenta</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 40,
  },

  input: {
    width: '90%',
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 18,
    fontSize: 16,
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

  buttonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },

  buttonSecondary: {
    marginTop: 12,
    backgroundColor: '#9CA3AF',
    paddingVertical: 16,
    borderRadius: 14,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 2,
  },

  buttonSecondaryText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

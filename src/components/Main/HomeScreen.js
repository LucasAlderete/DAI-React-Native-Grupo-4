import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../../context/ThemeContext';
import { lightColors, darkColors } from '../../config/colors';

const NOTIFICATIONS_KEY = "local_notifications";

export default function HomeScreen({ navigation }) {

  const { darkMode } = useContext(ThemeContext);
  const colors = darkMode ? darkColors : lightColors;

  const [hasAlerts, setHasAlerts] = useState(false);

  // 🔔 Cargar alertas cuando entro a Home
  useEffect(() => {
    const load = async () => {
      const data = await AsyncStorage.getItem("local_notifications");

      if (data) {
        const list = JSON.parse(data);

        if (list.length > 0) {
          setHasAlerts(true);

          Alert.alert("Aviso", list[list.length - 1].mensaje, [
            { text: "OK" },
          ]);

          await AsyncStorage.removeItem("local_notifications");
        }
      }
    };

    load();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <Text style={[styles.title, { color: colors.text }]}>
        Bienvenido a RitmoFit 🏋️‍♂️
      </Text>

      {hasAlerts && (
        <Text style={{ color: "red", marginBottom: 10 }}>
          🔔 Tenés novedades recientes
        </Text>
      )}

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          }
        ]}
        placeholder="Buscar clase..."
        placeholderTextColor={colors.placeholder}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ClasesList')}
      >
        <Text style={styles.buttonText}>Ver Clases</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.reservasButton]}
        onPress={() => navigation.getParent()?.navigate('Reservas')}
      >
        <Text style={styles.buttonText}>📅 Mis Reservas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.historialButton]}
        onPress={() => navigation.getParent()?.navigate('Historial')}
      >
        <Text style={styles.buttonText}>📊 Ver Historial</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  input: {
    width: '90%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    width: '90%',
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  reservasButton: {
    backgroundColor: '#6f42c1',
  },
  historialButton: {
    backgroundColor: '#8B5CF6',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

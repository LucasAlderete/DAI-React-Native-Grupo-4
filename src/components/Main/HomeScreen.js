import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../../context/ThemeContext';
import NewsCarousel from './NewsCarousel';
import { getAsistenciasCalificables } from '../../services/calificacionService';
import { useFocusEffect } from '@react-navigation/native';

const NOTIFICATIONS_KEY = "local_notifications";
const CALIFICACIONES_BANNER_CLOSED_KEY = "calificaciones_banner_closed";
const CALIFICACIONES_COUNT_KEY = "calificaciones_pendientes_count";

export default function HomeScreen({ navigation }) {

  const { theme } = useContext(ThemeContext);

  const [hasAlerts, setHasAlerts] = useState(false);
  const [hasCalificacionesPendientes, setHasCalificacionesPendientes] = useState(false);
  const [showCalificacionesBanner, setShowCalificacionesBanner] = useState(true);

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

  // Verificar si hay calificaciones pendientes
  useFocusEffect(
    useCallback(() => {
      const verificarCalificacionesPendientes = async () => {
        try {
          const response = await getAsistenciasCalificables({ page: 0, size: 10 });
          const asistencias = response?.content || response || [];
          const tienePendientes = asistencias.length > 0;
          const cantidadActual = asistencias.length;
          
          setHasCalificacionesPendientes(tienePendientes);
          
          if (tienePendientes) {
            // Obtener la cantidad guardada anteriormente
            const cantidadAnterior = await AsyncStorage.getItem(CALIFICACIONES_COUNT_KEY);
            const bannerCerrado = await AsyncStorage.getItem(CALIFICACIONES_BANNER_CLOSED_KEY);
            
            // Si hay más calificaciones que antes, hay nuevas - resetear el estado y mostrar
            if (!cantidadAnterior || cantidadActual > parseInt(cantidadAnterior, 10)) {
              setShowCalificacionesBanner(true);
              await AsyncStorage.setItem(CALIFICACIONES_COUNT_KEY, cantidadActual.toString());
              // Si hay nuevas calificaciones, resetear el estado de cerrado
              await AsyncStorage.removeItem(CALIFICACIONES_BANNER_CLOSED_KEY);
            } else if (cantidadActual < parseInt(cantidadAnterior || '0', 10)) {
              // Si la cantidad disminuyó (se calificó una clase), actualizar el contador
              // y resetear el estado para que pueda volver a aparecer si quedan más
              await AsyncStorage.setItem(CALIFICACIONES_COUNT_KEY, cantidadActual.toString());
              await AsyncStorage.removeItem(CALIFICACIONES_BANNER_CLOSED_KEY);
              setShowCalificacionesBanner(true);
            } else if (bannerCerrado) {
              // Si la cantidad es la misma y el banner fue cerrado, mantenerlo cerrado
              setShowCalificacionesBanner(false);
            } else {
              // Si la cantidad es la misma y no está cerrado, mostrarlo
              setShowCalificacionesBanner(true);
            }
          } else {
            // Si no hay calificaciones pendientes, no mostrar y limpiar el estado
            setShowCalificacionesBanner(false);
            await AsyncStorage.removeItem(CALIFICACIONES_COUNT_KEY);
            await AsyncStorage.removeItem(CALIFICACIONES_BANNER_CLOSED_KEY);
          }
        } catch (error) {
          // Si hay error, no mostrar el banner
          setHasCalificacionesPendientes(false);
          setShowCalificacionesBanner(false);
        }
      };

      verificarCalificacionesPendientes();
    }, [])
  );

  const handleCerrarBanner = async () => {
    setShowCalificacionesBanner(false);
    // Guardar en AsyncStorage que el banner fue cerrado
    await AsyncStorage.setItem(CALIFICACIONES_BANNER_CLOSED_KEY, 'true');
  };

  const handleIrACalificar = () => {
    navigation.getParent()?.navigate('Historial');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
          <NewsCarousel />

          <Text style={[styles.title, { color: theme.text }]}>
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
                backgroundColor: theme.card,
                borderColor: theme.border,
                color: theme.text,
              }
            ]}
            placeholder="Buscar clase..."
            placeholderTextColor={theme.placeholder}
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

          {/* Banner de calificaciones pendientes */}
          {hasCalificacionesPendientes && showCalificacionesBanner && (
            <TouchableOpacity
              style={[
                styles.calificacionesBanner,
                {
                  backgroundColor: '#FFF9E6',
                  borderColor: '#FFD700',
                  borderWidth: 2,
                }
              ]}
              onPress={handleIrACalificar}
              activeOpacity={0.8}
            >
              <View style={styles.bannerContent}>
                <Text style={styles.bannerEmoji}>⭐</Text>
                <View style={styles.bannerTextContainer}>
                  <Text style={[styles.bannerTitle, { color: theme.text }]}>
                    ¡Tienes calificaciones pendientes!
                  </Text>
                  <Text style={[styles.bannerSubtitle, { color: theme.textSecondary }]}>
                    Toca aquí para calificar tus clases
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleCerrarBanner();
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={[styles.closeButtonText, { color: theme.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center'
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
  calificacionesBanner: {
    width: '90%',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 5,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: '#FFF9E6',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bannerEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 12,
  },
  closeButton: {
    padding: 2,
    marginLeft: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

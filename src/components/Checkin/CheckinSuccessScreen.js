import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CheckinSuccessScreen({ route, navigation }) {
  // Obtener datos de la asistencia desde navigation params
  const { asistencia } = route.params;
  const clase = asistencia?.clase;

  // Formatear fechas
  const formatearHora = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatearFecha = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Ícono de éxito */}
      <View style={styles.successIconContainer}>
        <Ionicons name="checkmark-circle" size={100} color="#10B981" />
      </View>

      {/* Título */}
      <Text style={styles.title}>Check-in Exitoso</Text>
      <Text style={styles.subtitle}>¡Disfruta tu clase!</Text>

      {/* Card con información de la clase */}
      <View style={styles.card}>
        {/* Nombre de la clase */}
        <View style={styles.infoRow}>
          <Ionicons name="fitness" size={24} color="#2563EB" />
          <View style={styles.infoContent}>
            <Text style={styles.label}>Clase</Text>
            <Text style={styles.value}>{clase?.nombre || 'N/A'}</Text>
          </View>
        </View>

        {/* Disciplina */}
        {clase?.disciplina && (
          <View style={styles.infoRow}>
            <Ionicons name="barbell" size={24} color="#2563EB" />
            <View style={styles.infoContent}>
              <Text style={styles.label}>Disciplina</Text>
              <Text style={styles.value}>{clase.disciplina.nombre}</Text>
            </View>
          </View>
        )}

        {/* Horario */}
        <View style={styles.infoRow}>
          <Ionicons name="time" size={24} color="#2563EB" />
          <View style={styles.infoContent}>
            <Text style={styles.label}>Horario</Text>
            <Text style={styles.value}>
              {formatearHora(clase?.fechaInicio)} - {formatearHora(clase?.fechaFin)}
            </Text>
          </View>
        </View>

        {/* Fecha */}
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={24} color="#2563EB" />
          <View style={styles.infoContent}>
            <Text style={styles.label}>Fecha</Text>
            <Text style={styles.value}>{formatearFecha(clase?.fechaInicio)}</Text>
          </View>
        </View>

        {/* Sede */}
        {clase?.sede && (
          <View style={styles.infoRow}>
            <Ionicons name="location" size={24} color="#2563EB" />
            <View style={styles.infoContent}>
              <Text style={styles.label}>Sede</Text>
              <Text style={styles.value}>{clase.sede.nombre}</Text>
              {clase.sede.direccion && (
                <Text style={styles.address}>{clase.sede.direccion}</Text>
              )}
            </View>
          </View>
        )}

        {/* Instructor */}
        {clase?.instructor && (
          <View style={styles.infoRow}>
            <Ionicons name="person" size={24} color="#2563EB" />
            <View style={styles.infoContent}>
              <Text style={styles.label}>Instructor</Text>
              <Text style={styles.value}>
                {clase.instructor.nombre} {clase.instructor.apellido}
              </Text>
            </View>
          </View>
        )}

        {/* Hora de check-in */}
        <View style={styles.infoRow}>
          <Ionicons name="checkmark-done" size={24} color="#10B981" />
          <View style={styles.infoContent}>
            <Text style={styles.label}>Check-in realizado</Text>
            <Text style={styles.value}>
              {formatearHora(asistencia?.fechaCheckin)} hs
            </Text>
          </View>
        </View>
      </View>

      {/* Botón para volver al inicio */}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => {
          // 1. Resetear el stack del Checkin a solo QRScanner
          navigation.reset({
            index: 0,
            routes: [{ name: 'QRScanner' }],
          });

          // 2. Navegar al tab Home
          const parentNav = navigation.getParent();
          if (parentNav) {
            parentNav.navigate('Home');
          } else {
            navigation.navigate('Home');
          }
        }}
      >
        <Ionicons name="home" size={20} color="#FFFFFF" style={styles.buttonIcon} />
        <Text style={styles.homeButtonText}>Volver al Inicio</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  successIconContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 30,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  homeButton: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

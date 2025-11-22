import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import reservasService from '../../services/reservasService';
import { formatearFechaLarga, extraerHora } from '../../utils/dateFormatter';
import { cancelAllReminders } from '../../services/notificationService';

export default function DetalleReservaScreen({ navigation, route }) {
  const { reserva, claseId } = route.params || {};
  const [reservaData, setReservaData] = useState(reserva || null);
  const [loading, setLoading] = useState(!reserva);
  const [eliminando, setEliminando] = useState(false);

  // 🔹 Cargar reserva si solo vino el ID desde la notificación
  useEffect(() => {
    const cargarReserva = async () => {
      if (!claseId || reserva) return; // si ya vino la reserva, no busca
      try {
        setLoading(true);
        const data = await reservasService.getReservaPorClase(claseId);
        setReservaData(data);
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar la reserva');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    cargarReserva();
  }, [claseId]);

  // 🔹 Datos seguros
  const clase = reservaData?.clase || {};
  const disciplina = clase.disciplina || {};
  const instructor = clase.instructor || {};
  const sede = clase.sede || {};

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'confirmada':
        return '#28a745';
      case 'cancelada':
        return '#dc3545';
      case 'pendiente':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  const getEstadoTexto = (estado) => estado || 'Confirmada';

  const handleCancelarReserva = () => {
    Alert.alert('Cancelar Reserva', '¿Estás seguro de que deseas cancelar esta reserva?', [
      { text: 'No, mantener', style: 'cancel' },
      {
        text: 'Sí, cancelar',
        style: 'destructive',
        onPress: async () => {
          try {
            setEliminando(true);
            await reservasService.cancelarReserva(reservaData.id);
            await cancelAllReminders();

            Alert.alert('Reserva Cancelada', 'Tu reserva ha sido cancelada exitosamente.', [
              { text: 'OK', onPress: () => navigation.navigate('MisReservasMain') },
            ]);
          } catch (error) {
            const mensaje =
              error.response?.data?.message ||
              'No se pudo cancelar la reserva. Intenta nuevamente.';
            Alert.alert('Error', mensaje);
          } finally {
            setEliminando(false);
          }
        },
      },
    ]);
  };

  const puedeSerCancelada = () => {
    if (!reservaData?.estado || reservaData.estado.toLowerCase() === 'cancelada') return false;
    const fechaClase = new Date(clase.fechaInicio);
    const ahora = new Date();
    return fechaClase > ahora;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Cargando reserva...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Estado */}
        <View style={styles.estadoContainer}>
          <View
            style={[
              styles.estadoBadge,
              { backgroundColor: getEstadoColor(reservaData.estado) },
            ]}
          >
            <Text style={styles.estadoText}>{getEstadoTexto(reservaData.estado)}</Text>
          </View>
        </View>

        {/* Clase */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Clase</Text>
          <View style={styles.card}>
            {clase.nombre && <Text style={styles.disciplinaText}>{clase.nombre}</Text>}
            {clase.descripcion && <Text style={styles.descripcionText}>{clase.descripcion}</Text>}
            {disciplina.nombre && (
              <Text style={[styles.infoSecondaryText, { marginTop: 8 }]}>
                Disciplina: {disciplina.nombre}
              </Text>
            )}
          </View>
        </View>

        {/* Instructor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Instructor</Text>
          <View style={styles.card}>
            <Text style={styles.infoText}>
              {instructor.nombre} {instructor.apellido || ''}
            </Text>
            {instructor.email && (
              <Text style={styles.infoSecondaryText}>📧 {instructor.email}</Text>
            )}
            {instructor.telefono && (
              <Text style={styles.infoSecondaryText}>📞 {instructor.telefono}</Text>
            )}
          </View>
        </View>

        {/* Sede */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Sede</Text>
          <View style={styles.card}>
            <Text style={styles.infoText}>{sede.nombre || 'No disponible'}</Text>
            {sede.direccion && <Text style={styles.infoSecondaryText}>{sede.direccion}</Text>}
            {sede.telefono && (
              <Text style={styles.infoSecondaryText}>📞 {sede.telefono}</Text>
            )}
          </View>
        </View>

        {/* Fecha */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🗓️ Fecha y Hora</Text>
          <View style={styles.card}>
            <Text style={styles.infoText}>{formatearFechaLarga(clase.fechaInicio)}</Text>
            {clase.fechaInicio && clase.fechaFin && (
              <Text style={styles.infoSecondaryText}>
                ⏱️ Horario: {extraerHora(clase.fechaInicio)} - {extraerHora(clase.fechaFin)}
              </Text>
            )}
          </View>
        </View>

        {/* Capacidad */}
        {(clase.cupoActual !== undefined && clase.cupoMaximo !== undefined) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👥 Capacidad</Text>
            <View style={styles.card}>
              <Text style={styles.infoText}>
                {clase.cupoActual} / {clase.cupoMaximo} personas
              </Text>
              <Text style={styles.infoSecondaryText}>
                {clase.cupoMaximo - clase.cupoActual} lugares disponibles
              </Text>
            </View>
          </View>
        )}

        {/* Info reserva */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Información de Reserva</Text>
          <View style={styles.card}>
            <Text style={styles.infoSecondaryText}>ID de Reserva: #{reservaData.id}</Text>
            {reservaData.fechaReserva && (
              <Text style={styles.infoSecondaryText}>
                Reservado el: {new Date(reservaData.fechaReserva).toLocaleDateString('es-AR')}
              </Text>
            )}
          </View>
        </View>

        {/* Cancelar */}
        {puedeSerCancelada() && (
          <TouchableOpacity
            style={styles.cancelarButton}
            onPress={handleCancelarReserva}
            disabled={eliminando}
          >
            {eliminando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.cancelarButtonText}>🗑️ Cancelar Reserva</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
  scrollView: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  estadoContainer: { alignItems: 'center', marginBottom: 20 },
  estadoBadge: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  estadoText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#666', marginBottom: 10 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disciplinaText: { fontSize: 20, fontWeight: 'bold', color: '#222', marginBottom: 8 },
  descripcionText: { fontSize: 15, color: '#666', lineHeight: 22 },
  infoText: { fontSize: 16, color: '#222', marginBottom: 6, fontWeight: '500' },
  infoSecondaryText: { fontSize: 14, color: '#666', marginTop: 4 },
  cancelarButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelarButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

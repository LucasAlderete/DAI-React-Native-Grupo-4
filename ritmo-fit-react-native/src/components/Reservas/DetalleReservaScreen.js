import React, { useState } from 'react';
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

export default function DetalleReservaScreen({ navigation, route }) {
  const { reserva } = route.params;
  const [eliminando, setEliminando] = useState(false);

  const clase = reserva?.clase || {};
  const disciplina = clase.disciplina || {};
  const instructor = clase.instructor || {};
  const sede = clase.sede || {};

  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'Fecha no disponible';
    
    try {
      const fecha = new Date(fechaString);
      
      // Verificar si la fecha es válida
      if (isNaN(fecha.getTime())) {
        console.warn('Fecha inválida:', fechaString);
        return 'Fecha no disponible';
      }
      
      const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      return fecha.toLocaleDateString('es-AR', opciones);
    } catch (error) {
      console.error('Error al formatear fecha:', error, fechaString);
      return 'Fecha no disponible';
    }
  };

  const formatearFechaCorta = (fechaString) => {
    if (!fechaString) return 'Fecha no disponible';
    
    try {
      const fecha = new Date(fechaString);
      
      // Verificar si la fecha es válida
      if (isNaN(fecha.getTime())) {
        return 'Fecha no disponible';
      }
      
      return fecha.toLocaleDateString('es-AR');
    } catch (error) {
      console.error('Error al formatear fecha:', error, fechaString);
      return 'Fecha no disponible';
    }
  };

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

  const getEstadoTexto = (estado) => {
    return estado || 'Confirmada';
  };

  const handleCancelarReserva = () => {
    Alert.alert(
      'Cancelar Reserva',
      '¿Estás seguro de que deseas cancelar esta reserva?\n\nEsta acción no se puede deshacer.',
      [
        {
          text: 'No, mantener',
          style: 'cancel',
        },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              setEliminando(true);
              await reservasService.cancelarReserva(reserva.id);
              Alert.alert(
                'Reserva Cancelada',
                'Tu reserva ha sido cancelada exitosamente.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('MisReservasMain'),
                  },
                ]
              );
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
      ]
    );
  };

  const puedeSerCancelada = () => {
    if (!reserva.estado || reserva.estado.toLowerCase() === 'cancelada') {
      return false;
    }
    // Verificar si la clase ya pasó
    const fechaClase = new Date(clase.fechaInicio);
    const ahora = new Date();
    return fechaClase > ahora;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Estado de la Reserva */}
        <View style={styles.estadoContainer}>
          <View
            style={[
              styles.estadoBadge,
              { backgroundColor: getEstadoColor(reserva.estado) },
            ]}
          >
            <Text style={styles.estadoText}>
              {getEstadoTexto(reserva.estado)}
            </Text>
          </View>
        </View>

        {/* Información de la Clase */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Clase</Text>
          <View style={styles.card}>
            {clase.nombre && (
              <Text style={styles.disciplinaText}>{clase.nombre}</Text>
            )}
            {clase.descripcion && (
              <Text style={styles.descripcionText}>{clase.descripcion}</Text>
            )}
            {disciplina.nombre && (
              <Text style={[styles.infoSecondaryText, { marginTop: 8 }]}>
                Disciplina: {disciplina.nombre}
              </Text>
            )}
          </View>
        </View>

        {/* Información del Instructor */}
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

        {/* Información de la Sede */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Sede</Text>
          <View style={styles.card}>
            <Text style={styles.infoText}>{sede.nombre || 'No disponible'}</Text>
            {sede.direccion && (
              <Text style={styles.infoSecondaryText}>{sede.direccion}</Text>
            )}
            {sede.telefono && (
              <Text style={styles.infoSecondaryText}>📞 {sede.telefono}</Text>
            )}
          </View>
        </View>

        {/* Fecha y Hora */}
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

        {/* Información de la Reserva */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Información de Reserva</Text>
          <View style={styles.card}>
            <Text style={styles.infoSecondaryText}>
              ID de Reserva: #{reserva.id}
            </Text>
            {reserva.fechaReserva && (
              <Text style={styles.infoSecondaryText}>
                Reservado el: {formatearFechaCorta(reserva.fechaReserva)}
              </Text>
            )}
          </View>
        </View>

        {/* Botón Cancelar */}
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

        {!puedeSerCancelada() && reserva.estado?.toLowerCase() === 'cancelada' && (
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxText}>
              ℹ️ Esta reserva ya fue cancelada
            </Text>
          </View>
        )}

        {!puedeSerCancelada() && reserva.estado?.toLowerCase() !== 'cancelada' && (
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxText}>
              ℹ️ No se puede cancelar esta reserva porque la clase ya pasó
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  estadoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  estadoBadge: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  estadoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
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
  disciplinaText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  descripcionText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  infoText: {
    fontSize: 16,
    color: '#222',
    marginBottom: 6,
    fontWeight: '500',
  },
  infoSecondaryText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  cancelarButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cancelarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#e7f3ff',
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    marginTop: 10,
  },
  infoBoxText: {
    fontSize: 14,
    color: '#004085',
    lineHeight: 20,
  },
});


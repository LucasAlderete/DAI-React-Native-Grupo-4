import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import reservasService from '../../services/reservasService';
import { formatearFechaLarga, extraerHora } from '../../utils/dateFormatter';
import { ThemeContext } from '../../context/ThemeContext';

export default function DetalleReservaScreen({ navigation, route }) {
  const { reserva } = route.params;
  const [eliminando, setEliminando] = useState(false);

  const clase = reserva?.clase || {};
  const disciplina = clase.disciplina || {};
  const instructor = clase.instructor || {};
  const sede = clase.sede || {};

  const { theme } = useContext(ThemeContext);

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

  const openMaps = () => {
      const query = encodeURIComponent(clase.sede.direccion);
      const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
      Linking.openURL(url);
      // ej https://www.google.com/maps/search/?api=1&query=Av.%20Corrientes%201234%2C%20CABA
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
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
          <Text style={[styles.sectionTitle, {color: theme.text}]}>📚 Clase</Text>
          <View style={[styles.card, {backgroundColor: theme.card, borderColor: theme.border}]}>
            {clase.nombre && (
              <Text style={[styles.disciplinaText, {color: theme.text}]}>{clase.nombre}</Text>
            )}
            {clase.descripcion && (
              <Text style={[styles.descripcionText, {color: theme.textSecondary}]}>{clase.descripcion}</Text>
            )}
            {disciplina.nombre && (
              <Text style={[styles.infoSecondaryText, { marginTop: 8 }, {color: theme.textSecondary}]}>
                Disciplina: {disciplina.nombre}
              </Text>
            )}
          </View>
        </View>

        {/* Información del Instructor */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.text}]}>👤 Instructor</Text>
          <View style={[styles.card, {backgroundColor: theme.card, borderColor: theme.border}]}>
            <Text style={[styles.infoText, {color: theme.text}]}>
              {instructor.nombre} {instructor.apellido || ''}
            </Text>
            {instructor.email && (
              <Text style={[styles.infoSecondaryText, {color: theme.textSecondary}]}>📧 {instructor.email}</Text>
            )}
            {instructor.telefono && (
              <Text style={[styles.infoSecondaryText, {color: theme.textSecondary}]}>📞 {instructor.telefono}</Text>
            )}
          </View>
        </View>

        {/* Información de la Sede */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.text}]}>📍 Sede</Text>
          <View style={[styles.card, {backgroundColor: theme.card, borderColor: theme.border}]}>
            <Text style={[styles.infoText, {color: theme.text}]}>{sede.nombre || 'No disponible'}</Text>
            {sede.direccion && (
              <>
                <Text style={[styles.infoSecondaryText, {color: theme.textSecondary}]}>{sede.direccion}</Text>

                <Text style={styles.linkText} onPress={openMaps}>🧭 Como llegar</Text>
              </>
            )}
            {sede.telefono && (
              <Text style={[styles.infoSecondaryText, {color: theme.textSecondary}]}>📞 {sede.telefono}</Text>
            )}
            
          </View>
        </View>

        {/* Fecha y Hora */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.text}]}>🗓️ Fecha y Hora</Text>
          <View style={[styles.card, {backgroundColor: theme.card, borderColor: theme.border}]}>
            <Text style={[styles.infoText, {color: theme.text}]}>{formatearFechaLarga(clase.fechaInicio)}</Text>
            {clase.fechaInicio && clase.fechaFin && (
              <Text style={[styles.infoSecondaryText, {color: theme.textSecondary}]}>
                ⏱️ Horario: {extraerHora(clase.fechaInicio)} - {extraerHora(clase.fechaFin)}
              </Text>
            )}
          </View>
        </View>

        {/* Capacidad */}
        {(clase.cupoActual !== undefined && clase.cupoMaximo !== undefined) && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: theme.text}]}>👥 Capacidad</Text>
            <View style={[styles.card, {backgroundColor: theme.card, borderColor: theme.border}]}>
              <Text style={[styles.infoText, {color: theme.text}]}>
                {clase.cupoActual} / {clase.cupoMaximo} personas
              </Text>
              <Text style={[styles.infoSecondaryText, {color: theme.textSecondary}]}>
                {clase.cupoMaximo - clase.cupoActual} lugares disponibles
              </Text>
            </View>
          </View>
        )}

        {/* Información de la Reserva */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.text}]}>📋 Información de Reserva</Text>
          <View style={[styles.card, {backgroundColor: theme.card, borderColor: theme.border}]}>
            <Text style={[styles.infoSecondaryText, {color: theme.textSecondary}]}>
              ID de Reserva: #{reserva.id}
            </Text>
            {reserva.fechaReserva && (
              <Text style={[styles.infoSecondaryText, {color: theme.textSecondary}]}>
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
    marginBottom: 10,
  },
  card: {
    borderWidth: 1,
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
    marginBottom: 8,
  },
  descripcionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '500',
  },
  infoSecondaryText: {
    fontSize: 14,
    marginTop: 4,
  },
  linkText: {
    fontSize: 14,
    color: '#007bff',
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


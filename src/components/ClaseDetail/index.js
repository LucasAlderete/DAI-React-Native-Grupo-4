import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { getClaseById } from '../../services/ClasesService';

const ClaseDetail = ({ route, navigation }) => {
  const { claseId } = route.params;
  const [clase, setClase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClaseDetail();
  }, [claseId]);

  const fetchClaseDetail = async () => {
    try {
      setLoading(true);
      const data = await getClaseById(claseId);
      setClase(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar el detalle de la clase');
      console.error('Error fetching clase detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${dayName} ${day} de ${month} ${hours}:${minutes}hs`;
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end - start;
    const diffMins = Math.round(diffMs / 60000);
    return `${diffMins} minutos`;
  };

  const getCuposDisponibles = () => {
    if (!clase) return 0;
    return clase.cupoMaximo - clase.cupoActual;
  };

  const handleReservar = () => {
    // TODO: Implementar lógica de reserva
    console.log('Reservar clase:', claseId);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Cargando detalle...</Text>
      </View>
    );
  }

  if (error || !clase) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Clase no encontrada'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchClaseDetail}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Text style={styles.infoIcon}>{icon}</Text>
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.card}>
        <Text style={styles.disciplineName}>{clase.disciplina.nombre}</Text>

        <InfoRow
          icon="📅"
          label="Fecha y Hora:"
          value={formatDateTime(clase.fechaInicio)}
        />

        <InfoRow
          icon="🕐"
          label="Duración:"
          value={calculateDuration(clase.fechaInicio, clase.fechaFin)}
        />

        <InfoRow
          icon="👤"
          label="Instructor:"
          value={`${clase.instructor.nombre} ${clase.instructor.apellido}`}
        />

        <InfoRow
          icon="ℹ️"
          label="Cupos disponibles:"
          value={getCuposDisponibles().toString()}
        />

        <InfoRow
          icon="📍"
          label="Sede:"
          value={clase.sede.nombre}
        />

        <InfoRow
          icon="📍"
          label="Dirección:"
          value={clase.sede.direccion}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.reservarButton,
          !clase.disponible && styles.reservarButtonDisabled
        ]}
        onPress={handleReservar}
        disabled={!clase.disponible}
      >
        <Text style={styles.reservarButtonText}>
          {clase.disponible ? 'Reservar' : 'No disponible'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disciplineName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 10,
    width: 24,
  },
  infoLabel: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: '#1F2937',
    textAlign: 'right',
    flex: 1,
  },
  reservarButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2563EB',
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reservarButtonDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  reservarButtonText: {
    color: '#2563EB',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ClaseDetail;

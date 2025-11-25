import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
} from 'react-native';
import { getClases } from '../../services/ClasesService';
import reservasService from '../../services/reservasService';
import { extraerHora } from '../../utils/dateFormatter';
import { ThemeContext } from '../../context/ThemeContext';
import { lightColors, darkColors } from '../../config/colors';

export default function CrearReservaScreen({ navigation }) {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reservando, setReservando] = useState(false);
  const [searchText, setSearchText] = useState('');

  const { darkMode } = useContext(ThemeContext);
  const colors = darkMode ? darkColors : lightColors;

  useEffect(() => {
    cargarClases();
  }, []);

  const cargarClases = async () => {
    try {
      setLoading(true);
      const data = await getClases();
      const clasesData = data.content || data;
      
      // Log para ver el formato de las fechas
      if (clasesData.length > 0) {
        console.log('Formato de fecha recibido:', clasesData[0].fechaInicio);
        console.log('Primera clase completa:', JSON.stringify(clasesData[0], null, 2));
      }
      
      setClases(clasesData);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'No se pudieron cargar las clases'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarClases();
  };

  const handleReservar = async (claseId, nombreClase) => {
    Alert.alert(
      'Confirmar Reserva',
      `¿Deseas reservar la clase "${nombreClase}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              setReservando(true);
              await reservasService.crearReserva(claseId);
              Alert.alert(
                'Éxito',
                '¡Reserva creada exitosamente!',
                [
                  {
                    text: 'Ver mis reservas',
                    onPress: () => {
                      // Navegar de vuelta a MisReservasMain en el mismo stack
                      navigation.navigate('MisReservasMain');
                    },
                  },
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } catch (error) {
              const mensaje =
                error.response?.data?.message ||
                'No se pudo crear la reserva. Intenta nuevamente.';
              Alert.alert('Error', mensaje);
            } finally {
              setReservando(false);
            }
          },
        },
      ]
    );
  };

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
        weekday: 'short',
        year: 'numeric',
        month: 'short',
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

  const getCapacidadColor = (capacidad, capacidadMaxima) => {
    const porcentaje = (capacidad / capacidadMaxima) * 100;
    if (porcentaje >= 90) return '#dc3545';
    if (porcentaje >= 70) return '#ffc107';
    return '#28a745';
  };

  const filtrarClases = () => {
    if (!searchText.trim()) return clases;

    const textoBusqueda = searchText.toLowerCase();
    return clases.filter((clase) => {
      const disciplina = clase.disciplina?.nombre?.toLowerCase() || '';
      const instructor = clase.instructor?.nombre?.toLowerCase() || '';
      const sede = clase.sede?.nombre?.toLowerCase() || '';
      
      return (
        disciplina.includes(textoBusqueda) ||
        instructor.includes(textoBusqueda) ||
        sede.includes(textoBusqueda)
      );
    });
  };

  const renderClaseItem = ({ item }) => {
    const disciplina = item.disciplina || {};
    const instructor = item.instructor || {};
    const sede = item.sede || {};
    const cupoActual = item.cupoActual || 0;
    const cupoMaximo = item.cupoMaximo || 20;
    const lugaresDisponibles = cupoMaximo - cupoActual;
    const hayLugar = lugaresDisponibles > 0;

    return (
      <View style={[styles.claseCard, {backgroundColor: colors.card, borderColor: colors.border}]}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Text style={[styles.disciplinaText, {color: colors.text}]}>{item.nombre || disciplina.nombre || 'Clase'}</Text>
            <Text style={[styles.instructorText, {color: colors.textSecondary}]}>
              👤 {instructor.nombre} {instructor.apellido || ''}
            </Text>
          </View>
          <View
            style={[
              styles.capacidadBadge,
              { backgroundColor: getCapacidadColor(cupoActual, cupoMaximo) },
            ]}
          >
            <Text style={styles.capacidadText}>
              {cupoActual}/{cupoMaximo}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={[styles.sedeText, {color: colors.textSecondary}]}>📍 {sede.nombre || 'Sede'}</Text>
          <Text style={[styles.direccionText, {color: colors.textSecondary}]}>
            {sede.direccion || 'Dirección no disponible'}
          </Text>
          <Text style={[styles.fechaText, {color: colors.textSecondary}]}>
            🗓️ {formatearFecha(item.fechaInicio)}
          </Text>
          {item.fechaInicio && item.fechaFin && (
            <Text style={[styles.duracionText, {color: colors.textSecondary}]}>
              ⏱️ {extraerHora(item.fechaInicio)} - {extraerHora(item.fechaFin)}
            </Text>
          )}
          {disciplina.descripcion && (
            <Text style={[styles.descripcionText, {color: colors.textSecondary}]} numberOfLines={2}>
              {disciplina.descripcion}
            </Text>
          )}
        </View>

        <View style={[styles.cardFooter, {borderTopColor: colors.border}]}>
          <View>
            <Text style={[styles.lugaresText, {color: colors.textSecondary}]}>
              {hayLugar
                ? `${lugaresDisponibles} lugar${lugaresDisponibles !== 1 ? 'es' : ''} disponible${lugaresDisponibles !== 1 ? 's' : ''}`
                : 'Sin lugares disponibles'}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.reservarButton,
              !hayLugar && styles.reservarButtonDisabled,
            ]}
            onPress={() => handleReservar(item.id, disciplina.nombre)}
            disabled={!hayLugar || reservando}
          >
            <Text style={styles.reservarButtonText}>
              {hayLugar ? 'Reservar' : 'Completo'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>🔍</Text>
      <Text style={styles.emptyTitle}>No se encontraron clases</Text>
      <Text style={styles.emptySubtitle}>
        {searchText
          ? 'Intenta con otros términos de búsqueda'
          : 'No hay clases disponibles en este momento'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Cargando clases...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={[styles.searchContainer, {backgroundColor: colors.background, borderBottomColor: colors.border}]}>
        <TextInput
          style={[styles.searchInput, {backgroundColor: colors.card, borderColor: colors.border}]}
          placeholder="Buscar por disciplina, instructor o sede..."
          placeholderTextColor= {colors.placeholder}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filtrarClases()}
        renderItem={renderClaseItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={
          filtrarClases().length === 0 ? styles.emptyListContainer : styles.listContainer
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {reservando && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingOverlayText}>Creando reserva...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 15,
    borderBottomWidth: 1,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 15,
  },
  emptyListContainer: {
    flex: 1,
  },
  claseCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  disciplinaText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  instructorText: {
    fontSize: 14,
  },
  capacidadBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 10,
  },
  capacidadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    marginBottom: 12,
  },
  sedeText: {
    fontSize: 15,
    marginBottom: 4,
    fontWeight: '600',
  },
  direccionText: {
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 20,
  },
  fechaText: {
    fontSize: 14,
    marginBottom: 6,
  },
  duracionText: {
    fontSize: 14,
    marginBottom: 6,
  },
  descripcionText: {
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  lugaresText: {
    fontSize: 14,
  },
  reservarButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  reservarButtonDisabled: {
    backgroundColor: '#ccc',
  },
  reservarButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlayText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
});


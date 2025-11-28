import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import reservasService from '../../services/reservasService';
import { extraerHora } from '../../utils/dateFormatter';
import { ThemeContext } from '../../context/ThemeContext';

export default function MisReservasScreen({ navigation }) {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { theme } = useContext(ThemeContext);

  const cargarReservas = async (pageNum = 0, isRefreshing = false) => {
    try {
      if (!isRefreshing && pageNum === 0) {
        setLoading(true);
      }

      const data = await reservasService.getMisReservas(pageNum, 10);
      const reservasData = data.content || data;
      
      // Log para ver el formato de las fechas
      if (reservasData.length > 0 && pageNum === 0) {
        console.log('Primera reserva completa:', JSON.stringify(reservasData[0], null, 2));
        console.log('Fecha de la clase:', reservasData[0]?.clase?.fechaInicio);
      }
      
      if (pageNum === 0) {
        setReservas(reservasData);
      } else {
        setReservas((prev) => [...prev, ...reservasData]);
      }

      setHasMore(!data.last && data.content?.length > 0);
      setPage(pageNum);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'No se pudieron cargar las reservas'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarReservas(0);
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    cargarReservas(0, true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      cargarReservas(page + 1);
    }
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

  const renderReservaItem = ({ item }) => {
    const clase = item.clase || {};
    const disciplina = clase.disciplina || {};
    const instructor = clase.instructor || {};
    const sede = clase.sede || {};

    return (
      <TouchableOpacity
        style={[styles.reservaCard, {backgroundColor: theme.card, borderColor: theme.border}]}
        onPress={() => navigation.navigate('DetalleReserva', { reserva: item })}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.disciplinaText, {color: theme.text}]}>{clase.nombre || disciplina.nombre || 'Clase'}</Text>
          <View
            style={[
              styles.estadoBadge,
              { backgroundColor: getEstadoColor(item.estado) },
            ]}
          >
            <Text style={styles.estadoText}>
              {getEstadoTexto(item.estado)}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={[styles.instructorText, {color: theme.textSecondary}]}>
            👤 {instructor.nombre} {instructor.apellido || ''}
          </Text>
          <Text style={[styles.sedeText, {color: theme.textSecondary}]}>📍 {sede.nombre || 'Sede'}</Text>
          <Text style={[styles.fechaText, {color: theme.textSecondary}]}>
            🗓️ {formatearFecha(clase.fechaInicio)}
          </Text>
          {clase.fechaInicio && clase.fechaFin && (
            <Text style={[styles.duracionText, {color: theme.textSecondary}]}>
              ⏱️ {extraerHora(clase.fechaInicio)} - {extraerHora(clase.fechaFin)}
            </Text>
          )}
        </View>

        <View style={[styles.cardFooter, {borderTopColor: theme.border}]}>
          <Text style={styles.verDetalleText}>Ver detalle →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.text }]}>📅</Text>
      
      <Text style={[styles.emptyTitle, { color: theme.text }]}>No tienes reservas</Text>
      <Text style={[styles.emptySubtitle, { color: theme.text }]}>
        Comienza reservando una clase para ver tus reservas aquí
      </Text>
      <TouchableOpacity
        style={styles.crearButton}
        onPress={() => {
          // Navegar a CrearReserva en el ReservasStack
          navigation.navigate('CrearReserva');
        }}
      >
        <Text style={styles.crearButtonText}>➕ Reservar Clase</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && page === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Cargando reservas...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]} >
      <View style={[
        styles.header,
        {
          backgroundColor: theme.card,
          borderBottomColor: theme.border
        }
      ]}>
        <Text style={[styles.title, { color: theme.text }]} >Mis Reservas</Text>
        <TouchableOpacity
          onPress={() => {
            // Navegar a CrearReserva en el ReservasStack
            navigation.navigate('CrearReserva');
          }}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+ Nueva</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={reservas}
        renderItem={renderReservaItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={
          reservas.length === 0 ? styles.emptyListContainer : styles.listContainer
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && page > 0 ? (
            <ActivityIndicator size="small" color="#007bff" style={styles.footerLoader} />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
  reservaCard: {
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
    alignItems: 'center',
    marginBottom: 12,
  },
  disciplinaText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    marginBottom: 12,
  },
  instructorText: {
    fontSize: 15,
    marginBottom: 6,
  },
  sedeText: {
    fontSize: 14,
    marginBottom: 6,
  },
  fechaText: {
    fontSize: 14,
    marginBottom: 6,
  },
  duracionText: {
    fontSize: 14,
  },
  cardFooter: {
    borderTopWidth: 1,
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  verDetalleText: {
    color: '#007bff',
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
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  crearButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  crearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerLoader: {
    marginVertical: 20,
  },
});


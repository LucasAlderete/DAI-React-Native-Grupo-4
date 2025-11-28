import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getHistorialAsistencias, formatDateForBackend } from '../../services/historialService';
import { getAsistenciasCalificables } from '../../services/calificacionService';
import AsistenciaCard from './AsistenciaCard';
import DateRangeFilter from './DateRangeFilter';
import { ThemeContext } from '../../context/ThemeContext';

const HistorialScreen = ({ navigation }) => {
    // ========================================
    // ESTADOS Y REFS
    // ========================================
    const [asistencias, setAsistencias] = useState([]);
    const [asistenciasCalificablesIds, setAsistenciasCalificablesIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [shouldReloadOnFocus, setShouldReloadOnFocus] = useState(false);

    const { theme } = useContext(ThemeContext);

    // ========================================
    // EFECTO: Cargar datos al montar
    // ========================================
    useEffect(() => {
        console.log('🟢 useEffect - Montaje inicial del componente');
        fetchHistorial();
        setIsInitialLoad(false);
        // Después de la carga inicial, habilitar recarga en foco
        setShouldReloadOnFocus(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ========================================
    // EFECTO: Recargar cuando cambian los filtros
    // ========================================
    useEffect(() => {
        if (!isInitialLoad) {
            fetchHistorial(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fechaInicio, fechaFin]);

    // ========================================
    // EFECTO: Recargar cuando la pantalla recibe foco (vuelve de otra pantalla)
    // ========================================
    useFocusEffect(
        React.useCallback(() => {
            console.log(`🔵 HistorialScreen recibió foco - shouldReloadOnFocus: ${shouldReloadOnFocus}`);
            
            if (!shouldReloadOnFocus) {
                console.log('🔵 Primera carga - NO recargar');
                return;
            }
            
            console.log('🔄 Recargando datos porque volvió a la pantalla...');
            fetchHistorial(true, false);
            
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [shouldReloadOnFocus])
    );

    // ========================================
    // FUNCIONES
    // ========================================

    const fetchHistorial = async (resetPage = true, isRefresh = false) => {
        console.log(`📥 fetchHistorial llamado - resetPage: ${resetPage}, isRefresh: ${isRefresh}`);
        try {
            // Solo mostrar loading completo si no es un refresh
            if (!isRefresh) {
                setLoading(true);
            }
            setError(null);

            const filtros = {
                page: resetPage ? 0 : currentPage,
                size: 20,
            };

            if (fechaInicio) filtros.fechaInicio = formatDateForBackend(fechaInicio);
            if (fechaFin) filtros.fechaFin = formatDateForBackend(fechaFin);

            // Cargar historial y asistencias calificables en paralelo
            const [response, calificablesResponse] = await Promise.all([
                getHistorialAsistencias(filtros),
                getAsistenciasCalificables({ page: 0, size: 1000 }).catch(err => {
                    console.warn('⚠️ Error al cargar asistencias calificables:', err);
                    return { content: [] }; // Retornar estructura vacía si falla
                })
            ]);

            // 🔍 LOGGING TEMPORAL PARA DEBUGGING - Puedes comentar esto después
            console.log('📊 ========== RESPUESTA DEL BACKEND ==========');
            console.log('📊 Total elementos:', response.totalElements);
            console.log('📊 Total páginas:', response.totalPages);
            console.log('📊 Cantidad en esta página:', response.content?.length);

            if (response.content && response.content.length > 0) {
                console.log('📊 Primera asistencia (estructura completa):');
                console.log(JSON.stringify(response.content[0], null, 2));

                console.log('📊 Verificación de campos:');
                console.log('  - fechaAsistencia:', response.content[0].fechaAsistencia);
                console.log('  - duracionMinutos:', response.content[0].duracionMinutos);
                console.log('  - clase:', response.content[0].clase);
                console.log('  - clase.nombre:', response.content[0].clase?.nombre);
                console.log('  - clase.sede:', response.content[0].clase?.sede);
                console.log('  - clase.sede.nombre:', response.content[0].clase?.sede?.nombre);
            } else {
                console.log('📊 No hay asistencias en la respuesta');
            }
            console.log('📊 ==========================================');

            // Crear Set con los IDs de asistencias calificables
            // Asegurar que los IDs sean del mismo tipo (números)
            const calificablesIds = new Set(
                (calificablesResponse.content || []).map(asistencia => 
                    typeof asistencia.id === 'string' ? parseInt(asistencia.id) : asistencia.id
                )
            );
            
            console.log('⭐ ========== ASISTENCIAS CALIFICABLES ==========');
            console.log('⭐ Total calificables:', calificablesIds.size);
            console.log('⭐ IDs calificables:', Array.from(calificablesIds));
            if (calificablesResponse.content && calificablesResponse.content.length > 0) {
                console.log('⭐ Primera calificable (estructura):');
                console.log(JSON.stringify(calificablesResponse.content[0], null, 2));
            }
            
            // Verificar coincidencias entre historial y calificables
            if (response.content && response.content.length > 0) {
                const historialIds = response.content.map(a => a.id);
                console.log('📋 IDs del historial:', historialIds);
                const coincidencias = historialIds.filter(id => calificablesIds.has(id));
                console.log('✅ Coincidencias (IDs que son calificables):', coincidencias);
            }
            console.log('⭐ ==========================================');

            setAsistencias(response.content || []);
            setAsistenciasCalificablesIds(calificablesIds);
            setTotalPages(response.totalPages || 0);
            setCurrentPage(response.number || 0);

        } catch (err) {
            setError('Error al cargar el historial de asistencias');
            console.error('Error fetching historial:', err);
        } finally {
            setLoading(false);
            if (isRefresh) {
                setRefreshing(false);
            }
        }
    };

    // Función para manejar el pull-to-refresh
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchHistorial(true, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fechaInicio, fechaFin]);

    const handleApplyFilter = (inicio, fin) => {
        setFechaInicio(inicio);
        setFechaFin(fin);
        setCurrentPage(0);
    };

    const handleClearFilter = () => {
        setFechaInicio(null);
        setFechaFin(null);
        setCurrentPage(0);
    };

    // ========================================
    // RENDER CONDICIONAL: Loading
    // ========================================
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Cargando historial de asistencias...</Text>
            </View>
        );
    }

    // ========================================
    // RENDER CONDICIONAL: Error
    // ========================================
    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchHistorial}>
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // ========================================
    // RENDER PRINCIPAL
    // ========================================
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View 
            style={[
                styles.header,
                {
                    backgroundColor: theme.background,
                    borderBottomColor: theme.headerBorder,
                },
            ]}
            >
                <Text style={[styles.title, { color: theme.text }]}>Historial de asistencias</Text>
            </View>

            <DateRangeFilter
                fechaInicio={fechaInicio}
                fechaFin={fechaFin}
                onApplyFilter={handleApplyFilter}
                onClearFilter={handleClearFilter}
            />

            <FlatList
                data={asistencias}
                renderItem={({ item }) => {
                    const itemId = typeof item.id === 'string' ? parseInt(item.id) : item.id;
                    const esCalificable = asistenciasCalificablesIds.has(itemId);
                    return (
                        <AsistenciaCard 
                            asistencia={item} 
                            navigation={navigation}
                            esCalificable={esCalificable}
                        />
                    );
                }}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#2563EB']} 
                        tintColor="#2563EB" 
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, {color: theme.textSecondary}]}>No hay asistencias registradas</Text>
                    </View>
                }
            />
        </View>
    );
};

// ========================================
// ESTILOS
// ========================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    header: {
        padding: 16,
        paddingTop: 50,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#6B7280',
    },
    errorText: {
        fontSize: 16,
        color: '#DC2626',
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
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    listContainer: {
        padding: 16,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
});

export default HistorialScreen;
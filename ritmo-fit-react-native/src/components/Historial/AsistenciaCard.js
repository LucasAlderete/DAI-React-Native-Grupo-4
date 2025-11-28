import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { parseApiDate } from '../../services/dateUtils';

/**
 * Componente que muestra una tarjeta de asistencia individual
 * Adaptado a la estructura real de AsistenciaDto del backend:
 * - fechaAsistencia (no fechaHora)
 * - duracionMinutos (no duracion)
 * - clase.sede.nombre (sede está dentro de clase)
 */
const AsistenciaCard = ({ asistencia, navigation }) => {
    // Validación: Si no hay asistencia, no renderizar nada
    if (!asistencia) {
        console.warn('⚠️ AsistenciaCard recibió asistencia undefined');
        return null;
    }

    // Formatear fecha para mostrar de forma legible
    const formatFecha = (fechaString) => {
        if (!fechaString) return 'Fecha no disponible';

        try {
            const date = parseApiDate(fechaString);
            if (!date) return 'Fecha no disponible';

            const dia = date.getDate();
            const mes = date.getMonth() + 1;
            const año = date.getFullYear();
            const hora = date.getHours().toString().padStart(2, '0');
            const minutos = date.getMinutes().toString().padStart(2, '0');

            return `${dia}/${mes}/${año} - ${hora}:${minutos}hs`;
        } catch (error) {
            console.warn('⚠️ Error formateando fecha:', error);
            return 'Fecha inválida';
        }
    };

    // Extraer datos con valores por defecto
    // Backend envía: fechaAsistencia (no fechaHora)
    const fecha = asistencia.fechaAsistencia || asistencia.fechaCheckin;

    // Backend envía: duracionMinutos (no duracion)
    const duracion = asistencia.duracionMinutos;

    // Backend envía: clase.nombre (puede ser null)
    const claseNombre = asistencia.clase?.nombre || 'Clase no especificada';

    // Backend envía: clase.sede.nombre (puede ser null/undefined)
    // La sede está DENTRO de clase, no directamente en asistencia
    const sedeNombre = asistencia.clase?.sede?.nombre || 'Sede no especificada';

    return (
        <View style={styles.card}>
            {/* Fecha de la asistencia */}
            <Text style={styles.fecha}>
                {formatFecha(fecha)}
            </Text>

            {/* Nombre de la clase */}
            <Text style={styles.clase}>
                {claseNombre}
            </Text>

            {/* Información de sede */}
            <View style={styles.infoRow}>
                <Text style={styles.label}>Sede:</Text>
                <Text style={styles.value}>{sedeNombre}</Text>
            </View>

            {/* Duración */}
            <View style={styles.infoRow}>
                <Text style={styles.label}>Duración:</Text>
                <Text style={styles.value}>
                    {duracion ? `${duracion} minutos` : 'No especificada'}
                </Text>
            </View>

            {/* Calificación (si existe) */}
            {asistencia.calificacion && (
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Calificación:</Text>
                    <Text style={styles.value}>
                        {'⭐'.repeat(asistencia.calificacion)}
                    </Text>
                </View>
            )}

            {/* Comentario (si existe) */}
            {asistencia.comentario && (
                <View style={styles.comentarioContainer}>
                    <Text style={styles.label}>Comentario:</Text>
                    <Text style={styles.comentario}>{asistencia.comentario}</Text>
                </View>
            )}

            {/* Botón de calificar (solo si no tiene calificación y hay navegación) */}
            {!asistencia.calificacion && navigation && (
                <TouchableOpacity
                    style={styles.calificarButton}
                    onPress={() => navigation.navigate('Calificar', { asistencia })}
                >
                    <Ionicons name="star-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.calificarButtonText}>Calificar</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Sombra en Android
    },
    fecha: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 8,
    },
    clase: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    label: {
        fontSize: 14,
        color: '#6B7280',
        marginRight: 8,
        fontWeight: '500',
    },
    value: {
        fontSize: 14,
        color: '#1F2937',
    },
    comentarioContainer: {
        marginTop: 8,
        marginBottom: 4,
    },
    comentario: {
        fontSize: 14,
        color: '#1F2937',
        fontStyle: 'italic',
        marginTop: 4,
    },
    calificarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2563EB',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginTop: 12,
    },
    calificarButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
});

export default AsistenciaCard;

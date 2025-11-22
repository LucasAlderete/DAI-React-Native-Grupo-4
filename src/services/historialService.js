import api from './api';

/**
 * Obtiene el historial de asistencias con filtros opcionales y paginación
 *
 * @param {Object} filtros - Objeto con los filtros y paginación
 * @param {string} filtros.fechaInicio - Fecha de inicio en formato ISO (YYYY-MM-DDTHH:mm:ss) - OPCIONAL
 * @param {string} filtros.fechaFin - Fecha de fin en formato ISO (YYYY-MM-DDTHH:mm:ss) - OPCIONAL
 * @param {number} filtros.page - Número de página (base 0) - Por defecto: 0
 * @param {number} filtros.size - Cantidad de elementos por página - Por defecto: 20
 *
 * @returns {Promise} - Promesa que resuelve con la respuesta del backend
 *
 * Ejemplo de respuesta del backend (Page<AsistenciaDto>):
 * {
 *   content: [ { id, fechaHora, clase: {...}, sede: {...}, duracion } ],
 *   pageable: {...},
 *   totalPages: 5,
 *   totalElements: 100,
 *   last: false,
 *   number: 0,
 *   size: 20,
 *   first: true
 * }
 */



export const getHistorialAsistencias = async (filtros = {}) => {
    try {
        const params = {}
        params.page = filtros.page !== undefined ? filtros.page : 0;
        params.size = filtros.size !== undefined ? filtros.size : 20;
        if (filtros.fechaInicio) params.fechaInicio = filtros.fechaInicio;
        if (filtros.fechaFin) params.fechaFin = filtros.fechaFin;
        const response = await api.get('/asistencias/historial', { params });
        return response.data;
    } catch (error) {
        console.error('Error al obtener el historial de asistencias:', error);
        throw error;
    }
};
/**
 * Convierte Date de JavaScript al formato del backend: YYYY-MM-DDTHH:mm:ss
 * Ejemplo: new Date('2024-01-15') → "2024-01-15T00:00:00"
 */
export const formatDateForBackend = (date) => {
    if (!date) return null;
    // toISOString() retorna "2024-01-15T10:30:00.000Z"
    // slice(0, 19) quita los milisegundos y la 'Z' → "2024-01-15T10:30:00"
    return date.toISOString().slice(0, 19);
  };
import api from './api';

/**
 * Obtiene las asistencias que pueden ser calificadas
 * (dentro de las 24 horas posteriores al check-in y sin calificación previa)
 * 
 * @param {Object} filtros - Objeto con los filtros de paginación
 * @param {number} filtros.page - Número de página (base 0) - Por defecto: 0
 * @param {number} filtros.size - Cantidad de elementos por página - Por defecto: 10
 * 
 * @returns {Promise} - Promesa que resuelve con la respuesta del backend
 */
export const getAsistenciasCalificables = async (filtros = {}) => {
    try {
        const params = {};
        params.page = filtros.page !== undefined ? filtros.page : 0;
        params.size = filtros.size !== undefined ? filtros.size : 10;
        
        const response = await api.get('/asistencias/calificables', { params });
        return response.data;
    } catch (error) {
        console.error('Error al obtener asistencias calificables:', error);
        throw error;
    }
};

/**
 * Califica una asistencia con estrellas (1-5) y un comentario opcional
 * 
 * @param {number} asistenciaId - ID de la asistencia a calificar
 * @param {Object} calificacionData - Datos de la calificación
 * @param {number} calificacionData.calificacion - Calificación de 1 a 5 estrellas
 * @param {string} [calificacionData.comentario] - Comentario opcional (máximo 500 caracteres)
 * 
 * @returns {Promise} - Promesa que resuelve con la respuesta del backend
 */
export const calificarAsistencia = async (asistenciaId, calificacionData) => {
    try {
        const { calificacion, comentario } = calificacionData;
        
        const body = {
            calificacion: calificacion
        };
        
        // Solo agregar comentario si existe y no está vacío
        if (comentario && comentario.trim().length > 0) {
            body.comentario = comentario.trim();
        }
        
        const response = await api.post(`/asistencias/${asistenciaId}/calificar`, body);
        return response.data;
    } catch (error) {
        console.error('Error al calificar asistencia:', error);
        throw error;
    }
};


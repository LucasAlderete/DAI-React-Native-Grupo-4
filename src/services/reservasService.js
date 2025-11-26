import api from './api';

/**
 * Servicio para gestionar las reservas
 */
const reservasService = {
  /**
   * Obtiene todas las reservas del usuario autenticado
   * @param {number} page - Número de página (opcional)
   * @param {number} size - Tamaño de página (opcional)
   * @returns {Promise} Promesa con la lista de reservas
   */
  getMisReservas: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/reservas?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      throw error;
    }
  },

  /**
   * Obtiene las próximas reservas confirmadas del usuario
   * @returns {Promise} Promesa con las próximas reservas
   */
  getProximasReservas: async () => {
    try {
      const response = await api.get('/reservas/proximas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener próximas reservas:', error);
      throw error;
    }
  },

  /**
   * Crea una nueva reserva para una clase
   * @param {number} claseId - ID de la clase a reservar
   * @returns {Promise} Promesa con los datos de la reserva creada
   */
  crearReserva: async (claseId) => {
    try {
      const response = await api.post('/reservas', { claseId });
      return response.data;
    } catch (error) {
      console.error('Error al crear reserva:', error);
      throw error;
    }
  },

  /**
   * Cancela (elimina) una reserva existente
   * @param {number} reservaId - ID de la reserva a cancelar
   * @returns {Promise} Promesa con la confirmación de cancelación
   */
  cancelarReserva: async (reservaId) => {
    try {
      const response = await api.delete(`/reservas/${reservaId}`);
      return response.data;
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      throw error;
    }
  },

  /**
   * Obtiene el detalle de una reserva específica
   * @param {number} reservaId - ID de la reserva
   * @returns {Promise} Promesa con los detalles de la reserva
   */
  getReservaById: async (reservaId) => {
    try {
      const response = await api.get(`/reservas/${reservaId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener detalle de reserva:', error);
      throw error;
    }
  },
};

export default reservasService;


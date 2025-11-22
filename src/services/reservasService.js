import api from './api';
import { Logger } from '../utils/Logger';

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
    Logger.info("reservasService", `GET /reservas?page=${page}&size=${size}`);
    try {
      const response = await api.get(`/reservas?page=${page}&size=${size}`);
      Logger.success("reservasService", "✅ Reservas obtenidas:", response.status, response.data);
      return response.data;
    } catch (error) {
      Logger.error("reservasService", error, "Error al obtener reservas");
      throw error;
    }
  },

  /**
   * Obtiene las próximas reservas confirmadas del usuario
   * @returns {Promise} Promesa con las próximas reservas
   */
  getProximasReservas: async () => {
    Logger.info("reservasService", "GET /reservas/proximas");
    try {
      const response = await api.get('/reservas/proximas');
      Logger.success("reservasService", "✅ Próximas reservas:", response.status, response.data);
      return response.data;
    } catch (error) {
      Logger.error("reservasService", error, "Error al obtener próximas reservas");
      throw error;
    }
  },

  /**
   * Crea una nueva reserva para una clase
   * @param {number} claseId - ID de la clase a reservar
   * @returns {Promise} Promesa con los datos de la reserva creada
   */
  crearReserva: async (claseId) => {
    Logger.info("reservasService", `POST /reservas`, { claseId });
    try {
      const response = await api.post('/reservas', { claseId });
      Logger.success("reservasService", "✅ Reserva creada:", response.status, response.data);
      return response.data;
    } catch (error) {
      Logger.error("reservasService", error, "Error al crear reserva");
      throw error;
    }
  },

  /**
   * Cancela (elimina) una reserva existente
   * @param {number} reservaId - ID de la reserva a cancelar
   * @returns {Promise} Promesa con la confirmación de cancelación
   */
  cancelarReserva: async (reservaId) => {
    Logger.info("reservasService", `DELETE /reservas/${reservaId}`);
    try {
      const response = await api.delete(`/reservas/${reservaId}`);
      Logger.success("reservasService", "✅ Reserva cancelada:", response.status, response.data);
      return response.data;
    } catch (error) {
      Logger.error("reservasService", error, "Error al cancelar reserva");
      throw error;
    }
  },

  /**
   * Obtiene el detalle de una reserva específica
   * @param {number} reservaId - ID de la reserva
   * @returns {Promise} Promesa con los detalles de la reserva
   */
  getReservaById: async (reservaId) => {
    Logger.info("reservasService", `GET /reservas/${reservaId}`);
    try {
      const response = await api.get(`/reservas/${reservaId}`);
      Logger.success("reservasService", "✅ Detalle de reserva obtenido:", response.status, response.data);
      return response.data;
    } catch (error) {
      Logger.error("reservasService", error, "Error al obtener detalle de reserva");
      throw error;
    }
  },

  /**
   * Obtiene la reserva activa del usuario autenticado para una clase específica
   * @param {number} claseId - ID de la clase
   * @returns {Promise} Promesa con los datos de la reserva activa
   */
  getReservaPorClase: async (claseId) => {
    Logger.info("reservasService", `GET /reservas/clase/${claseId}`);
    try {
      const response = await api.get(`/reservas/clase/${claseId}`);
      Logger.success("reservasService", "✅ Reserva obtenida por clase:", response.status, response.data);
      return response.data;
    } catch (error) {
      Logger.error("reservasService", error, "Error al obtener reserva por clase");
      throw error;
    }
  },
};

export default reservasService;

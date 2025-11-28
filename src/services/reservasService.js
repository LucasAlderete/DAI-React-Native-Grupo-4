import api from './api';

const reservasService = {
  getMisReservas: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/reservas?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      throw error;
    }
  },

  getProximasReservas: async () => {
    try {
      const response = await api.get('/reservas/proximas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener próximas reservas:', error);
      throw error;
    }
  },

  crearReserva: async (claseId) => {
    try {
      const response = await api.post('/reservas', { claseId });
      return response.data;
    } catch (error) {
      console.error('Error al crear reserva:', error);
      throw error;
    }
  },

  cancelarReserva: async (reservaId) => {
    try {
      const response = await api.delete(`/reservas/${reservaId}`);
      return response.data;
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      throw error;
    }
  },

  getReservaById: async (reservaId) => {
    try {
      const response = await api.get(`/reservas/${reservaId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener detalle de reserva:', error);
      throw error;
    }
  },

  getReservasByUser: async (userId) => {
    try {
      return await api.get(`/reservas/usuario/${userId}`);
    } catch (error) {
      console.error("Error getReservasByUser:", error);
      throw error;
    }
  },

  getReservaByClase: async (claseId) => {
    try {
      const response = await api.get(`/reservas/clase/${claseId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener reserva por clase:", error);
      throw error;
    }
  },
};

export async function getReservaUsuarioClase(userId, claseId) {
  try {
    const response = await api.get(`/reservas/clase/${claseId}`);
    return response.data;
  } catch (error) {
    console.error("Error getReservaUsuarioClase:", error);
    throw error;
  }
}

export default reservasService;

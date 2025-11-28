import api from './api';

const reservasService = {
  getMisReservas: async (page = 0, size = 10) => {
    const response = await api.get(`/reservas?page=${page}&size=${size}`);
    return response.data;
  },

  getProximasReservas: async () => {
    const response = await api.get('/reservas/proximas');
    return response.data;
  },

  crearReserva: async (claseId) => {
    const response = await api.post('/reservas', { claseId });
    return response.data;
  },

  cancelarReserva: async (reservaId) => {
    const response = await api.delete(`/reservas/${reservaId}`);
    return response.data;
  },

  getReservaById: async (reservaId) => {
    const response = await api.get(`/reservas/${reservaId}`);
    return response.data;
  },

  getReservasByUser: async (userId) => {
    return await api.get(`/reservas/usuario/${userId}`);
  },

  getReservaByClase: async (claseId) => {
    const response = await api.get(`/reservas/clase/${claseId}`);
    return response.data;
  },
};

export async function getReservaUsuarioClase(userId, claseId) {
  const response = await api.get(`/reservas/clase/${claseId}`);
  return response.data;
}

export default reservasService;

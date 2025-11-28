import api from './api';

export const apiService = {
  login: (data) => api.post('auth/login', data),

  sendOtpWithoutPassword: (data) => api.post('auth/enviar-otp', data),

  verifyOtp: (data) => api.post('auth/verificar-codigo', data),

  registerUsuario: (data) => api.post('auth/register', data),

  resendOtp: (data) => api.post('auth/reenviar-codigo', data),

  validateToken: (token) =>
    api.get('auth/validate', {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getNotifications: (usuarioId) =>
    api.get(`notificaciones/pending/${usuarioId}`),

  generateNotifications: () =>
    api.post(`notificaciones/generar`),

  getClaseById: (claseId) =>
    api.get(`clases/${claseId}`),

  updateClase: (claseId, data) =>
    api.put(`clases/${claseId}`, data),

  savePushToken: (data) =>
    api.post('usuarios/save-token', data),

  getReservasByUser: (userId) =>
    api.get(`/reservas/usuario/${userId}`),

  getReservaUsuarioClase: (claseId) =>
    api.get(`reservas/clase/${claseId}`),

};

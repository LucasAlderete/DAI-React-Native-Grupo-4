// apiService.js
import api from './api';

export const apiService = {
  // LOGIN
  login: (data) => api.post('auth/login', data),

  // Enviar OTP sin contraseña
  sendOtpWithoutPassword: (data) => api.post('auth/enviar-otp', data),

  // Verificar código
  verifyOtp: (data) => api.post('auth/verificar-codigo', data),

  // Reenviar OTP
  resendOtp: (data) => api.post('auth/reenviar-codigo', data),

  // Validar token
  validateToken: (token) =>
    api.get('auth/validate', {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // 🔔 Obtener notificaciones pendientes (tu endpoint real)
  getNotifications: (usuarioId) =>
    api.get(`notificaciones/pending/${usuarioId}`),

  // 🔥 Generar notificaciones manualmente
  generateNotifications: () =>
    api.post(`notificaciones/generar`),

  // 📌 Obtener clase por ID (FUNCIONA con tu backend actual)
  getClaseById: (claseId) =>
    api.get(`clases/${claseId}`),

  // ♻ Actualizar clase
  updateClase: (claseId, data) =>
    api.put(`clases/${claseId}`, data),

  savePushToken: (data) =>
   api.post('usuarios/save-token', data),

};

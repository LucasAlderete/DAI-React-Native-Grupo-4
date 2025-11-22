import api from './api';

export const apiService = {
  // Login
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

  // LOGIN / REGISTER 2.0
  loginUsuario: (data) => api.post('usuario/login', data),
  registerUsuario: (data) => api.post('usuario/register', data),

};

import { apiService } from './apiService';
import { tokenStorage } from './tokenStorage';
import API_CONFIG from '../config/apiConfig';

const listeners = new Set();
export const authEvents = {
  subscribe: (callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
  emit: (data) => {
    listeners.forEach((cb) => cb(data));
  },
};

const API_HOST = API_CONFIG.HOST;

export const authService = {
  async login(email, password) {
    try {
      const { data } = await apiService.login({ email, password });

      if (!data) throw new Error('Respuesta vacía del servidor');
      if (data.mensaje && !data.token && !data.requiereCodigo) {
        throw new Error(data.mensaje);
      }

      if (data.token) {
        await tokenStorage.saveToken(data.token);
        authEvents.emit({ type: 'login', user: data });
      }

      return data;
    } catch (err) {
      throw err;
    }
  },

  async verifyOtp(email, code) {
    try {
      const { data } = await apiService.verifyOtp({ email, codigo: code });

      if (data?.token) {
        await tokenStorage.saveToken(data.token);
        authEvents.emit({ type: 'login', user: data });
      }

      return data;
    } catch (err) {
      throw err;
    }
  },

  async resendOtp(email) {
    const url = "http://192.168.0.93:8080/api/auth/enviar-otp";

    console.log("Enviando OTP a:", url);

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await resp.json();
    return data;
  },

  async register(nombre, email, password) {
    try {
      const res = await apiService.registerUsuario({ nombre, email, password });
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  async validateToken() {
    const token = await tokenStorage.getToken();
    if (!token) return null;

    try {
      const { data } = await apiService.validateToken(token);
      return data;
    } catch (err) {
      await tokenStorage.clearToken();
      authEvents.emit({ type: 'logout' });
      return null;
    }
  },

  async logout() {
    await tokenStorage.clearToken();
    authEvents.emit({ type: 'logout' });
  },
};

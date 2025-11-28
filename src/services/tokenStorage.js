import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';
const LOCAL_NOTIF_KEY = 'local_notifications';

export const tokenStorage = {
  async saveToken(token) {
    try { await AsyncStorage.setItem(TOKEN_KEY, token); }
    catch (e) { console.log('Error guardando token:', e); }
  },

  async getToken() {
    try { return await AsyncStorage.getItem(TOKEN_KEY); }
    catch (e) { console.log('Error obteniendo token:', e); return null; }
  },

  async clearToken() {
    try { await AsyncStorage.removeItem(TOKEN_KEY); }
    catch (e) { console.log('Error limpiando token:', e); }
  },

  async hasToken() {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return !!token;
  },

  async saveUser(user) {
    try { await AsyncStorage.setItem(USER_KEY, JSON.stringify(user)); }
    catch (e) { console.log("Error guardando usuario:", e); }
  },

  async getUser() {
    try {
      const raw = await AsyncStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.log("Error obteniendo usuario:", e);
      return null;
    }
  },

  async clearUser() {
    try { await AsyncStorage.removeItem(USER_KEY); }
    catch (e) { console.log("Error borrando usuario:", e); }
  },

  // ⬅⬅ AGREGADO: Guardar notificaciones locales
  async saveLocalNotifications(list) {
    try {
      await AsyncStorage.setItem(LOCAL_NOTIF_KEY, JSON.stringify(list));
    } catch (err) {
      console.log("Error guardando notificaciones locales:", err);
    }
  },

  async getLocalNotifications() {
    try {
      const raw = await AsyncStorage.getItem(LOCAL_NOTIF_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.log("Error obteniendo notificaciones locales:", err);
      return [];
    }
  }
};

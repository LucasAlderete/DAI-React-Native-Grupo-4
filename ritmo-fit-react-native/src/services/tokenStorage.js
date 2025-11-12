import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';

export const tokenStorage = {
  async saveToken(token) {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.log('Error guardando token:', e);
    }
  },

  async getToken() {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (e) {
      console.log('Error obteniendo token:', e);
      return null;
    }
  },

  async clearToken() {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.log('Error limpiando token:', e);
    }
  },

  async hasToken() {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return !!token;
  },
};

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { apiService } from './apiService';   // 👉 SE USA para enviar token al backend

// (SE QUITA setNotificationHandler de aquí para evitar sobreescrituras)
// El handler único y correcto debe estar en App.js.

// registerForPushNotificationsAsync: solicita permisos, obtiene token y lo guarda en backend
export async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('❌ Permiso de notificaciones denegado');
      return null;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("🔑 PUSH TOKEN OBTENIDO:", token);

    // 👉 Enviar token al backend (guardar en tabla Usuario)
    try {
      await apiService.savePushToken({ token });
      console.log("📡 Token enviado al backend");
    } catch (err) {
      console.log("❌ Error al enviar token al backend:", err);
    }

  } else {
    console.log('⚠ Las notificaciones solo funcionan en dispositivos');
    return null;
  }

  // Configurar canal Android (si no existe ya)
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        // Puedes agregar sound, vibrationPattern, etc. si querés.
      });
    } catch (err) {
      console.log('❌ Error creando canal Android:', err);
    }
  }

  return token;
}

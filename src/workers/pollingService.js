import { apiService } from "../services/apiService";
import { tokenStorage } from "../services/tokenStorage";
import * as Notifications from 'expo-notifications';

let intervalId = null;

const showPushNotification = async (mensaje, claseId) => {
  try {
    console.log("📩 Notificación recibida desde backend:", mensaje, "clase:", claseId);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Actualización de clase",
        body: mensaje,
        data: { claseId },
      },
      trigger: null,
    });

  } catch (e) {
    console.log("❌ Error al manejar notificación:", e);
  }
};

export const startPolling = () => {
  if (intervalId) return;

  const poll = async () => {
    const user = await tokenStorage.getUser();
    const usuarioId = user?.id;
    if (!usuarioId) return;

    try {
      const res = await apiService.getNotifications(usuarioId);
      const list = res.data;

      if (Array.isArray(list) && list.length > 0) {
        for (const notif of list) {
          await showPushNotification(notif.mensaje, notif.claseId);
        }
        await tokenStorage.saveLocalNotifications(list);
      }
    } catch (e) {
      console.log("❌ Error backend:", e);
    }
  };

  poll();
  intervalId = setInterval(poll, 15000);
};

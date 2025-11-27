import { apiService } from "../services/apiService";
import { tokenStorage } from "../services/tokenStorage";
import * as Notifications from "expo-notifications";
import { navigateToClaseDetail } from "../navigation/RootNavigation";
import reservasService from "../services/reservasService";

let intervalId = null;
const sentNotificationIds = new Set();

Notifications.addNotificationResponseReceivedListener(async (response) => {
  const data = response.notification.request.content.data;
  const claseId = data?.claseId;

  if (!claseId) return;

  const reservas = await reservasService.getProximasReservas();
  const reserva = reservas?.find((r) => r.claseId === claseId) || null;

  navigateToClaseDetail(claseId, reserva);
});

const showPushNotification = async (notif) => {
  console.log("📨 [PROCESS] Notificación recibida:", notif);

  if (sentNotificationIds.has(notif.id)) {
    return;
  }

  sentNotificationIds.add(notif.id);

  await Notifications.scheduleNotificationAsync({
    content: {
      title:
        notif.tipo === "RECORDATORIO"
          ? "⏰ Recordatorio de clase"
          : "⚠ Actualización de clase",
      body: notif.mensaje,
      data: {
        claseId: notif.claseId,
        reserva: notif.reserva || null,
      },
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null,
  });
};

export const startPolling = async (userId = null) => {

  if (intervalId) {
    return;
  }
  let finalUserId = userId;
  if (!finalUserId) {
    const user = await tokenStorage.getUser();
    finalUserId = user?.id || null;
  }

  if (!finalUserId) {
    return;
  }


  const poll = async () => {

    try {
      await apiService.generateNotifications();

      const res = await apiService.getNotifications(finalUserId);
      const list = res.data;


      if (Array.isArray(list)) {
        for (const notif of list) {
          await showPushNotification(notif);
        }

        await tokenStorage.saveLocalNotifications(list);
      }
    } catch (e) {
    }
  };

  poll();
  intervalId = setInterval(poll, 15000);
};

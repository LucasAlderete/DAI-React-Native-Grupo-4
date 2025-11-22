// src/services/notificationService.js
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as RootNavigation from "../navigation/RootNavigation";
// 👆 asegúrate de tener este helper para navegar fuera de un componente

/**
 * Configuración general del comportamiento de las notificaciones.
 * Solo banners del sistema (no modales).
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,  // ✅ banner arriba, no modal
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Listener global para manejar el toque en una notificación.
 * Lleva siempre al detalle de la reserva (por claseId).
 */
Notifications.addNotificationResponseReceivedListener((response) => {
  const claseId = response?.notification?.request?.content?.data?.claseId;
  if (claseId) {
    console.log("📲 Usuario tocó notificación — claseId:", claseId);
    // 👇 Redirige al detalle de la reserva (ajustá el nombre del screen si difiere)
    RootNavigation.navigate("DetalleReserva", { claseId });
  }
});

/**
 * Solicita permisos y configura el canal Android.
 */
export async function requestNotificationPermission() {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("🚫 Permiso de notificaciones denegado");
      return;
    }

    console.log("✅ Permiso de notificaciones concedido");

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  } catch (error) {
    console.error("Error al solicitar permisos:", error);
  }
}

/**
 * Notificación inmediata al confirmar una reserva.
 */
export async function notifyReservationCreated(clase) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "✅ Reserva confirmada",
        body: `Te has anotado en "${clase.nombre}" correctamente.`,
        data: { claseId: clase.id },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: { seconds: 5 },
    });
    console.log("📩 Notificación de creación enviada");
  } catch (error) {
    console.error("Error al enviar notificación de creación:", error);
  }
}

/**
 * Programa un recordatorio 1 hora antes del inicio de la clase.
 */
export async function scheduleClassReminder(clase) {
  try {
    const fechaClase = new Date(clase.fechaInicio);
    const fechaRecordatorio = new Date(fechaClase.getTime() - 60 * 60 * 1000);
    const ahora = new Date();

    if (fechaRecordatorio <= ahora) {
      console.log("⚠️ Clase muy próxima, no se agenda recordatorio");
      return;
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Recordatorio de clase",
        body: `Tu clase "${clase.nombre}" comienza en 1 hora.`,
        data: { claseId: clase.id },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: { type: "date", date: fechaRecordatorio },
    });

    console.log("✅ Recordatorio agendado con ID:", id);
  } catch (error) {
    console.error("❌ Error al agendar recordatorio:", error);
  }
}

/**
 * Notificación cuando una reserva se actualiza.
 */
export async function notifyReservationUpdated(clase) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔄 Reserva actualizada",
        body: `Tu clase "${clase.nombre}" ha sido modificada.`,
        data: { claseId: clase.id },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null,
    });

    console.log("📩 Notificación de modificación enviada");
  } catch (error) {
    console.error("Error al enviar notificación de modificación:", error);
  }
}

/**
 * Cancela todas las notificaciones pendientes.
 */
export async function cancelAllReminders() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("🔕 Todos los recordatorios cancelados");
  } catch (error) {
    console.error("Error al cancelar recordatorios:", error);
  }
}

/**
 * Cancela una notificación específica por ID.
 */
export async function cancelReminderById(id) {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
    console.log("🔕 Recordatorio cancelado:", id);
  } catch (error) {
    console.error("Error al cancelar recordatorio:", error);
  }
}

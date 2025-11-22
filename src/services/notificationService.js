import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Configuración general
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Solicita permisos de notificación
 */
export async function requestNotificationPermission() {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("❌ Permiso de notificaciones denegado");
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
    console.error("⚠️ Error al solicitar permisos:", error);
  }
}

/**
 * Notificación inmediata de prueba (caso 1)
 */
export async function notifyReservationCreated(clase) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "✅ Reserva confirmada",
        body: `Te has anotado en "${clase.nombre}" correctamente.`,
        data: { claseId: clase.id },
      },
      trigger: { seconds: 5 }, // 🔹 Modo test: llega en 5s
    });
    console.log("📩 Notificación de reserva creada enviada");
  } catch (error) {
    console.error("❌ Error al enviar notificación de creación:", error);
  }
}

/**
 * Recordatorio 1 hora antes de la clase (caso 2)
 */
export async function scheduleClassReminder(clase) {
  try {
    if (!clase?.fechaInicio) {
      console.warn("⏰ No se pudo programar recordatorio: sin fechaInicio");
      return;
    }
    const fechaClase = new Date(clase.fechaInicio);
    const fechaRecordatorio = new Date(fechaClase.getTime() - 60 * 60 * 1000);
    const ahora = new Date();

    if (fechaRecordatorio <= ahora) {
      console.log("⚠️ Clase muy próxima, no se agenda recordatorio");
      return;
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "🏋️‍♂️ Recordatorio de Clase",
        body: `Tu clase "${clase.nombre}" comienza a las ${fechaClase.toLocaleTimeString(
          "es-AR",
          { hour: "2-digit", minute: "2-digit" }
        )}. ¡No llegues tarde!`,
        data: { claseId: clase.id },
      },
      trigger: fechaRecordatorio,
    });

    console.log("✅ Recordatorio agendado:", id, "para", fechaRecordatorio);
  } catch (error) {
    console.error("❌ Error al agendar recordatorio:", error);
  }
}

/**
 * Notificación de actualización de reserva (caso 3)
 */
export async function notifyReservationUpdated(clase) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔄 Reserva actualizada",
        body: `Tu clase "${clase.nombre}" ha sido modificada.`,
        data: { claseId: clase.id },
      },
      trigger: null,
    });
    console.log("📩 Notificación de modificación enviada");
  } catch (error) {
    console.error("❌ Error al enviar notificación de modificación:", error);
  }
}

/**
 * Cancela todas las notificaciones pendientes
 */
export async function cancelAllReminders() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("🔕 Recordatorios cancelados");
  } catch (error) {
    console.error("❌ Error al cancelar recordatorios:", error);
  }
}

/**
 * Cancela un recordatorio por ID
 */
export async function cancelReminderById(id) {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
    console.log("🔕 Recordatorio cancelado:", id);
  } catch (error) {
    console.error("❌ Error al cancelar recordatorio:", error);
  }
}

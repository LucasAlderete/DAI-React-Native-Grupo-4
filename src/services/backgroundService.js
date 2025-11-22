// src/services/backgroundService.js

import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import "../components/notificationTask"; // importa la task, NO generar ciclos

const BG_TASK_NAME = "background-refresh-task";

TaskManager.defineTask(BG_TASK_NAME, async () => {
  console.log("[TASK] Ejecutando background-refresh-task...");
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

export async function initBackgroundTasks() {
  try {
    console.log("[INIT] Registrando tareas de background...");

    await BackgroundFetch.registerTaskAsync(BG_TASK_NAME, {
      minimumInterval: 60 * 15,
      stopOnTerminate: false,
      startOnBoot: true,
    });

    await BackgroundFetch.registerTaskAsync("background-notification-task", {
      minimumInterval: 60 * 15,
      stopOnTerminate: false,
      startOnBoot: true,
    });

    const status = await BackgroundFetch.getStatusAsync();
    console.log("[INIT] Background status:", status);

  } catch (e) {
    console.log("[INIT] Error al registrar tasks:", e);
  }
}

initBackgroundTasks().catch(console.log);

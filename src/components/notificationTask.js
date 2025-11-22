// src/tasks/notificationTask.js

import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import * as BackgroundFetch from "expo-background-fetch";

const API_URL =
  "http://localhost:8080/api/notifications/pending?userId=1";

TaskManager.defineTask("background-notification-task", async () => {
  try {
    console.log("[TASK-NOTIF] Ejecutando background-notification-task...");

    const resp = await fetch(API_URL);
    const data = await resp.json();

    if (data.shouldSendNotification) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: data.title,
          body: data.body,
          data: { reservationId: 1 },
        },
        trigger: null,
      });
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;

  } catch (err) {
    console.log("[TASK-NOTIF] Error:", err);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

import React from "react";
import * as Notifications from "expo-notifications";
import { ThemeProvider } from "./src/context/ThemeContext";
import { NotificationProvider } from "./src/context/NotificationContext";
import { registerForPushNotificationsAsync } from "./src/services/notificationsService";
import { apiService } from "./src/services/apiService";

import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./src/navigation/RootNavigator";
import { navigationRef } from "./src/navigation/RootNavigation";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowAlert: false,
  }),
});

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppContainer />
      </NotificationProvider>
    </ThemeProvider>
  );
}

function AppContainer() {
  React.useEffect(() => {
    registerForPushNotificationsAsync();
    apiService.generateNotifications().catch(() => {});
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

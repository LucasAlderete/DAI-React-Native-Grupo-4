import React, { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';

import { ThemeProvider } from './src/context/ThemeContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { startPolling } from './src/workers/pollingService';
import { registerForPushNotificationsAsync } from './src/services/notificationsService';

import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';

let navigationRefGlobal = null;
export function setNavigationRef(ref) {
  navigationRefGlobal = ref;
}

// 🔔 Handler actualizado y único en la app:
// - mostrar BANNER en foreground
// - guardar en la lista/centro de notificaciones
// - NO mostrar alert/modal (shouldShowAlert: false)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,   // muestra banner arriba unos segundos
    shouldShowList: true,     // queda guardada en bandeja/centro de notificaciones
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowAlert: false,   // IMPORTANT: evita el "aviso" modal
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
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync();

    // Cuando el usuario toca la notificación
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("👉 Usuario TOCÓ notificación:", response);
      const claseId = response?.notification?.request?.content?.data?.claseId;
      if (claseId && navigationRefGlobal) {
        navigationRefGlobal.navigate("ClaseDetail", { claseId });
      }
    });

    // Iniciar polling
    startPolling();

    return () => {
      responseListener.current?.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={setNavigationRef}>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

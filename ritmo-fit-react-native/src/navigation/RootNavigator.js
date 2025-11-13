import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { authService, authEvents } from '../services/authService';

// Pantallas de autenticación
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import VerifyCodeScreen from '../screens/auth/VerifyCodeScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import BiometricUnlockScreen from '../screens/auth/BiometricUnlockScreen';

// Navegación principal
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [hasTokenFromStartup, setHasTokenFromStartup] = useState(false);

  useEffect(() => {
    const init = async () => {
      const user = await authService.validateToken();

      if (user) {
        setAuthenticated(true);
        setHasTokenFromStartup(true);
      } else {
        setAuthenticated(false);
        setHasTokenFromStartup(false);
      }

      setLoading(false);
    };

    init();

    const unsubscribe = authEvents.subscribe((event) => {
      if (event.type === 'login') {
        setAuthenticated(true);
        setHasTokenFromStartup(false);
      }
      if (event.type === 'logout') {
        setAuthenticated(false);
        setHasTokenFromStartup(false);
      }
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Verificando sesión...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {authenticated ? (
        hasTokenFromStartup ? (
          <>
            <Stack.Screen name="BiometricUnlock" component={BiometricUnlockScreen} />
            <Stack.Screen name="MainTabs" component={TabNavigator} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
          </>
        )
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

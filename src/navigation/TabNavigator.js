import React, { useContext } from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Pantallas principales
import HomeScreen from "../components/Main/HomeScreen";
import ProfileScreen from "../components/Profile/ProfileScreen";
import MisReservasScreen from "../components/Reservas/MisReservasScreen";

// Componentes de navegación
import ClasesList from "../components/ClasesList";
import ClaseDetail from "../components/ClaseDetail";
import DetalleReservaScreen from "../components/Reservas/DetalleReservaScreen";
import CrearReservaScreen from "../components/Reservas/CrearReservaScreen";
import HistorialScreen from "../components/Historial/HistorialScreen";
import CalificarScreen from "../components/Historial/CalificarScreen";

// Pantallas de Check-in
import QRScannerScreen from "../components/Checkin/QRScannerScreen";
import CheckinSuccessScreen from "../components/Checkin/CheckinSuccessScreen";

// Tema
import { ThemeContext } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClasesList"
        component={ClasesList}
        options={{ title: "Clases Disponibles" }}
      />
      <Stack.Screen
        name="ClaseDetail"
        component={ClaseDetail}
        options={{ title: "Detalle de Clase" }}
      />
      <Stack.Screen
        name="Historial"
        component={HistorialScreen}
        options={{ 
          title: "Historial de Asistencias",
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#2563EB',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

const ReservasStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MisReservasMain"
        component={MisReservasScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetalleReserva"
        component={DetalleReservaScreen}
        options={{ 
          title: "Detalle de Reserva",
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#2563EB',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="CrearReserva"
        component={CrearReservaScreen}
        options={{ 
          title: "Reservar Clase",
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#2563EB',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

const CheckinStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="QRScanner"
        component={QRScannerScreen}
        options={{
          title: "Escanear QR",
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#2563EB',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="CheckinSuccess"
        component={CheckinSuccessScreen}
        options={{
          title: "Check-in Exitoso",
          headerShown: true,
          headerLeft: null, // Evita que el usuario vuelva atrás
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#2563EB',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

const HistorialStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HistorialMain"
        component={HistorialScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Calificar"
        component={CalificarScreen}
        options={{
          title: "Calificar Clase",
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#2563EB',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  const { theme } = useContext(ThemeContext);
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#6B7280",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          paddingBottom: Math.max(insets.bottom, 5) + 5,
          paddingTop: 5,
          height: 60 + Math.max(insets.bottom, 5),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ 
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size || 24} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Reservas"
        component={ReservasStack}
        options={{
          tabBarLabel: "Reservas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size || 24} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Checkin"
        component={CheckinStack}
        options={{
          tabBarLabel: "Escanear",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="qr-code" size={size || 24} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Historial"
        component={HistorialStack}
        options={{
          tabBarLabel: "Historial",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size || 24} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="MiPerfil"
        component={ProfileScreen}
        options={{ 
          tabBarLabel: "Mi Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size || 24} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

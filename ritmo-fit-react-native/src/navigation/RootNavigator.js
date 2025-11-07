import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ClasesList from '../components/ClasesList';
import ClaseDetail from '../components/ClaseDetail';

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#E63F34',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="ClasesList" 
        component={ClasesList}
        options={{ 
          title: 'Clases',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#000000',
          headerLeft: () => null,
        }}
      />
      <Stack.Screen 
        name="ClaseDetail" 
        component={ClaseDetail}
        options={{ 
          title: 'Detalle',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#000000',
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;

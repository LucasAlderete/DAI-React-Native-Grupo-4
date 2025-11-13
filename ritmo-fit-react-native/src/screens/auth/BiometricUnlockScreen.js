import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect } from 'react';
import { View, Button, Alert } from 'react-native';

export default function BiometricUnlockScreen({ navigation }) {
  useEffect(() => {
    (async () => {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticarse con biometría',
      });
      if (result.success) {
        Alert.alert('Autenticación exitosa');
        navigation.replace('MainTabs');
      } else {
        Alert.alert('Falló la autenticación');
      }
    })();
  }, []);

 return (
   <View style={{
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#f5f5f5',
     padding: 20
   }}>
     <Button title="Usar contraseña" onPress={() => navigation.navigate('Login')} />
   </View>
 );

}

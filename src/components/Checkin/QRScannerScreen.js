import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, LogBox } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import checkinService from '../../services/checkinService';

// Ignorar warnings de errores de red en desarrollo (ya manejamos los errores con Alert)
LogBox.ignoreLogs(['Error al realizar check-in']);

export default function QRScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  // Solicitar permisos de cámara si no están concedidos
  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  // Resetear estado cuando la pantalla gana foco (vuelves de CheckinSuccess)
  useFocusEffect(
    React.useCallback(() => {
      setScanned(false);
      setLoading(false);
    }, [])
  );

  // Manejar el escaneo del QR
  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || loading) return; // Evitar escaneos múltiples

    setScanned(true);
    setLoading(true);

    try {
      // Parsear el contenido del QR
      const qrData = JSON.parse(data);
      console.log('QR escaneado:', qrData);

      // Validar que el QR contenga claseId
      if (!qrData.claseId) {
        Alert.alert(
          'QR Inválido',
          'El código escaneado no contiene información de clase.',
          [{ text: 'Reintentar', onPress: () => { setScanned(false); setLoading(false); } }]
        );
        return;
      }

      // Realizar check-in
      const response = await checkinService.realizarCheckin(qrData.claseId);

      // El backend devuelve directamente el objeto AsistenciaDto cuando es exitoso
      // Si tiene 'id' o 'clase', es una respuesta exitosa
      if (response && (response.id || response.clase)) {
        // Navegar a pantalla de éxito con los datos
        navigation.navigate('CheckinSuccess', { asistencia: response });
      } else {
        Alert.alert(
          'Error',
          response?.mensaje || 'No se pudo realizar el check-in',
          [{ text: 'Reintentar', onPress: () => { setScanned(false); setLoading(false); } }]
        );
      }
    } catch (error) {
      // Manejar errores
      let errorMessage = 'Error de conexión. Verifica tu internet.';
      let errorTitle = 'Error al hacer check-in';

      if (error.response) {
        // Error del backend (404, 409, 422, etc.)
        const status = error.response.status;
        const backendError = error.response.data?.error || error.response.data?.mensaje;

        if (status === 404) {
          errorTitle = 'Sin reserva';
          errorMessage = backendError || 'No tienes una reserva confirmada para esta clase.';
        } else if (status === 409) {
          errorTitle = 'Check-in duplicado';
          errorMessage = backendError || 'Ya realizaste check-in para esta clase.';
        } else if (status === 422) {
          errorTitle = 'Fuera de horario';
          errorMessage = backendError || 'Fuera del horario permitido para check-in.';
        } else if (status === 401) {
          errorTitle = 'No autorizado';
          errorMessage = 'Tu sesión expiró. Por favor, inicia sesión nuevamente.';
        } else {
          errorMessage = backendError || errorMessage;
        }
      } else if (error instanceof SyntaxError) {
        // Error al parsear JSON del QR
        errorTitle = 'QR inválido';
        errorMessage = 'El código escaneado no es válido. Verifica que sea un QR del gimnasio.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert(
        errorTitle,
        errorMessage,
        [{
          text: 'Reintentar',
          onPress: () => {
            setScanned(false);
            setLoading(false);
          }
        }]
      );
    }
  };

  // Renderizar según el estado de permisos
  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.message}>Solicitando permisos de cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-off" size={80} color="#EF4444" />
        <Text style={styles.errorTitle}>Permiso de cámara denegado</Text>
        <Text style={styles.errorMessage}>
          Necesitamos acceso a la cámara para escanear códigos QR.{'\n'}
          Por favor, habilita el permiso en la configuración de tu dispositivo.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={requestPermission}
        >
          <Text style={styles.backButtonText}>Solicitar Permiso</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: '#6B7280', marginTop: 10 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        {/* Overlay con guía visual */}
        <View style={styles.overlay}>
          <View style={styles.topOverlay} />

          <View style={styles.middleRow}>
            <View style={styles.sideOverlay} />

            {/* Marco para el QR */}
            <View style={styles.focusBox}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>

            <View style={styles.sideOverlay} />
          </View>

          <View style={styles.bottomOverlay}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.loadingText}>Realizando check-in...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.instructionText}>
                  Enfoca el código QR dentro del marco
                </Text>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  middleRow: {
    flexDirection: 'row',
    height: 250,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  focusBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#2563EB',
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  cancelButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 20,
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  errorMessage: {
    color: '#D1D5DB',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

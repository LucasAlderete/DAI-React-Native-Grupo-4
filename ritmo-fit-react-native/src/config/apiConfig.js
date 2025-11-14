// Configuración centralizada de la API
// Para obtener tu IP local en Windows, ejecuta: ipconfig | findstr /i "IPv4"
// O en PowerShell: (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*"}).IPAddress

const API_CONFIG = {
  // Cambia esta IP por la de tu máquina cuando sea necesario
  // Para obtener tu IP: ipconfig (Windows) o ifconfig (Mac/Linux)
  BASE_URL: 'http://192.168.0.14:8080/api',
  HOST: 'http://192.168.0.14:8080',
  
  // Alternativas comunes:
  // - Android Emulator: 'http://10.0.2.2:8080/api'
  // - iOS Simulator: 'http://localhost:8080/api'
  // - Dispositivo físico: 'http://TU_IP_LOCAL:8080/api'
};

export default API_CONFIG;


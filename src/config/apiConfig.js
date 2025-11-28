// Configuración centralizada de la API
// Para obtener tu IP local en Windows, ejecuta: ipconfig | findstr /i "IPv4"
// O en PowerShell: (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*"}).IPAddress

const API_CONFIG = {
  // Cambia esta IP por la de tu máquina cuando sea necesario
  // Para obtener tu IP: ipconfig (Windows) o ifconfig (Mac/Linux)
  BASE_URL: 'http://192.0.168.62:8080/api',
  HOST: 'http://192.0.168.62:8080',
};

export default API_CONFIG;


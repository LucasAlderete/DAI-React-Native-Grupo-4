# RitmoFit React Native

Aplicación mobile para la gestión de clases de RitmoFit.

## Estructura del Proyecto

```
ritmo-fit-react-native/
├── src/
│   ├── components/
│   │   ├── ClasesList/
│   │   │   ├── index.js                     # Pantalla principal - Listado de clases
│   │   │   ├── FilterSelector.js            # Componente de filtro reutilizable
│   │   │   ├── ModalSelector.js             # Modal genérico de selección
│   │   │   ├── CalendarModal.js             # Modal de calendario
│   │   │   └── ClaseCard.js                 # Tarjeta de clase
│   │   └── ClaseDetail/
│   │       └── index.js                     # Detalle de clase individual
│   ├── config/
│   │   └── calendarConfig.js                # Configuración del calendario en español
│   ├── navigation/
│   │   └── RootNavigator.js                 # Navegación principal
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── BiometricUnlockScreen.js     # 
│   │   │   ├── ForgotPasswordScreen.js      # 
│   │   │   ├── LoginScreen.js               # 
│   │   │   ├── RegisterScreen.js            # 
│   │   │   └── VerifyCodeScreen.js          # 
│   │   ├── main/
│   │   │   └── HomeScreen.js                # 
│   │   ├── profile/
│   │   │   └── ProfileScreen.js             # Pantalla de perfil del usuario
│   │   └── reservas/
│   │       ├── CrearReservaScreen.js        # 
│   │       ├── DetalleReservaScreen.js      # 
│   │       └── MisReservasScreen.js         # 
│   │
│   ├── services/
│   │   └── clasesService.js                 # Cliente API para endpoints de clases
│   │   └── usuarioService.js                # Cliente API para endpoints de usuarios
│   └── utils/
│       └── dateFormatter.js                 # 
├── App.js                                   # Punto de entrada con NavigationContainer
├── index.js                                 # Registro del componente raíz
└── package.json                             # Dependencias del proyecto
```

## API Endpoints Configurados

### Cliente API Base
- **Base URL**: `http://10.0.2.2:8080/api`
- **Cliente**: Axios configurado con interceptores

### Endpoints Disponibles

1. **GET /clases**
   - Obtiene el listado completo de clases
   - Función: `getClases()`

2. **GET /clases/{id}**
   - Obtiene el detalle de una clase específica por ID
   - Función: `getClaseById(id)`

3. **GET /usuario/perfil**
   - Obtiene los datos del perfil del usuario autenticado
   - Función: `getUsuario()`

4. **PUT /usuario/perfil**
   - Actualiza los datos (nombre, email) del perfil del usuario
   - Función: `updateUsuarioPerfil(usuarioData)`

5. **PUT /usuario/perfil/imagen**
   - Actualiza la imagen de perfil del usuario
   - Función: `uploadUsuarioImagen(formData)`

## Instalación

```bash
npm install
```

## Ejecutar la Aplicación

```bash
# Iniciar Metro Bundler
npm start

# Android
npm run android

# iOS
npm run ios
```

## Estado Actual

✅ Estructura base implementada
✅ Navegación configurada con React Navigation
✅ Cliente API configurado con Axios
✅ Servicios para endpoints de clases implementados
✅ Listado de clases como pantalla inicial
✅ Vista de listado con filtros (Sede, Disciplina, Fecha con calendario)
✅ Vista de detalle de clase individual
✅ Navegación entre pantallas implementada
✅ Componentes modularizados y reutilizables

## Componentes Implementados

### ClasesList (Pantalla Principal)
- Pantalla inicial de la aplicación
- Listado de clases con cards
- Filtros por Sede, Disciplina y Fecha (calendario)
- Navegación al detalle al tocar una clase
- Estados de loading y error
- Componentes modularizados (FilterSelector, ModalSelector, CalendarModal, ClaseCard)

### ClaseDetail
- Detalle completo de una clase
- Información: fecha/hora, duración, instructor, cupos, sede, dirección
- Botón "Reservar" (funcionalidad pendiente)
- Estados de loading y error

### Profile
- Pantalla de perfil de usuario
- Muestra el nombre, email y foto de usuario
- Permite editar y actualizar los datos del perfil
- Permite cambiar la foto seleccionando una imagen desde la galería
- Solicita permisos de acceso a la galería con Expo ImagePicker
- Botón "Actualizar"
- Botón "Cerrar Sesión"
- Estados de loading y error

## Próximos Pasos

- [ ] Implementar funcionalidad de reserva
- [ ] Agregar validaciones de cupos
- [ ] Implementar gestión de reservas del usuario
- [ ] Agregar pantallas adicionales según requerimientos

## Dependencias Principales

- **React Navigation**: Navegación entre pantallas
- **Axios**: Cliente HTTP para consumir la API
- **Expo**: Framework y herramientas de desarrollo

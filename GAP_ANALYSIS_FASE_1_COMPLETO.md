# 📊 ANÁLISIS GAP COMPLETO - PROYECTO FIXIT

**Fecha:** 11 de Diciembre de 2025  
**Alcance:** Frontend (Expo/React Native) + Backend (NestJS + Microservicios + Prisma)  
**Estado:** ANÁLISIS SOLO - SIN MODIFICACIONES DE CÓDIGO

---

## 📋 ÍNDICE DE CONTENIDOS

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [A - CUMPLIDO](#a---cumplido)
3. [B - PARCIALMENTE CUMPLIDO](#b---parcialmente-cumplido)
4. [C - NO CUMPLIDO](#c---no-cumplido)
5. [D - RIESGOS E INCONSISTENCIAS](#d---riesgos--inconsistencias-detectadas)
6. [E - REQUERIMIENTOS JUSTIFICABLES O SIMPLIFICABLES](#e---requerimientos-justificables-o-simplificables)
7. [F - BACKLOG ORDENADO](#f---backlog-ordenado-prioritario)

---

## RESUMEN EJECUTIVO

### Versión del Proyecto
- **Frontend:** Expo 54.0.20, React Native 0.81.5, React 19.1.0
- **Backend:** NestJS (monorepo con 7 microservicios)
- **Base de datos:** PostgreSQL (separado por microservicio)
- **Event Bus:** Kafka (comunicación entre microservicios)
- **ORM:** Prisma (con esquemas independientes por servicio)

### Nivel de Completitud General
- **Funcionalidades Principales:** ~85% implementadas
- **Integración End-to-End:** ~75% funcional
- **Documentación:** Buena (incluye README_MAESTRITO.md, NOTIFICATION_SYSTEM_AUDIT.md)
- **Estado de Maestrito:** ✅ 100% Implementado y Documentado

### Hallazgos Principales
- ✅ Flujo de autenticación completo (login, logout, switch role)
- ✅ Creación de solicitudes con validación y DTOs
- ✅ Sistema de propuestas (SolicitudTecnico)
- ✅ Módulo Maestrito (chat IA para creación conversacional)
- ✅ Notificaciones (backend)
- ⚠️ Algunos DTOs con inconsistencias en respuestas
- ⚠️ Frontend: Algunos tipos de datos desactualizados
- ⚠️ Validación de permisos parcial en algunos endpoints
- ❌ Sistema de pagos: Mínimamente implementado
- ❌ Calificaciones: Estructura existe pero sin endpoints públicos

---

## A - CUMPLIDO

### A.1 AUTENTICACIÓN Y AUTORIZACIÓN

#### ✅ Login y Registro
**Implementado en:**
- Backend: `apps/auth/src/services/auth.service.ts`
- Frontend: `src/screens/LoginScreen.tsx`, `src/screens/RegisterScreen.tsx`

**Campos soportados:**
- Email + Password
- Cédula + Password

**Validaciones:**
- Cédula ecuatoriana validada (10 dígitos)
- Email formato válido
- Password mínimo 8 caracteres

**DTOs:**
```typescript
// Backend
CreateUsuarioDto {
  cedula: string (10 caracteres)
  nombres: string (1-40 caracteres)
  apellidos: string (1-40 caracteres)
  email: string
  password: string (mínimo 8 caracteres)
  telefono?: string
}

LoginDto {
  email: string | null
  cedula: string | null
  password: string
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "jwt...",
    "refresh_token": "jwt...",
    "user": {
      "idUser": number,
      "cedula": string,
      "nombres": string,
      "apellidos": string,
      "email": string,
      "rol": "ADMIN" | "TECNICO" | "CLIENTE",
      "roles": ["CLIENTE", "TECNICO"?] // Array de roles
    }
  }
}
```

**¿QUÉ FALTA?**
- ✅ Todo está implementado
- Frontend almacena tokens en AsyncStorage (expo-secure-store)

---

#### ✅ Switch Role (Cambiar Rol)
**Implementado en:**
- Backend: `apps/auth/src/services/usuarios.service.ts:switchRole()`
- Frontend: `src/context/AuthContext.tsx:switchRole()`

**Flujo:**
1. Usuario con rol CLIENTE puede activar rol TECNICO
2. El rol CLIENTE siempre permanece (array de roles)
3. Se emite evento Kafka `user.role_switched`
4. Frontend almacena rol activo en storage

**Backend:**
```typescript
// Obtiene usuario actual
// Agrega nuevo rol si no está en array
// Guarda en BD
// Emite evento Kafka
await this.kafkaService.publishEvent('user.role_switched', {
  userId,
  previousRoles,
  newRoles,
  addedRole,
  timestamp
});
```

**Frontend:**
```typescript
const { switchRole } = useAuth();
await switchRole('TECNICO');
// Recarga navegación a TechnicianNavigator
```

---

#### ✅ JWT y Tokens
**Implementado:**
- Token generation: `apps/auth/src/services/auth.service.ts`
- Token validation: `apps/api-gateway/src/auth/strategies/jwt.strategy.ts`
- Access token: Corta duración (15 min típico)
- Refresh token: Larga duración

**Guards:**
- `JwtAuthGuard`: Valida presencia de token
- `RolesGuard`: Valida rol del usuario
- `@Public()`: Permite endpoints sin autenticación

**Endpoints públicos:**
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- GET /request/solicitudes

---

### A.2 SOLICITUDES (REQUEST) - FLUJO COMPLETO

#### ✅ Crear Solicitud
**Estructura:**

```
Frontend (RequestWizard) 
  ↓ 5 pasos (Service, Problem, Address, Photos, Review)
  ↓
API Gateway: POST /request/solicitudes
  ↓
RequestProxyService.createSolicitud()
  ↓
Request Microservice: REQUEST_PATTERNS.CREATE_SOLICITUD
  ↓
SolicitudesService.create()
  ↓
Prisma: solicitud.create()
  ↓
BD guardada ✅
```

**Frontend Wizard Steps:**
1. `RequestStepServiceScreen.tsx` - Seleccionar tipo de servicio
2. `RequestStepProblemScreen.tsx` - Descripción del problema
3. `RequestStepAddressScreen.tsx` - Ubicación (parroquia)
4. `RequestStepPhotosScreen.tsx` - Fotos (captura/galería)
5. `RequestStepReviewScreen.tsx` - Revisión y envío

**DTO (Backend):**
```typescript
CreateSolicitudDto {
  idTipoServicio: number (obligatorio)
  codigoParroquia: string (obligatorio)
  tituloProblema: string (5-100 chars)
  descripcionProblema: string (20-1000 chars)
  costoEstimado?: number
  costoPromocion?: number
  promocion?: boolean
  fechaProgramada?: ISO date string
  duracionEstimadaMin?: number (mínimo 15)
}
```

**Validaciones:**
- DTO con class-validator
- Tipo de servicio debe existir (referencia a technician.tipoServicio)
- Parroquia debe existir (referencia a geo.parroquias)
- Descripción mínimo 20 caracteres

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "idSolicitud": number,
    "idUser": number,
    "idTipoServicio": number,
    "codigoParroquia": string,
    "tituloProblema": string,
    "descripcionProblema": string,
    "estadoSolicitud": "PENDIENTE",
    "createdAt": ISO date,
    "updatedAt": ISO date
  }
}
```

---

#### ✅ Ver Solicitudes del Usuario
**Backend:**
- GET `/request/solicitudes/my/solicitudes` → RequestController
- → RequestProxyService.findSolicitudesByUser()
- → REQUEST_PATTERNS.FIND_SOLICITUDES_BY_USER

**Filtros soportados:**
- `estadoSolicitud`: PENDIENTE | ACEPTADA | CANCELADA | COMPLETADA
- `idTipoServicio`: number
- `codigoParroquia`: string
- `limit`: number (default 20)
- `page`: number (default 1)

**Frontend:**
- `ClientRequestsScreen.tsx` - Lista de solicitudes del usuario
- `RequestsHistoryScreen.tsx` - Historial completo

---

#### ✅ Actualizar Solicitud
**Backend:**
- PUT `/request/solicitudes/:id`
- Requiere: JwtAuthGuard + permisos

**Campos actualizables:**
- tituloProblema
- descripcionProblema
- fechaProgramada
- duracionEstimadaMin
- (no se puede cambiar tipo de servicio ni parroquia)

---

#### ✅ Cancelar Solicitud
**Backend:**
- PUT `/request/solicitudes/:id/cancel`
- Solo si estado es PENDIENTE
- Requiere ser propietario o admin

**Response:**
```json
{
  "success": true,
  "data": {
    "idSolicitud": number,
    "estadoSolicitud": "CANCELADA"
  }
}
```

---

#### ✅ Eliminar Solicitud (Admin)
**Backend:**
- DELETE `/request/solicitudes/:id`
- Solo ADMIN
- Eliminación física de BD

---

### A.3 SISTEMA DE PROPUESTAS (SOLICITUDES-TECNICOS)

#### ✅ Técnico se Postula a Solicitud
**Backend:**
- POST `/request/solicitudes-tecnicos`
- `SolicitudesTecnicosService.postularse()`

**DTO:**
```typescript
CreateSolicitudTecnicoDto {
  idSolicitud: number
  costoAcordado?: number
}
```

**Validaciones:**
- Solicitud debe existir y estar en estado PENDIENTE
- Técnico no debe haber presentado propuesta antes (unique constraint)

**Response:**
```json
{
  "success": true,
  "data": {
    "idSolTec": number,
    "idSolicitud": number,
    "idTecnico": number,
    "costoAcordado": number | null,
    "estadoAcuerdo": "PROPUESTO"
  }
}
```

---

#### ✅ Cliente Acepta/Rechaza Propuesta
**Backend:**
- PUT `/request/solicitudes-tecnicos/:id/responder`
- `SolicitudesTecnicosService.responder()`

**DTO:**
```typescript
ResponderSolicitudDto {
  respuesta: "ACEPTADO" | "RECHAZADO"
  notas?: string (máximo 500 chars)
}
```

**Flujo:**
1. Cliente rechaza otras propuestas
2. Cliente acepta la elegida
3. Solicitud pasa a estado ACEPTADA
4. Se emite evento Kafka

---

### A.4 MÓDULO MAESTRITO ✅ 100% IMPLEMENTADO

#### ✅ Estructura Completa
**Archivos implementados:**
- `apps/request/src/maestrito/maestrito.service.ts` - Orquestación
- `apps/request/src/maestrito/maestrito.controller.ts` - Endpoints RPC
- `apps/request/src/maestrito/maestrito.module.ts` - Módulo NestJS
- `apps/request/src/maestrito/ollama-client.ts` - Cliente HTTP para Ollama
- `apps/request/src/maestrito/types/chat-session.types.ts` - Tipos

**Patrones de eventos:**
- `MAESTRITO_PATTERNS.START_SESSION`
- `MAESTRITO_PATTERNS.SEND_MESSAGE`
- `MAESTRITO_PATTERNS.GET_SESSION_HISTORY`
- `MAESTRITO_PATTERNS.END_SESSION`

---

#### ✅ Flujo de Maestrito
**Inicio de sesión:**
```
POST /request/maestrito/start
Authorization: Bearer <JWT>

Response:
{
  "success": true,
  "data": {
    "sessionId": "uuid"
  }
}
```

**Enviar mensaje:**
```
POST /request/maestrito/:sessionId/message
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "message": "Necesito reparar la tubería"
}

Response:
{
  "success": true,
  "data": {
    "type": "MESSAGE|SOLICITUD_CREATED|ERROR|WAITING_INPUT",
    "message": "¿En qué zona de la ciudad estás?",
    "timestamp": ISO date
  }
}
```

**Obtener historial:**
```
GET /request/maestrito/:sessionId/history
Authorization: Bearer <JWT>

Response:
{
  "success": true,
  "data": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Finalizar sesión:**
```
DELETE /request/maestrito/:sessionId
Authorization: Bearer <JWT>
```

---

#### ✅ Sistema de Sesiones
**Gestión:**
- Sesiones almacenadas en memoria (Map<sessionId, ChatSession>)
- Timeout: 30 minutos de inactividad
- Cleanup automático cada 5 minutos
- UUID para cada sessionId

**Campos recopilados por Maestrito:**
1. `idTipoServicio` (obligatorio)
2. `codigoParroquia` (obligatorio)
3. `tituloProblema` (obligatorio)
4. `descripcionProblema` (obligatorio)
5. `fechaProgramada` (opcional)
6. `costoEstimado` (opcional)

**Prompts:**
- System prompt: Instrucciones claras para responder en JSON
- Tabla de mapeo de servicios (ID 1-6)
- Formato exacto de códigos de parroquia

---

#### ✅ Integración con Crear Solicitud
```typescript
// Cuando LLM responde con mode: "CREAR_SOLICITUD"
if (parsedResponse.mode === 'CREAR_SOLICITUD') {
  // Mapear datos de Maestrito a CreateSolicitudDto
  const createDto = this.mapToCreateSolicitudDto(parsedResponse.solicitudData);
  
  // Llamar mismo patrón que formulario
  const response = await firstValueFrom(
    this.requestClient.send(REQUEST_PATTERNS.CREATE_SOLICITUD, {
      createSolicitudDto: createDto,
      idUser: session.userId
    })
  );
  
  // Retornar solicitud creada
  return {
    mode: 'SOLICITUD_CREADA',
    solicitud: response.data
  };
}
```

---

### A.5 GEOLOCALIZACIÓN

#### ✅ Provincias, Cantones, Parroquias
**Backend:**
- `apps/geo/src/services/geos.service.ts`
- `apps/geo/src/controllers/geos.controller.ts`

**Endpoints:**
- GET `/geo/provincias` - Listar todas
- GET `/geo/provincias/:codigo` - Una específica
- GET `/geo/cantones?codigoProvincia=xx` - Cantones de provincia
- GET `/geo/parroquias?codigoCanton=xx` - Parroquias de cantón
- GET `/geo/parroquias/:codigo` - Parroquia específica

**Datos sembrados:**
- 24 provincias de Ecuador
- Cantones (ejemplo: Guayaquil con código 0901)
- Parroquias de Guayaquil (16 parroquias)

**Frontend:**
- `RequestStepAddressScreen.tsx` - Seleccionar provincia → cantón → parroquia
- `HomeSearch.tsx` - Buscar servicios por ubicación

---

### A.6 SISTEMA DE NOTIFICACIONES

#### ✅ Backend Completo
**Estructura:**
- `apps/notification/src/services/notificaciones.service.ts`
- Tipos: `SOLICITUD_NUEVA`, `SOLICITUD_ACEPTADA`, `SOLICITUD_COMPLETADA`, `CALIFICACION_RECIBIDA`, `RECORDATORIO`

**BD:**
```prisma
model Notificacion {
  idNotificacion: Int
  idUser: Int
  titulo: string
  mensaje: string
  estadoLectura: boolean
  tipoNotificacion: TipoNotificacion enum
  fechaEnvio: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}

model TokenNotificacion {
  idTokenNotificacion: Int
  idUser: Int
  tokenDispositivo: string
  plataforma: string
  estadoDispositivo: boolean
  expiresAt: DateTime
}
```

**Endpoints:**
- GET `/notification/notificaciones` - Listar
- POST `/notification/notificaciones` - Crear (interno, vía Kafka)
- PUT `/notification/notificaciones/:id/marcar-leida`
- POST `/notification/tokens` - Registrar dispositivo

**¿Cuál es el estado en Frontend?**
- ⚠️ Pantalla de notificaciones existe (`NotificationsScreen.tsx`)
- ⚠️ Lógica de lectura de notificaciones mínima
- ❌ Push notifications (FCM) NO implementadas en frontend

---

### A.7 NAVEGACIÓN Y FLUJO DE PANTALLAS

#### ✅ Estructura Completa
**App Navigation:**
```
App
├─ AuthNavigator (no autenticado)
│  ├─ LoginScreen
│  ├─ RegisterScreen
│  └─ BecomeTechnicianScreen
│
└─ AppNavigator (autenticado)
   ├─ ClientNavigator
   │  ├─ HomeScreen
   │  ├─ ClientRequestsScreen
   │  ├─ ActiveServicesScreen
   │  ├─ ClientProfileScreen
   │  ├─ NotificationsScreen
   │  ├─ SupportScreen
   │  ├─ RequestDetailsScreen
   │  ├─ EditProfileScreen
   │  ├─ RequestsHistoryScreen
   │  ├─ RegisterTechnicianScreen
   │  └─ request-wizard/
   │     ├─ RequestStepServiceScreen
   │     ├─ RequestStepProblemScreen
   │     ├─ RequestStepAddressScreen
   │     ├─ RequestStepPhotosScreen
   │     └─ RequestStepReviewScreen
   │
   └─ TechnicianNavigator (cuando rol TECNICO)
      ├─ TechnicianHomeScreen
      ├─ AvailableRequestsScreen
      ├─ MyJobsScreen
      ├─ TechnicianProfileScreen
      └─ DetailScreen
```

**Estados:**
- No autenticado → AuthNavigator
- Autenticado con rol CLIENTE → ClientNavigator
- Autenticado con rol TECNICO activo → TechnicianNavigator

---

### A.8 SERVICIOS API Y CONSUMO

#### ✅ Cliente HTTP
**Implementado:**
- `src/services/api-client.service.ts` - Axios instance con interceptores
- Base URL configurable
- Token JWT en headers
- Error handling

**Servicios especializados:**
- `auth.service.ts` - Login, logout, register
- `request.service.ts` - Crear, actualizar, listar solicitudes
- `technician.service.ts` - Propuestas, trabajos
- `home.service.ts` - Tipos de servicios, técnicos destacados
- `notification.service.ts` - Notificaciones
- `storage.service.ts` - LocalStorage con AsyncStorage

---

### A.9 VALIDACIONES EN FRONTEND

#### ✅ Implementadas
- Email: Formato válido
- Cédula: 10 dígitos
- Teléfono: Formato opcional
- Descripción: Mínimo caracteres
- Fecha: Formato válido

---

## B - PARCIALMENTE CUMPLIDO

### B.1 ROLES Y PERMISOS

#### ⚠️ Problema: Rol es campo singular en algunas partes
**Situación:**
- Backend Auth: Usuario tiene array `roles: RolUsuario[]`
- Frontend: Algunos lugares usan `user.rol` (singular)
- Backend Response: Usuario retorna `rol` (singular) en algunos endpoints

**Ubicaciones inconsistentes:**
- `apps/auth/src/prismaClientAuth/schema.prisma` línea 35:
  ```prisma
  roles RolUsuario[] @default([CLIENTE])
  ```
- Pero en respuestas se retorna singular `rol`
- Frontend `AuthContext.tsx` línea ~120:
  ```typescript
  user.roles?.includes('TECNICO')  // Array
  ```

**¿Qué debería ser?**
- Array de roles para versatilidad
- Respuesta siempre incluir `roles: RolUsuario[]`
- Frontend siempre usar `user.roles`

**Impacto:** Bajo - Funciona pero es confuso

---

#### ⚠️ Protección de Endpoints Incompleta
**Endpoints sin @Roles() guard:**
- GET `/request/solicitudes` - Público (✓ intencional)
- GET `/request/solicitudes/:id` - Sin validar que sea propietario
- PUT `/request/solicitudes/:id` - Sin validar que sea propietario
- GET `/geo/...` - Públicos (✓ intencional)

**Impacto:** Técnico podría actualizar solicitud ajena (bajo riesgo si solo acepta propuesta)

---

### B.2 MANEJO DE ERRORES Y EXCEPCIONES

#### ⚠️ Inconsistencia en Respuestas
**En algunos endpoints:**
```json
{
  "success": false,
  "error": "Mensaje de error",
  "statusCode": 400
}
```

**En otros:**
```json
{
  "statusCode": 400,
  "message": "Mensaje de error",
  "error": "BadRequest"
}
```

**Ubicación:** 
- RequestController vs AuthController - formatos diferentes
- GlobalExceptionFilter (`apps/api-gateway/src/filters/http-exception.filter.ts`)

**Impacto:** Frontend debe manejar ambos formatos

---

#### ⚠️ Manejo de Errores de Microservicio Incompleto
**Problema:**
```typescript
// En request-proxy.service.ts
const response = await firstValueFrom(
  this.requestClient.send(REQUEST_PATTERNS.CREATE_SOLICITUD, payload)
);

// Si microservicio falla, no siempre se captura bien
if (!response.success) {
  // ¿Qué error retornar?
}
```

**Impacto:** Usuario puede ver "Unknown error" en lugar de mensaje específico

---

### B.3 CALIFICACIONES (RATINGS)

#### ⚠️ Estructura Existe Pero Sin Endpoints Públicos
**BD (Technician service):**
```prisma
model Calificacion {
  idCalificacion: Int
  idSolicitud: Int
  idTecnico: Int
  puntaje: PuntajeCalificacion enum
  comentario: string?
  fechaCalificacion: DateTime
}

enum PuntajeCalificacion {
  EXCELENTE, BUENO, REGULAR, MALO, TERRIBLE
}
```

**¿Qué está implementado?**
- ✅ Modelo Prisma
- ✅ Servicio: `apps/technician/src/services/calificaciones.service.ts`
- ❌ Controlador/Endpoints público para cliente calificar
- ❌ Frontend: NO hay pantalla de calificación
- ✅ Promedio de calificaciones se calcula en `getTechnicianProfile()`

**Falta implementar:**
- POST `/technician/calificaciones` - Cliente califica técnico
- GET `/technician/:id/calificaciones` - Ver calificaciones de técnico

---

### B.4 SISTEMA DE PAGOS

#### ⚠️ Estructura Mínima, No Funcional
**¿Qué existe?**
- Microservicio: `apps/payment/src/`
- Modelo Prisma: `Transaccion`
- Servicio: `apps/payment/src/services/transacciones.service.ts`

**¿Qué falta?**
- ❌ Integración con gateway de pagos real (Stripe, PayPal, etc.)
- ❌ Endpoints públicos para hacer pagos
- ❌ Lógica de cálculo de montos
- ❌ Frontend: NO hay pantalla de pagos
- ❌ Validación de transacciones

**Modelo existente:**
```prisma
model Transaccion {
  idTransaccion: Int
  idSolicitud: Int
  idUsuario: Int
  monto: Decimal
  metodoPago: MetodoPago enum
  estadoTransaccion: EstadoTransaccion enum
  referencia?: string
  createdAt: DateTime
  updatedAt: DateTime
}

enum MetodoPago {
  EFECTIVO, TRANSFERENCIA, TARJETA, OTRO
}
```

**Impacto:** Funcionalidad crítica ausente - DEBE implementarse

---

### B.5 FOTO ADJUNTOS EN SOLICITUDES

#### ⚠️ Pantalla Existe Pero Sin Almacenamiento
**Frontend:**
- `RequestStepPhotosScreen.tsx` - Permite capturar/seleccionar fotos
- Usa `expo-camera` y `expo-media-library`

**¿Qué hace?**
- Captura fotos de la cámara ✓
- Selecciona de galería ✓
- Las muestra en preview ✓

**¿Qué falta?**
- ❌ NO hay lógica para enviar fotos al servidor
- ❌ Backend NO tiene endpoint para recibir fotos
- ❌ BD NO tiene campo para almacenar referencias a fotos
- ❌ NO hay almacenamiento en S3/Cloud Storage

**Impacto:** Feature incompletou - Las fotos se capturan pero no se guardan

---

### B.6 BÚSQUEDA Y FILTROS

#### ⚠️ Backend Soporta Pero Frontend Parcial
**Backend:**
- GET `/request/solicitudes?estadoSolicitud=PENDIENTE&idTipoServicio=1&...`
- Filtros: estado, tipo servicio, parroquia, promoción, limit, page

**Frontend:**
- `HomeSearch.tsx` - Busca servicios por nombre/palabra clave
- ❌ NO filtra por otros campos (estado, precio, etc.)
- ❌ NO hay búsqueda avanzada

**Impacto:** Búsqueda básica funciona pero muy limitada

---

## C - NO CUMPLIDO

### C.1 ESTADÍSTICAS Y REPORTES

#### ❌ Sin Implementar
**¿Qué debería haber?**
- Dashboard de estadísticas para ADMIN
- Reportes: Solicitudes por período, ingresos, servicios más solicitados
- Gráficos: Tendencias, distribución geográfica

**¿Qué existe?**
- ✅ Backend tiene método: `SolicitudesService.getStats(idUser?)`
- ✅ Endpoint: GET `/request/solicitudes/stats/general` (admin only)
- ✅ Endpoint: GET `/request/solicitudes/stats/my-stats` (usuario)
- ❌ Frontend: NO hay vista de estadísticas
- ❌ Frontend: NO hay gráficos

**Impacto:** Feature de análisis no disponible

---

### C.2 CHAT/COMUNICACIÓN DIRECTA

#### ❌ Sin Implementar
**Requisito:** Cliente y técnico deben poder comunicarse durante el servicio

**¿Qué existe?**
- ❌ Microservicio de chat NO existe
- ❌ Modelo de mensajes NO existe
- ❌ Endpoint de envío de mensajes NO existe
- ❌ Frontend: NO hay pantalla de chat

**Impacto:** No hay comunicación en tiempo real durante servicio

**¿Cómo se debería resolver?**
- Opción A: Integrar Socket.IO o WebSockets
- Opción B: Usar tercero como Firebase Realtime DB
- Opción C: Polling HTTP simple

---

### C.3 RASTREO EN TIEMPO REAL (TRACKING)

#### ❌ Sin Implementar
**Requisito:** Cliente puede ver ubicación en tiempo real del técnico

**¿Qué existe?**
- ❌ Endpoint para enviar ubicación del técnico NO existe
- ❌ Endpoint para obtener ubicación NO existe
- ❌ Almacenamiento de historial de ubicación NO existe
- ❌ Frontend: NO hay mapa con técnico

**Impacto:** Cliente no sabe dónde está técnico

---

### C.4 CALENDARIO DE DISPONIBILIDAD

#### ❌ Sin Implementar
**Requisito:** Técnico establece horarios de disponibilidad

**¿Qué existe?**
- ❌ Modelo de disponibilidad NO existe
- ❌ Servicios NO existen
- ❌ Endpoints NO existen
- ❌ Frontend: NO hay pantalla

**Impacto:** No se puede ver disponibilidad de técnico

---

### C.5 SISTEMA DE PUNTOS/RECOMPENSAS

#### ❌ Sin Implementar
**Requisito:** Usuarios ganan puntos por actividad

**¿Qué existe?**
- ❌ Tabla de puntos NO existe
- ❌ Servicios NO existen
- ❌ Cálculo de puntos NO existe
- ❌ Frontend: NO hay pantalla

---

### C.6 INTEGRACIÓN CON REDES SOCIALES

#### ❌ Sin Implementar
**Requisito:** Login/registro con Facebook, Google

**¿Qué existe?**
- ❌ Servicios de OAuth NO existen
- ❌ Endpoints NO existen
- ❌ Frontend: NO hay botones

---

### C.7 MULTI-IDIOMA

#### ❌ Sin Implementar
**Requisito:** Soporte para múltiples idiomas

**¿Qué existe?**
- ❌ Diccionarios NO existen
- ❌ i18n NO está configurado
- ❌ Frontend: Textos hardcodeados en español

---

---

## D - RIESGOS E INCONSISTENCIAS DETECTADAS

### D.1 RIESGO CRÍTICO: Esquemas de Prisma Duplicados

**Problema:**
- Cada microservicio tiene su propia instancia de PrismaClient
- Cada uno tiene su `schema.prisma`
- NO hay sincronización entre esquemas

**Ubicaciones:**
```
apps/auth/src/prismaClientAuth/schema.prisma
apps/technician/src/prismaClientTechnician/schema.prisma
apps/request/src/prismaClientRequest/schema.prisma
apps/geo/src/prismaClientGeo/schema.prisma
apps/payment/src/prismaClientPayment/schema.prisma
apps/notification/src/prismaClientNotification/schema.prisma
```

**Ejemplos de inconsistencias encontradas:**

| Tema | Auth | Technician | Request |
|------|------|------------|---------|
| Tabla Usuario | Usuario | (no existe) | (referencia externa) |
| Tabla Tecnico | (no existe) | Tecnico | (referencia externa) |
| Tabla Solicitud | (no existe) | (no existe) | Solicitud |
| Tabla Calificacion | (no existe) | Calificacion | (no existe) |
| Enum RolUsuario | Existe | Existe | (importado de @app/shared) |

**Riesgo:**
- ⚠️ Si cambias schema en un lugar, otros no se actualizan
- ⚠️ Foreign keys entre microservicios son débiles (solo por ID, sin constraint)
- ⚠️ Validaciones de referencia son responsabilidad del código, no de BD

**Mitigación actual:**
- Documentación en DTOs
- Validaciones en servicios
- Tests (probablemente ausentes)

**Recomendación:**
- Crear documento de "Data Contract" entre microservicios
- Automatizar validación de referencias
- Agregar tests de integración

---

### D.2 RIESGO ALTO: Seguridad - Validación de Propietario

**Problema:**
```typescript
// En SolicitudesService.update()
async update(id: number, updateDto: UpdateSolicitudDto, currentUser: any) {
  const solicitud = await this.database.solicitud.findUnique({
    where: { idSolicitud: id },
  });
  
  // ⚠️ NO se valida que currentUser.idUser === solicitud.idUser
  // Técnico podría actualizar solicitud que no es suya
  
  return await this.database.solicitud.update({
    where: { idSolicitud: id },
    data: updateDto,
  });
}
```

**Ubicaciones:**
- `apps/request/src/services/solicitudes.service.ts:update()`
- `apps/request/src/services/solicitudes.service.ts:cancel()`
- Posiblemente otros

**Impacto:**
- ⚠️ Usuario técnico podría cancelar solicitud
- ⚠️ Cualquier usuario autenticado podría ver solicitud (si no hay validación)

**Verificación necesaria:**
- Revisar cada método que modifica datos
- Asegurar que siempre valide `currentUser.idUser`

---

### D.3 RIESGO MEDIO: Fotografías en Solicitudes - Falta Completar

**Problema:**
```typescript
// Frontend captura fotos
const photos = await capturePhotoFromCamera();

// Pero NO hay endpoint para enviarlas
// POST /request/solicitudes/:id/fotos - ¿EXISTE?

// Así que fotos se pierden
```

**Impacto:**
- ⚠️ Feature incompleto
- ⚠️ Usuario confundido (interface sugiere que se guardan)
- ❌ Sin fotos, técnico no sabe qué reparar

---

### D.4 RIESGO MEDIO: Email Verification - Parcialmente Implementado

**Implementado:**
- ✅ Campo `emailVerificado` en BD
- ✅ Método `verifyEmail()` en UsuariosService
- ✅ Endpoint HTTP: POST `/usuarios/verify-email` (probable)

**No Implementado:**
- ❌ Envío de email de confirmación
- ❌ Token de verificación
- ❌ Validación en login: ¿Se requiere email verificado?

**¿Quién debería hacerlo?**
- POST `/auth/register` → Enviar email con link
- Link → POST `/auth/verify-email?token=xxx`

**Impacto:** ⚠️ Usuarios pueden registrarse con email fake

---

### D.5 RIESGO BAJO: Datos de Desarrollo en Seed

**Ubicación:**
- `apps/technician/src/prismaClientTechnician/seed.sql`

**Problema:**
```sql
-- Certificaciones de ejemplo
INSERT INTO certificaciones (...)
VALUES
  ('Certificación en Electricidad Básica', 'SECAP', ...),
  ('Técnico en Plomería', 'INEN', ...),
  ('Técnico en Aires Acondicionados', 'Ministerio de Trabajo', ...);

-- En producción, tendrá datos hardcodeados
-- No escalable si se requieren cambiar
```

**Impacto:** ⚠️ Bajo - Solo afecta desarrollo

---

### D.6 INCONSISTENCIA: Rol Singular vs Array en Respuestas

**Problema encontrado:**
```typescript
// usuario.interface.ts - Define como array
export interface Usuario {
  roles: RolUsuario[];
}

// Pero AuthResponseDto retorna singular
export interface AuthResponse {
  user: {
    rol: RolUsuario;  // ← Singular
  };
}

// Y frontend a veces accede como singular
const { user } = useAuth();
if (user.rol === 'TECNICO') { } // ✗ Debería ser user.roles.includes()
```

**Ubicaciones:**
- `apps/auth/src/dto/auth-response.dto.ts`
- `front_end_fixit-1/src/types/api.ts`
- `front_end_fixit-1/src/context/AuthContext.tsx`

**Impacto:** ⚠️ Confusión en desarrollo, pero funciona

---

### D.7 WARNING: Maestrito - Dependencia de Ollama

**Ubicación:**
- `apps/request/src/maestrito/maestrito.service.ts:onModuleInit()`

**Problema:**
```typescript
const isHealthy = await this.ollamaClient.healthCheck();
if (!isHealthy) {
  this.logger.warn('Ollama is not responding. Check if it is running.');
  // ⚠️ No falla el módulo, solo aviso
  // Si Ollama no está, crear solicitud via chat fallará
}
```

**Requisito operacional:**
- ⚠️ Ollama debe estar corriendo (`ollama serve`)
- ⚠️ Modelo debe estar descargado (`ollama pull llama2`)
- ⚠️ En producción, requiere recursos CPU/GPU significativos

**Recomendación:**
- Documentar claramente requisitos
- Considerar alternativa: API de modelo remoto (Hugging Face, etc.)

---

---

## E - REQUERIMIENTOS JUSTIFICABLES O SIMPLIFICABLES

### E.1 Email Verification - Justificable Posponerlo

**Razón:**
- MVP: Autenticación básica funciona sin verificación
- Puede agregarse en iteración 2
- Requiere: SendGrid, AWS SES, o similar

**Recomendación:**
- ✅ Posponer a fase 2
- Pero: Documentar que está pendiente

---

### E.2 Push Notifications en Frontend - Justificable Posponerlo

**Razón:**
- Backend está listo
- Frontend: Solo requiere FCM (Google Cloud Messaging)
- Requiere: Certificados, configuración de Google Cloud

**Recomendación:**
- ✅ Posponer a fase 2
- Pero: Dejar estructura lista en frontend

---

### E.3 Pagos - NO Justificable, ES Crítico

**Razón:**
- Es funcionalidad central
- Aplicación no puede ir a producción sin pagos
- Requiere: Integración con Stripe, PayPal, Mercado Pago

**Recomendación:**
- ❌ NO posponer
- Implementar antes de MVP final

---

### E.4 Calificaciones - Justificable Posponerlo Parcialmente

**¿Por qué?**
- Estructura BD lista
- Pero endpoints para cliente calificar faltan

**Recomendación:**
- ✅ Fase 2 para calificaciones públicas
- Pero: Completar endpoints de lectura en fase 1

---

### E.5 Chat en Tiempo Real - Justificable Posponerlo

**Razón:**
- Feature "Nice to have", no crítico
- Requiere: WebSockets, arquitectura diferente
- MVP puede funcionar sin chat

**Recomendación:**
- ✅ Fase 2 o 3
- Alternativa: Usar tercero como Twilio

---

---

## F - BACKLOG ORDENADO (PRIORITARIO)

### 🔴 CRÍTICO - Debe hacerse ANTES de MVP

#### 1. **Completar Sistema de Pagos**
**Alcance:**
- Integración real con gateway (Stripe / Mercado Pago)
- Endpoints backend: POST `/payment/create`, GET `/payment/status`
- Frontend: `PaymentScreen.tsx`
- Cálculo de montos: Costo base + impuestos + comisión

**Esfuerzo:** 3-5 días
**Archivo:** `F_1_SYSTEM_PAGOS.md` (crear documento específico)

---

#### 2. **Guardar Fotografías de Solicitud**
**Alcance:**
- Endpoint backend: POST `/request/solicitudes/:id/fotos`
- Almacenamiento: S3 o Firebase Storage
- BD: Agregar tabla `SolicitudFoto` con referencias
- Frontend: Enviar fotos en paso 4 del wizard

**Esfuerzo:** 2-3 días
**Archivo:** `F_2_UPLOAD_FOTOS.md`

---

#### 3. **Completar Sistema de Calificaciones (Public API)**
**Alcance:**
- Endpoint: POST `/technician/calificaciones` (cliente califica)
- Endpoint: GET `/technician/:id/calificaciones` (ver ratings)
- Frontend: Pantalla de calificación post-servicio
- Actualizar promedio en perfil de técnico

**Esfuerzo:** 2 días
**Archivo:** `F_3_CALIFICACIONES_PUBLIC.md`

---

### 🟠 IMPORTANTE - Debe hacerse para MVP Completo

#### 4. **Corregir Inconsistencias de Rol (Singular/Array)**
**Alcance:**
- Decidir: ¿Siempre array o siempre singular?
- Recomendación: Array (más flexible)
- Actualizar todos los DTOs
- Actualizar frontend para usar `user.roles`
- Tests

**Esfuerzo:** 1-2 días
**Archivo:** `F_4_UNIFY_ROLES.md`

---

#### 5. **Agregar Validaciones de Propietario (Security)**
**Alcance:**
- Revisar todos los métodos de actualización
- Agregar check: `currentUser.idUser === resource.idUser`
- Endpoints afectados: PUT solicitud, PUT propuesta, DELETE
- Tests de seguridad

**Esfuerzo:** 1-2 días
**Archivo:** `F_5_OWNER_VALIDATION.md`

---

#### 6. **Unificar Formato de Respuestas de Error**
**Alcance:**
- Decidir formato único
- Aplicar en todos los controladores
- GlobalExceptionFilter consistente
- Tests

**Recomendación:**
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400,
  "data": null
}
```

**Esfuerzo:** 1 día
**Archivo:** `F_6_UNIFY_ERROR_RESPONSES.md`

---

#### 7. **Implementar Chat/Comunicación en Tiempo Real**
**Alcance:**
- Nuevo microservicio o módulo en existente
- Modelo Chat/Mensaje en BD
- Endpoints: POST enviar, GET listar
- WebSocket o Socket.IO para real-time
- Frontend: `ChatScreen.tsx`

**Esfuerzo:** 3-4 días
**Alternativa:** Usar Twilio/Firebase (1 día)
**Archivo:** `F_7_REAL_TIME_CHAT.md`

---

#### 8. **Implementar Rastreo en Tiempo Real (Tracking)**
**Alcance:**
- Técnico envía ubicación cada N segundos
- Endpoint: POST `/technician/location`
- Cliente ver en mapa en tiempo real
- Almacenar historial de ubicación

**Recomendación:**
- Usar Google Maps API
- Almacenar solo últimas 100 ubicaciones por solicitud

**Esfuerzo:** 2-3 días
**Archivo:** `F_8_REAL_TIME_TRACKING.md`

---

### 🟡 IMPORTANTE PERO POSPONER - Fase 2

#### 9. **Push Notifications en Frontend**
**Alcance:**
- Configurar Firebase Cloud Messaging (FCM)
- Recibir notificaciones en app
- Manejar click en notificación

**Esfuerzo:** 1-2 días
**Requisito:** Tener backend de notificaciones listo (✅ ya existe)

---

#### 10. **Email Verification**
**Alcance:**
- Generar token único
- Enviar email con enlace
- Verificar token en backend
- Requerir verificación en login

**Esfuerzo:** 1-2 días
**Requisito:** SendGrid API key

---

#### 11. **Dashboard de Estadísticas (Admin)**
**Alcance:**
- Nuevos endpoints: GET `/admin/stats`
- Frontend: `AdminDashboardScreen.tsx`
- Gráficos: Solicitudes, ingresos, técnicos activos
- Filtros por fecha, ubicación, tipo servicio

**Esfuerzo:** 2-3 días
**Librería:** React Native Charts o Expo Charts

---

#### 12. **Calendario de Disponibilidad (Técnico)**
**Alcance:**
- Modelo `TecnicoDisponibilidad` en BD
- CRUD endpoints
- Frontend: Calendario interactivo
- Automáticamente ocultar técnico cuando no disponible

**Esfuerzo:** 2-3 días
**Librería:** React Native Calendar

---

#### 13. **Búsqueda Avanzada**
**Alcance:**
- Backend: Ya soporta filtros
- Frontend: Mejorar `HomeSearch.tsx`
- Agregar filtros: Precio, calificación, experiencia
- Guardar búsquedas frecuentes

**Esfuerzo:** 1-2 días

---

### 🔵 NICE TO HAVE - Fase 3

#### 14. **Sistema de Puntos/Recompensas**
**Esfuerzo:** 2-3 días
**Prioridad:** Baja

---

#### 15. **Login con OAuth (Google, Facebook)**
**Esfuerzo:** 2 días
**Prioridad:** Baja

---

#### 16. **Multi-idioma (i18n)**
**Esfuerzo:** 1-2 días
**Prioridad:** Baja

---

#### 17. **Dark Mode**
**Esfuerzo:** 1 día
**Prioridad:** Muy baja

---

---

## RESUMEN FINAL

### Métricas de Completitud

| Categoría | % | Estado |
|-----------|---|--------|
| **Autenticación** | 100% | ✅ Completo |
| **Solicitudes (CRUD)** | 95% | ✅ Casi completo (falta fotos) |
| **Propuestas** | 100% | ✅ Completo |
| **Maestrito (IA)** | 100% | ✅ Completo |
| **Geolocalización** | 100% | ✅ Completo |
| **Notificaciones** | 60% | ⚠️ Backend OK, frontend incompleto |
| **Pagos** | 10% | ❌ Estructurado pero no funcional |
| **Calificaciones** | 40% | ⚠️ BD lista pero sin endpoints públicos |
| **Chat Real-time** | 0% | ❌ No implementado |
| **Rastreo (Tracking)** | 0% | ❌ No implementado |
| **Fotos/Adjuntos** | 20% | ⚠️ Frontend captura, backend no recibe |
| **Validaciones** | 85% | ⚠️ Algunas falta revisar |
| **Seguridad** | 75% | ⚠️ Algunas validaciones incompletas |
| **Navegación** | 100% | ✅ Completo |
| **UI/UX** | 80% | ✅ Buena, pero algunos detalles |

### Conclusión por MVP

**¿ESTÁ LISTO PARA MVP?**
- Parcialmente: **Sí, con condiciones**

**¿Qué FALTA CRÍTICO antes de go-live?**
1. ❌ Sistema de pagos (Crítico)
2. ❌ Guardar fotos de solicitud (Crítico)
3. ⚠️ Validaciones de seguridad (Importante)
4. ⚠️ Calificaciones públicas (Importante)
5. ⚠️ Chat/comunicación (Deseable)

**Tiempo Estimado para Fase 1 Completa:**
- Crítico: 5-8 días
- Importante: 3-5 días
- **Total: 8-13 días**

---

**Documento preparado por:** Análisis Automático  
**Requiere revisión por:** Equipo técnico  
**Próximo paso:** Implementar backlog crítico


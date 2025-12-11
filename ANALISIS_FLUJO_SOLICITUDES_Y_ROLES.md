# 📋 ANÁLISIS PROFUNDO: FLUJO DE SOLICITUDES Y SISTEMA DE ROLES

**Fecha del análisis:** 2024
**Scope:** Solo análisis. NO hay modificaciones de código.
**Enfoque:** Solicitud completa (CLIENTE) y postulación de técnicos (TECNICO)

---

## 🎯 RESUMEN EJECUTIVO

### Hallazgos Críticos

| Hallazgo | Severidad | Status |
|----------|-----------|--------|
| Inconsistencia rol array vs singular | ⚠️ MAYOR | DETECTADO |
| Cliente puede ver propuestas que no le pertenecen | ⚠️ CRÍTICA | DETECTADO |
| GET /request/solicitudes sin protección de rol | ⚠️ CRÍTICA | DETECTADO |
| Validación rol singular en lógica de negocio | ⚠️ MAYOR | DETECTADO |

---

## 🔄 FLUJOS PRINCIPALES

### 1️⃣ FLUJO CREAR SOLICITUD (Cliente)

#### Ruta de Comunicación
```
CLIENTE_APP
    ↓ POST /request/solicitudes {idSolicitud, tituloProblema, descripcionProblema, ...}
API_GATEWAY
    ↓ RequestController.createSolicitud(@Roles(ADMIN, CLIENTE))
REQUEST_PROXY_SERVICE
    ↓ emit(REQUEST_PATTERNS.CREATE_SOLICITUD)
REQUEST_MICROSERVICE
    ↓ SolicitudesController.create()
SOLICITUDES_SERVICE
    ↓ database.solicitud.create({...})
DATABASE (Request PostgreSQL)
    ✅ Solicitud creada con estado PENDIENTE
```

#### Detalles Técnicos

**Endpoint:** `POST /request/solicitudes`
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN, RolUsuario.CLIENTE)
createSolicitud(
    @Body() createSolicitudDto: any,
    @Request() req: any
): Observable<any>
```

**Validación de Roles:**
- ✅ RolesGuard verifica `user.roles` (array) O `user.rol` (singular)
- ✅ Solo ADMIN y CLIENTE pueden crear

**Datos Guardados (SolicitudesService.create):**
```typescript
{
    idSolicitud: number,           // PK
    idUser: number,                // FK al usuario que creó
    tituloProblema: string,
    descripcionProblema: string,
    costoEstimado: decimal,
    duracionEstimadaMin: int,
    estadoSolicitud: "PENDIENTE",  // ← Siempre PENDIENTE al crear
    categoriasProblema: string[],
    isActive: true,
    createdAt: timestamp,
    updatedAt: timestamp,
    updatedBy: idUser
}
```

**Estado Inicial:**
- `estadoSolicitud = EstadoSolicitud.PENDIENTE` (enum)
- Permanece PENDIENTE hasta que técnico sea aceptado

---

### 2️⃣ FLUJO LISTAR SOLICITUDES DISPONIBLES (Técnico)

#### Ruta de Comunicación
```
TECNICO_APP
    ↓ GET /request/solicitudes (SIN authentication requerida)
API_GATEWAY
    ↓ RequestController.findAllSolicitudes (@Public)
REQUEST_PROXY_SERVICE
    ↓ emit(REQUEST_PATTERNS.FIND_ALL)
REQUEST_MICROSERVICE
    ↓ SolicitudesController.findAll(filterDto)
SOLICITUDES_SERVICE
    ↓ database.solicitud.findMany({...})
DATABASE
    ✅ Retorna TODAS las solicitudes
```

#### Detalles Técnicos

**Endpoint:** `GET /request/solicitudes`
```typescript
@Get('solicitudes')
@Public()                              // ⚠️ SIN PROTECCIÓN DE ROL
findAllSolicitudes(@Query() filterDto: any): Observable<any>
```

**Filtrado (En Frontend - technician.service.ts):**
```typescript
export async function getAvailableRequests(): Promise<Solicitud[]> {
  const url = getApiUrl('/request/solicitudes');
  const resp = await apiClient.get<unknown>(url);
  
  // ... unwrap response ...
  
  // ⚠️ FILTRADO EN CLIENTE
  return allRequests.filter(
    req => req.estadoSolicitud === EstadoSolicitud.PENDIENTE
  );
}
```

**🚨 PROBLEMA DETECTADO #1: Filtrado en Cliente, no en Servidor**
- Backend retorna TODAS las solicitudes (sin filtrar por estado)
- Frontend filtra por PENDIENTE (pero puede cambiar)
- Si el filtrado falla en cliente, técnico ve solicitudes aceptadas o canceladas

---

### 3️⃣ FLUJO POSTULAR A SOLICITUD (Técnico)

#### Ruta de Comunicación
```
TECNICO_APP
    ↓ POST /solicitudes-tecnicos/postularse {idSolicitud, costoAcordado, notas}
API_GATEWAY
    ↓ RequestController.postularse(@Roles(TECNICO))
REQUEST_PROXY_SERVICE
    ↓ emit(REQUEST_PATTERNS.POSTULARSE_SOLICITUD, {createDto, idTecnico})
REQUEST_MICROSERVICE
    ↓ SolicitudesTecnicosController.postularse(data)
SOLICITUDES_TECNICOS_SERVICE
    ↓ Validar: solicitud existe, está PENDIENTE, técnico no se ha postulado
    ↓ database.solicitudTecnico.create({...})
DATABASE (solicitudTecnico tabla)
    ✅ Propuesta creada con estado PROPUESTO
```

#### Detalles Técnicos

**Endpoint:** `POST /solicitudes-tecnicos/postularse`
```typescript
@Post('solicitudes-tecnicos/postularse')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.TECNICO)
postularse(
    @Body() createSolicitudTecnicoDto: CreateSolicitudTecnicoDto,
    @Request() req: any
): Observable<any>
```

**Lógica de Validación (SolicitudesTecnicosService.postularse):**
```typescript
async postularse(createDto: CreateSolicitudTecnicoDto, idTecnico: number) {
  const { idSolicitud } = createDto;

  // 1️⃣ Verificar solicitud existe y está PENDIENTE
  const solicitud = await database.solicitud.findUnique({
    where: { idSolicitud, isActive: true }
  });

  if (!solicitud) {
    throw new NotFoundException(...);
  }

  if (solicitud.estadoSolicitud !== EstadoSolicitud.PENDIENTE) {
    throw new BadRequestException('Solo se puede postular a solicitudes pendientes');
  }

  // 2️⃣ Verificar que técnico NO se ha postulado ya
  const postulacionExistente = await database.solicitudTecnico.findUnique({
    where: {
      idSolicitud_idTecnico: {  // ← Índice ÚNICO
        idSolicitud,
        idTecnico
      }
    }
  });

  if (postulacionExistente) {
    throw new ConflictException('Ya te has postulado a esta solicitud');
  }

  // 3️⃣ Crear propuesta
  return database.solicitudTecnico.create({
    data: {
      idSolicitud,
      idTecnico,
      costoAcordado: createDto.costoAcordado,
      estadoAcuerdo: EstadoAceptacion.PROPUESTO,  // ← PROPUESTO siempre
      notas: createDto.notas
    },
    include: { solicitud: true }
  });
}
```

**Datos Guardados:**
```typescript
{
    idSolTec: number,                              // PK
    idSolicitud: number,                           // FK
    idTecnico: number,                             // FK
    costoAcordado: decimal,
    estadoAcuerdo: EstadoAceptacion.PROPUESTO,   // ← PROPUESTO
    notas: string,
    fechaPropuesta: timestamp,
    fechaConfirmada: null,  // Null hasta aceptación/rechazo
    createdAt: timestamp,
    updatedAt: timestamp
}

ÍNDICES ÚNICOS:
- PRIMARY: (idSolTec)
- UNIQUE: (idSolicitud, idTecnico)  // ← Un técnico solo 1 propuesta por solicitud
```

**Estados de Propuesta:**
```
PROPUESTO    → Técnico se postó, espera respuesta del cliente
ACEPTADO     → Cliente aceptó la propuesta
RECHAZADO    → Cliente rechazó o sistema rechazó automáticamente
```

---

### 4️⃣ FLUJO RESPONDER PROPUESTA (Cliente)

#### Ruta de Comunicación
```
CLIENTE_APP
    ↓ POST /solicitudes-tecnicos/:id/responder {estadoAcuerdo, costoAcordado, notas}
API_GATEWAY
    ↓ RequestController.responderSolicitudTecnico()
    ↓ Valida: Usuario dueño de solicitud o ADMIN
REQUEST_PROXY_SERVICE
    ↓ emit(REQUEST_PATTERNS.RESPONDER_SOLICITUD)
REQUEST_MICROSERVICE
    ↓ SolicitudesTecnicosController.responder()
SOLICITUDES_TECNICOS_SERVICE
    ↓ Transacción:
    ├─ Actualizar estadoAcuerdo (ACEPTADO/RECHAZADO)
    └─ Si ACEPTADO:
       ├─ Actualizar Solicitud.estadoSolicitud → ACEPTADA
       └─ Rechazar automáticamente otras propuestas
DATABASE
    ✅ Propuesta aceptada, solicitud marcada ACEPTADA
```

#### Detalles Técnicos

**Endpoint:** `POST /solicitudes-tecnicos/:id/responder`
```typescript
@Post('solicitudes-tecnicos/:id/responder')
@UseGuards(JwtAuthGuard)
responderSolicitudTecnico(
    @Param('id', ParseIntPipe) id: number,
    @Body() respuestaDto: ResponderSolicitudDto,
    @Request() req: any
): Observable<any>
```

**Lógica de Respuesta (SolicitudesTecnicosService.responder):**
```typescript
async responder(
  idSolTec: number,
  respuestaDto: ResponderSolicitudDto,
  currentUser: { idUser: number; rol: string }  // ⚠️ rol SINGULAR
) {
  const propuesta = await findOne(idSolTec);

  // 1️⃣ Validar permisos
  if (currentUser.rol !== 'ADMIN' && propuesta.solicitud.idUser !== currentUser.idUser) {
    // ⚠️ PROBLEMA: rol singular, pero schema define roles como array
    throw new ForbiddenException('No tienes permisos...');
  }

  // 2️⃣ Validar estado propuesta
  if (propuesta.estadoAcuerdo !== EstadoAceptacion.PROPUESTO) {
    throw new BadRequestException('Solo se puede responder a propuestas PROPUESTO');
  }

  // 3️⃣ Usar transacción para cambios atómicos
  return database.$transaction(async (prisma) => {
    // Actualizar propuesta
    const propuestaActualizada = await prisma.solicitudTecnico.update({
      where: { idSolTec },
      data: {
        estadoAcuerdo: respuestaDto.estadoAcuerdo,
        fechaConfirmada: new Date(),
        costoAcordado: respuestaDto.costoAcordado,
        notas: respuestaDto.notas
      },
      include: { solicitud: true }
    });

    // Si ACEPTADO, actualizar solicitud y rechazar otras propuestas
    if (respuestaDto.estadoAcuerdo === EstadoAceptacion.ACEPTADO) {
      // Cambiar solicitud a ACEPTADA
      await prisma.solicitud.update({
        where: { idSolicitud: propuesta.idSolicitud },
        data: {
          estadoSolicitud: EstadoSolicitud.ACEPTADA,
          updatedBy: currentUser.idUser
        }
      });

      // Rechazar automáticamente otras propuestas pendientes
      await prisma.solicitudTecnico.updateMany({
        where: {
          idSolicitud: propuesta.idSolicitud,
          idSolTec: { not: idSolTec },
          estadoAcuerdo: EstadoAceptacion.PROPUESTO
        },
        data: {
          estadoAcuerdo: EstadoAceptacion.RECHAZADO,
          fechaConfirmada: new Date()
        }
      });
    }

    return propuestaActualizada;
  });
}
```

---

## 🔐 SISTEMA DE ROLES Y PROTECCIÓN

### Definición de Roles (Schema Auth)

```prisma
// apps/auth/src/prismaClientAuth/schema.prisma
model Usuario {
  idUser        Int    @id @default(autoincrement())
  email         String @unique
  password      String
  nombre        String
  
  roles         RolUsuario[] @default([CLIENTE])  // ← ARRAY de roles
  
  isActive      Boolean @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum RolUsuario {
  ADMIN
  TECNICO
  CLIENTE
}
```

**Notar:** `roles` es ARRAY, pero el código en algunos lugares usa `rol` (singular)

### Guards en API Gateway

**RolesGuard (apps/api-gateway/src/auth/guards/roles.guard.ts):**
```typescript
canActivate(context: ExecutionContext): boolean {
  const requiredRoles = this.reflector.get<RolUsuario[]>(
    ROLES_KEY,
    context.getHandler()
  );

  if (!requiredRoles) {
    return true;  // Si no hay @Roles, permitir
  }

  const { user } = context.switchToHttp().getRequest();

  // ✅ Soporta ambos: array (roles) y singular (rol)
  const userRoles = user?.roles || (user?.rol ? [user.rol] : []);

  // Verificar si el usuario tiene AL MENOS UNO de los roles requeridos
  return requiredRoles.some((role) => userRoles.includes(role));
}
```

### Protección por Endpoint

| Endpoint | Método | Roles | Estado |
|----------|--------|-------|--------|
| `/request/solicitudes` | GET | `@Public()` | ⚠️ CRÍTICO: Sin protección |
| `/request/solicitudes` | POST | ADMIN, CLIENTE | ✅ Protegido |
| `/request/solicitudes/:id` | GET | `@UseGuards(JwtAuthGuard)` | ⚠️ Solo autenticación, sin rol |
| `/request/solicitudes/:id` | PUT | `@UseGuards(JwtAuthGuard)` | ⚠️ Solo autenticación |
| `/request/solicitudes/:id/cancel` | PUT | `@UseGuards(JwtAuthGuard)` | ⚠️ Solo autenticación |
| `/solicitudes-tecnicos` | GET | ADMIN | ✅ Protegido |
| `/solicitudes-tecnicos/my/propuestas` | GET | TECNICO | ✅ Protegido |
| `/solicitudes-tecnicos/postularse` | POST | TECNICO | ✅ Protegido |

---

## 🚨 PROBLEMAS DETECTADOS

### Problema #1: Inconsistencia rol Array vs Singular
**Severidad:** ⚠️ MAYOR

**Ubicación:**
- Schema Prisma: `roles RolUsuario[]` (ARRAY)
- SolicitudesTecnicosService.responder: `currentUser.rol` (SINGULAR)
- Varios servicios: Asumen rol singular

**Código Problemático:**
```typescript
// ❌ En SolicitudesTecnicosService.responder (línea ~115)
if (currentUser.rol !== 'ADMIN' && ...) {
  throw new ForbiddenException(...);
}

// ✅ Pero el RolesGuard espera array
const userRoles = user?.roles || (user?.rol ? [user.rol] : []);
```

**Impacto:**
- Si usuario tiene `roles: ['TECNICO', 'CLIENTE']`, la validación `currentUser.rol !== 'ADMIN'` no funcionará correctamente
- El usuario podría ser TECNICO pero no cumplir la lógica de rol singular

**Recomendación:** Unificar a usar SIEMPRE `roles` (array) o SIEMPRE `rol` (singular)

---

### Problema #2: GET /request/solicitudes Sin Protección de Rol
**Severidad:** ⚠️ CRÍTICA

**Ubicación:** API Gateway RequestController
```typescript
@Get('solicitudes')
@Public()  // ⚠️ SIN PROTECCIÓN
findAllSolicitudes(@Query() filterDto: any): Observable<any> {
  return this.requestProxyService.findAllSolicitudes(filterDto);
}
```

**Implicaciones:**
- Usuario NO autenticado puede ver TODAS las solicitudes
- Incluye datos sensibles: costos estimados, descripciones, ubicaciones
- Técnico que no está registrado puede ver solicitudes disponibles
- No hay filtrado por estado (retorna activas y canceladas)

**Riesgos:**
- Exposición de datos privados
- Scraping de solicitudes
- Análisis de mercado sin autorización

**Recomendación:** 
```typescript
@Get('solicitudes')
@Public()  // O cambiar a @UseGuards(JwtAuthGuard)
@Query('estado') estado?: string  // Filtrar por estado
findAllSolicitudes(@Query() filterDto: any): Observable<any>
```

---

### Problema #3: Cliente Puede Ver Propuestas que No Le Pertenecen
**Severidad:** ⚠️ CRÍTICA

**Ubicación:** Endpoint GET `/solicitudes-tecnicos/solicitud/:idSolicitud`
```typescript
@Get('solicitudes-tecnicos/solicitud/:idSolicitud')
@UseGuards(JwtAuthGuard)  // ⚠️ Solo autenticación, sin validar propiedad
findSolicitudesTecnicosBySolicitud(
  @Param('idSolicitud', ParseIntPipe) idSolicitud: number
): Observable<any> {
  return this.requestProxyService.findSolicitudesBySolicitud(idSolicitud);
}
```

**Flujo Problemático:**
1. Cliente A crea Solicitud #1
2. Cliente B obtiene JWT válido
3. Cliente B hace GET `/solicitudes-tecnicos/solicitud/1`
4. ❌ Ve TODAS las propuestas de la Solicitud #1, incluyendo costos de otros técnicos

**Código Vulnerable:**
```typescript
// En SolicitudesTecnicosService.findBySolicitud (línea ~165)
async findBySolicitud(idSolicitud: number) {
  // Verifica que solicitud existe
  const solicitud = await database.solicitud.findUnique({
    where: { idSolicitud, isActive: true }
  });

  if (!solicitud) {
    throw new NotFoundException(...);
  }

  // ⚠️ NO VALIDA QUE USUARIO SEA PROPIETARIO DE SOLICITUD
  return database.solicitudTecnico.findMany({
    where: { idSolicitud },
    orderBy: { fechaPropuesta: 'desc' }
  });
}
```

**Recomendación:**
```typescript
async findBySolicitud(idSolicitud: number, currentUser: {idUser: number; rol: string}) {
  const solicitud = await database.solicitud.findUnique({
    where: { idSolicitud, isActive: true }
  });

  if (!solicitud) {
    throw new NotFoundException(...);
  }

  // ✅ Validar propiedad o admin
  if (currentUser.rol !== 'ADMIN' && solicitud.idUser !== currentUser.idUser) {
    throw new ForbiddenException('No tienes permisos para ver estas propuestas');
  }

  return database.solicitudTecnico.findMany({
    where: { idSolicitud },
    orderBy: { fechaPropuesta: 'desc' }
  });
}
```

---

### Problema #4: Validación de Rol Singular en Lógica de Negocio
**Severidad:** ⚠️ MAYOR

**Ubicación:** SolicitudesService.update (línea ~80)
```typescript
async update(
  idSolicitud: number,
  updateSolicitudDto: UpdateSolicitudDto,
  currentUser: { idUser: number; rol: string }  // ⚠️ rol SINGULAR
) {
  const solicitud = await database.solicitud.findUnique({
    where: { idSolicitud }
  });

  // ❌ Asume rol es string singular
  if (currentUser.rol !== 'ADMIN' && solicitud.idUser !== currentUser.idUser) {
    throw new ForbiddenException('No tienes permisos para actualizar esta solicitud');
  }

  // ... actualizar ...
}
```

**Impacto:**
- Si schema define `roles` como array, pero código espera `rol` singular
- Usuario con múltiples roles puede tener comportamiento impredecible
- Validaciones pueden fallar silenciosamente

---

### Problema #5: Filtrado de Solicitudes PENDIENTES en Cliente
**Severidad:** ⚠️ MAYOR

**Ubicación:** Frontend `technician.service.ts`
```typescript
export async function getAvailableRequests(): Promise<Solicitud[]> {
  const url = getApiUrl('/request/solicitudes');
  const resp = await apiClient.get<unknown>(url);

  // ... unwrap response ...

  // ⚠️ FILTRADO EN CLIENTE
  return allRequests.filter(
    req => req.estadoSolicitud === EstadoSolicitud.PENDIENTE
  );
}
```

**Problemas:**
1. Backend retorna TODAS las solicitudes sin filtrar
2. Si cliente cambia estado antes de cargar, técnico ve datos incorrectos
3. API ineficiente: transferencia de datos innecesarios
4. Si el filtrado JS falla, técnico ve solicitudes aceptadas/canceladas

**Recomendación:** Filtrar en backend
```typescript
// Opción 1: Parámetro query
GET /request/solicitudes?estado=PENDIENTE

// Opción 2: Endpoint específico
GET /request/solicitudes/disponibles
```

---

## 📊 TABLA DE FLUJOS Y ESTADOS

### Estados Posibles de Solicitud

```
┌─────────────────────────────────────────────────┐
│  Solicitud Estados (EstadoSolicitud)            │
├─────────────────────────────────────────────────┤
│  PENDIENTE          → Esperando propuestas       │
│  ACEPTADA           → Técnico aceptado          │
│  EN_PROGRESO        → Trabajo iniciado          │
│  COMPLETADA         → Trabajo finalizado        │
│  CANCELADA          → Cliente canceló           │
│  NO_ASIGNADA        → Sin propuestas recibidas  │
└─────────────────────────────────────────────────┘
```

### Estados Posibles de Propuesta

```
┌─────────────────────────────────────────────────┐
│  Propuesta Estados (EstadoAceptacion)           │
├─────────────────────────────────────────────────┤
│  PROPUESTO          → Técnico se postó          │
│  ACEPTADO           → Cliente aceptó            │
│  RECHAZADO          → Cliente rechazó           │
└─────────────────────────────────────────────────┘
```

### Transiciones de Estado Válidas

**Solicitud PENDIENTE →**
```
    Cliente rechaza todas propuestas
    ↓
    CANCELADA
    
    O
    
    Cliente acepta una propuesta
    ↓
    ACEPTADA → EN_PROGRESO → COMPLETADA
```

**Propuesta PROPUESTO →**
```
    Cliente la acepta
    ↓
    ACEPTADO
    
    O
    
    Cliente la rechaza
    ↓
    RECHAZADO
    
    O (automático)
    
    Si otra propuesta fue aceptada, ésta se rechaza automáticamente
```

---

## 🔍 ANÁLISIS DE ROLES POR OPERACIÓN

### Crear Solicitud
```
PERMITIDO:
  ✅ ADMIN   → Puede crear para cualquier usuario (si implementado)
  ✅ CLIENTE → Puede crear propias solicitudes

DENEGADO:
  ❌ TECNICO → No puede crear solicitudes
```

### Listar Solicitudes Disponibles
```
PERMITIDO:
  ✅ TECNICO    → Ver solicitudes PENDIENTE para postularse
  ⚠️ CLIENTE    → Podría ver pero sin filtrado
  ⚠️ ADMIN      → Sin restricción
  ⚠️ NO AUTENTICADO → @Public() permite acceso

DENEGADO:
  ❌ (Ninguno formalmente, pero debería haber restricción)
```

### Ver Propuestas de una Solicitud
```
PERMITIDO:
  ✅ ADMIN   → Ver todas las propuestas
  ✅ CLIENTE → Ver propuestas de sus PROPIAS solicitudes

DENEGADO:
  ❌ TECNICO → No debería ver propuestas de solicitud ajena
  ❌ CLIENTE → No debería ver propuestas de solicitud de OTRO cliente
```

### Responder Propuesta
```
PERMITIDO:
  ✅ ADMIN   → Aceptar/rechazar cualquier propuesta
  ✅ CLIENTE → Aceptar/rechazar propuestas de PROPIAS solicitudes

DENEGADO:
  ❌ TECNICO → No puede responder propuestas
```

### Listar Mis Propuestas
```
PERMITIDO:
  ✅ TECNICO → Ver sus PROPIAS propuestas
  
FLUJO:
  1. @Roles(TECNICO) → Valida que es técnico
  2. Obtiene idUser del JWT
  3. Busca técnico asociado
  4. Retorna propuestas de ese técnico
```

---

## 📈 FLUJOS COMPLETOS CON EJEMPLOS

### Ejemplo 1: Cliente Crea Solicitud y Técnico se Postula

```
PASO 1: Cliente Crea Solicitud
────────────────────────────────
Cliente A: POST /request/solicitudes
  {
    "tituloProblema": "Reparar aire acondicionado",
    "descripcionProblema": "No enciende",
    "costoEstimado": 150,
    "duracionEstimadaMin": 30,
    "categoriasProblema": ["CLIMATIZACION"]
  }
  
JWT: {idUser: 1, email: "clientea@test.com", roles: ["CLIENTE"]}

RequestController.createSolicitud()
  ├─ RolesGuard.canActivate()
  │  └─ Verifica roles: ["CLIENTE"] ⊆ ["ADMIN", "CLIENTE"] ✅
  └─ RequestProxyService.createSolicitud(dto, 1)
     └─ emit(CREATE_SOLICITUD, {dto, idUser: 1})
        └─ SolicitudesService.create()
           └─ DB: INSERT solicitud {
                idUser: 1,
                estadoSolicitud: "PENDIENTE",
                ...
              }
           
RESULTADO: Solicitud #42 PENDIENTE creada

────────────────────────────────────────────────────────────────

PASO 2: Técnico Ve Solicitud Disponible
────────────────────────────────────────
Técnico B: GET /request/solicitudes
  
RequestController.findAllSolicitudes()
  ├─ @Public() → Sin protección ⚠️
  └─ RequestProxyService.findAllSolicitudes()
     └─ SolicitudesService.findAll()
        └─ DB: SELECT * FROM solicitud WHERE isActive=true
           RETORNA: [Solicitud#42 (PENDIENTE), Solicitud#41 (CANCELADA), ...]
           
Frontend (technician.service.ts):
  └─ Filtra por PENDIENTE
     RETORNA A UI: [Solicitud#42]

────────────────────────────────────────────────────────────────

PASO 3: Técnico se Postula
──────────────────────────
Técnico B: POST /solicitudes-tecnicos/postularse
  {
    "idSolicitud": 42,
    "costoAcordado": 120,
    "notas": "Puedo hacerlo hoy"
  }
  
JWT: {idUser: 2, email: "tecnicob@test.com", roles: ["TECNICO"]}

RequestController.postularse()
  ├─ RolesGuard.canActivate()
  │  └─ Verifica roles: ["TECNICO"] ⊆ ["TECNICO"] ✅
  └─ RequestProxyService.postularse(dto, idTecnico)
     └─ Obtiene idTecnico desde BD usando idUser
        └─ emit(POSTULARSE_SOLICITUD, {dto, idTecnico: 5})
           └─ SolicitudesTecnicosService.postularse()
              ├─ DB: SELECT solicitud WHERE idSolicitud=42 AND isActive=true
              │  └─ Verifica estadoSolicitud="PENDIENTE" ✅
              │
              ├─ DB: SELECT solicitudTecnico 
              │  WHERE idSolicitud=42 AND idTecnico=5
              │  └─ No existe (primera postulación) ✅
              │
              └─ DB: INSERT solicitudTecnico {
                   idSolicitud: 42,
                   idTecnico: 5,
                   estadoAcuerdo: "PROPUESTO",
                   costoAcordado: 120,
                   notas: "Puedo hacerlo hoy"
                 }
           
RESULTADO: Propuesta #101 PROPUESTO creada

────────────────────────────────────────────────────────────────

PASO 4: Cliente Acepta Propuesta
────────────────────────────────
Cliente A: POST /solicitudes-tecnicos/101/responder
  {
    "estadoAcuerdo": "ACEPTADO",
    "costoAcordado": 120
  }
  
JWT: {idUser: 1, ...}

RequestController.responderSolicitudTecnico()
  ├─ RolesGuard.canActivate() → Sin @Roles, se permite ✅
  └─ RequestProxyService.responderSolicitudTecnico()
     └─ emit(RESPONDER_SOLICITUD, {id, dto, currentUser})
        └─ SolicitudesTecnicosService.responder()
           ├─ DB: SELECT solicitudTecnico WHERE idSolTec=101
           │  └─ Obtiene propuesta + solicitud asociada
           │
           ├─ Validar permisos:
           │  └─ currentUser.rol !== 'ADMIN' ⚠️ (PROBLEMA: rol singular)
           │  └─ solicitud.idUser !== currentUser.idUser
           │  └─ Si ambas false, permitir ✅
           │
           └─ TRANSACCIÓN:
              ├─ DB: UPDATE solicitudTecnico SET 
              │     estadoAcuerdo="ACEPTADO",
              │     fechaConfirmada=NOW()
              │
              ├─ DB: UPDATE solicitud SET 
              │     estadoSolicitud="ACEPTADA",
              │     updatedBy=1
              │
              └─ DB: UPDATE solicitudTecnico SET 
                    estadoAcuerdo="RECHAZADO"
                  WHERE idSolicitud=42 
                    AND idSolTec ≠ 101 
                    AND estadoAcuerdo="PROPUESTO"
              
RESULTADO:
  ✅ Propuesta #101: PROPUESTO → ACEPTADO
  ✅ Solicitud #42: PENDIENTE → ACEPTADA
  ✅ Otras propuestas: PROPUESTO → RECHAZADO (automáticamente)
```

---

## 🎓 CASOS DE USO CRÍTICOS

### Caso 1: ¿Puede Cliente A Ver Propuestas de Solicitud de Cliente B?

```
Cliente A obtiene JWT válido
Cliente A: GET /solicitudes-tecnicos/solicitud/5
  Donde Solicitud #5 fue creada por Cliente B

SolicitudesService.findBySolicitud(5)
  ├─ Verifica solicitud existe ✅
  └─ ⚠️ NO VALIDA QUE Cliente A SEA DUEÑO
  └─ DB: SELECT * FROM solicitudTecnico WHERE idSolicitud=5
         RETORNA: Todas las propuestas (incluyendo costos de técnicos)

RESULTADO: ❌ FALLO DE SEGURIDAD - Cliente A ve datos privados
```

### Caso 2: ¿Puede Técnico A Ver Solicitudes de Otros Técnicos?

```
Técnico A: GET /solicitudes-tecnicos/my/propuestas

RequestController.findMyProposals(req)
  ├─ RolesGuard: @Roles(TECNICO) ✅
  ├─ TechnicianProxyService.findTechnicianByUserId(1)
  │  └─ Obtiene idTecnico del usuario ✅
  │
  └─ RequestProxyService.findSolicitudesByTecnico(idTecnico=3)
     └─ DB: SELECT * FROM solicitudTecnico WHERE idTecnico=3
            RETORNA: Solo propuestas de Técnico A ✅

RESULTADO: ✅ OK - Solo ve sus propias propuestas
```

### Caso 3: ¿Qué Pasa si Técnico Intenta Postularse Dos Veces?

```
Técnico A intenta postularse a Solicitud #5 dos veces

Primera postulación:
  DB: INSERT solicitudTecnico (idSolicitud=5, idTecnico=3)
  RESULTADO: ✅ Propuesta #99 creada

Segunda postulación:
  SolicitudesTecnicosService.postularse(5, 3)
  ├─ DB: SELECT solicitudTecnico 
  │  WHERE idSolicitud_idTecnico = (5, 3)
  │  EXISTE: Propuesta #99 ✅
  └─ throw ConflictException('Ya te has postulado...')
  
RESULTADO: ✅ OK - Previene duplicados
```

### Caso 4: ¿Qué Pasa si Cliente Acepta Después de Cancelar?

```
Solicitud #5 está PENDIENTE
Cliente crea Solicitud #5
Dos técnicos se postilan: Propuesta #10 y #11 (ambas PROPUESTO)

Escenario A - Cliente la cancela después:
  Cliente: PUT /request/solicitudes/5/cancel
  DB: UPDATE solicitud SET estadoSolicitud="CANCELADA"
  
  Ahora si Cliente intenta:
    POST /solicitudes-tecnicos/10/responder {estadoAcuerdo: ACEPTADO}
    
    SolicitudesTecnicosService.responder()
      └─ Pero la solicitud ya está CANCELADA
      └─ ¿Qué pasa? ⚠️ NO VALIDADO
      
RESULTADO: ⚠️ POSIBLE INCONSISTENCIA
  - Propuesta se marca ACEPTADO
  - Solicitud ya está CANCELADA
  - Técnico espera trabajo que fue cancelado
```

---

## 📋 MATRIZ DE PERMISOS

| Operación | ADMIN | CLIENTE | TECNICO | NO AUTH |
|-----------|-------|---------|---------|---------|
| Crear Solicitud | ✅ | ✅ | ❌ | ❌ |
| Ver Todas Solicitudes | ✅ | ⚠️ | ⚠️ | ⚠️ |
| Ver Mis Solicitudes | ✅ | ✅ | ❌ | ❌ |
| Actualizar Solicitud Propia | ✅ | ✅ | ❌ | ❌ |
| Cancelar Solicitud Propia | ✅ | ✅ | ❌ | ❌ |
| Ver Propuestas (cualquiera) | ✅ | ❌ | ❌ | ❌ |
| Ver Propuestas Propias (cliente) | ✅ | ✅* | ❌ | ❌ |
| Ver Mis Propuestas (técnico) | ✅ | ❌ | ✅ | ❌ |
| Postularse | ❌ | ❌ | ✅ | ❌ |
| Responder Propuesta | ✅ | ✅* | ❌ | ❌ |

**Leyenda:**
- ✅ = Permitido y validado
- ❌ = Denegado
- ⚠️ = Permitido pero sin validación adecuada
- `*` = Solo para recursos propios

---

## 🎯 RESUMEN DE RECOMENDACIONES

### Críticas (Implementar Inmediatamente)
1. ✅ **Validar propiedad en GET `/solicitudes-tecnicos/solicitud/:id`**
   - Verificar que usuario es cliente propietario o admin

2. ✅ **Proteger GET `/request/solicitudes`**
   - Requiere autenticación
   - Filtrar por `estadoSolicitud = PENDIENTE`
   - Opcional: Filtrar por ubicación/categoría

3. ✅ **Validar estado solicitud en responder propuesta**
   - Rechazar si solicitud es CANCELADA/COMPLETADA

### Mayores (Implementar Pronto)
4. ⚠️ **Unificar uso de roles (array vs singular)**
   - Usar siempre `roles: RolUsuario[]`
   - Actualizar todos los servicios

5. ⚠️ **Mover filtrado de PENDIENTE al backend**
   - Query param: `?estado=PENDIENTE`
   - O endpoint específico: `GET /solicitudes/disponibles`

6. ⚠️ **Agregar validación en actualizar solicitud**
   - Solo cliente propietario o admin
   - Solo si está en estado PENDIENTE

### Menores (Considerar)
7. ℹ️ **Agregar auditoría de cambios**
   - Quién aceptó, cuándo, desde qué IP
   
8. ℹ️ **Considerar soft delete para solicitudes**
   - Marcar como deleted en lugar de hard delete

---

## 🏁 CONCLUSIÓN

El sistema de solicitudes y roles tiene **dos vulnerabilidades críticas** (sin validación de propiedad, endpoints públicos) y **tres inconsistencias mayores** (rol singular vs array, validación estado incompleta, filtrado en cliente).

La arquitectura de flujos es sólida (transacciones, índices únicos, escalabilidad), pero necesita **refuerzo en validación de acceso y consistencia de datos**.

**Prioridad:** Implementar validaciones de seguridad antes de escalar.


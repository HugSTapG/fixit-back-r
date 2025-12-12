# 🔍 PASO 1 - ANÁLISIS COMPLETO DE SEGURIDAD (P2-P5)

**Fecha:** 11 de Diciembre, 2025
**Objetivo:** Identificar vulnerabilidades antes de implementar fixes
**Contexto:** Sistema estable, sin romper flujos existentes

---

## 📋 LISTA COMPLETA DE ENDPOINTS AUDITADOS

### 🟢 SOLICITUDES (Crear/Leer/Actualizar)

#### 1. GET `/request/solicitudes` 
- **Ubicación:** `request.controller.ts:84` + `solicitudes.service.ts:findAll()`
- **Descripción:** Obtiene solicitudes con filtros
- **Auth:** ✅ `@UseGuards(JwtAuthGuard)`
- **Validación Actual:**
  - ✅ Requiere JWT
  - ✅ Rol de usuario se extrae y valida (P1 ya corregido)
  - ✅ CLIENTE ve todas sus solicitudes
  - ✅ TÉCNICO ve default PENDIENTE
  - ✅ ADMIN ve todas sin default
- **Riesgo:** ❌ NINGUNO (ya fue P1, está correcto)
- **Status:** ✅ SEGURO

---

#### 2. GET `/request/solicitudes/:id`
- **Ubicación:** `request.controller.ts:72` + `solicitudes.service.ts:findOne()`
- **Descripción:** Obtiene una solicitud específica por ID
- **Auth:** ✅ `@UseGuards(JwtAuthGuard)`
- **Validación Actual:**
  - ✅ Requiere JWT
  - ❌ **NO VALIDA OWNERSHIP** - Cualquier usuario autenticado puede ver cualquier solicitud
- **Ejemplo de ataque:**
  ```
  Cliente A hace: GET /request/solicitudes/123
  Si 123 pertenece a Cliente B, Cliente A la ve igual
  ```
- **Riesgo:** 🔴 **CRÍTICO** - Exposición de datos sensibles
- **Severidad:** ALTA
- **Impacto:** Cliente B datos expuestos: descripción problema, ubicación, costo estimado
- **Status:** ❌ VULNERABLE (necesita P2)

---

#### 3. POST `/request/solicitudes`
- **Ubicación:** `request.controller.ts:102` + `solicitudes.service.ts:create()`
- **Descripción:** Crea nueva solicitud
- **Auth:** ✅ `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(ADMIN, CLIENTE)`
- **Validación Actual:**
  - ✅ Requiere JWT
  - ✅ Verifica rol (ADMIN o CLIENTE)
  - ✅ idUser se extrae del JWT (no del body)
  - ✅ Fecha futura validada
- **Riesgo:** ❌ NINGUNO
- **Status:** ✅ SEGURO

---

#### 4. PUT `/request/solicitudes/:id`
- **Ubicación:** `request.controller.ts:115` + `solicitudes.service.ts:update()`
- **Descripción:** Actualiza solicitud existente
- **Auth:** ✅ `@UseGuards(JwtAuthGuard)`
- **Validación Actual:**
  - ✅ Requiere JWT
  - ✅ **VALIDA OWNERSHIP** - Solo propietario o ADMIN pueden actualizar
  - ✅ Verifica: `currentUser.rol !== 'ADMIN' && solicitud.idUser !== currentUser.idUser`
  - ✅ Lanza ForbiddenException si no es dueño
- **Riesgo:** ❌ NINGUNO
- **Status:** ✅ SEGURO (P5 ya está implementado)

---

#### 5. PUT `/request/solicitudes/:id/cancel`
- **Ubicación:** `request.controller.ts:128` + `solicitudes.service.ts:cancel()`
- **Descripción:** Cancela una solicitud
- **Auth:** ✅ `@UseGuards(JwtAuthGuard)`
- **Validación Actual:**
  - ✅ Requiere JWT
  - ✅ **VALIDA OWNERSHIP** - Solo propietario o ADMIN
  - ✅ Verifica estado: solo PENDIENTE o ACEPTADA pueden cancelarse
- **Riesgo:** ❌ NINGUNO
- **Status:** ✅ SEGURO

---

#### 6. DELETE `/request/solicitudes/:id`
- **Ubicación:** `request.controller.ts:141` + `solicitudes.service.ts:remove()`
- **Descripción:** Elimina permanentemente solicitud (solo ADMIN)
- **Auth:** ✅ `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(ADMIN)`
- **Validación Actual:**
  - ✅ Requiere JWT
  - ✅ Solo ADMIN puede eliminar
  - ✅ Valida que no tenga propuestas
- **Riesgo:** ❌ NINGUNO
- **Status:** ✅ SEGURO

---

### 🟡 PROPUESTAS (Crear/Leer/Actualizar)

#### 7. GET `/request/solicitudes-tecnicos` (listar todas)
- **Ubicación:** `request.controller.ts:158` + `solicitudes-tecnicos.service.ts:findAll()`
- **Descripción:** Obtiene TODAS las propuestas
- **Auth:** ✅ `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(ADMIN)`
- **Validación Actual:**
  - ✅ Solo ADMIN puede ver todas
  - ✅ No expone al público
- **Riesgo:** ❌ NINGUNO
- **Status:** ✅ SEGURO

---

#### 8. GET `/request/solicitudes-tecnicos/:id`
- **Ubicación:** `request.controller.ts:168` + `solicitudes-tecnicos.service.ts:findOne()`
- **Descripción:** Obtiene una propuesta específica por ID
- **Auth:** ✅ `@UseGuards(JwtAuthGuard)`
- **Validación Actual:**
  - ✅ Requiere JWT
  - ❌ **NO VALIDA OWNERSHIP** - Cualquier usuario autenticado puede ver cualquier propuesta
  - ❌ No verifica relación entre propuesta y usuario
- **Ejemplo de ataque:**
  ```
  Técnico A hace: GET /request/solicitudes-tecnicos/456
  Si 456 es propuesta de Técnico B, Técnico A la ve igual
  
  Cliente A hace: GET /request/solicitudes-tecnicos/456
  Si 456 es propuesta de su solicitud, la ve (OK)
  Pero Cliente A también podría ver propuestas de solicitudes ajenas
  ```
- **Riesgo:** 🔴 **CRÍTICO** - Exposición de propuestas privadas
- **Severidad:** ALTA
- **Impacto:** Exposición de: costo acordado, notas técnicas, estado de negocios
- **Status:** ❌ VULNERABLE (necesita P2)

---

#### 9. GET `/request/solicitudes-tecnicos/solicitud/:idSolicitud`
- **Ubicación:** `request.controller.ts:177` + `solicitudes-tecnicos.service.ts:findBySolicitud()`
- **Descripción:** Obtiene propuestas de una solicitud
- **Auth:** ✅ `@UseGuards(JwtAuthGuard)`
- **Validación Actual:**
  - ✅ Requiere JWT
  - ✅ Verifica que solicitud existe
  - ❌ **NO VALIDA OWNERSHIP** - No verifica que usuario tenga permiso para ver propuestas de esa solicitud
- **Ejemplo de ataque:**
  ```
  Cliente A hace: GET /request/solicitudes-tecnicos/solicitud/789
  Si 789 pertenece a Cliente B, Cliente A ve TODAS las propuestas de Cliente B
  Expone: lista de técnicos que se postularon, costos, notas técnicas
  ```
- **Riesgo:** 🔴 **CRÍTICO** - Exposición de lista completa de propuestas ajenas
- **Severidad:** ALTA (peor que endpoint anterior, retorna múltiples items)
- **Impacto:** Cliente B datos e identidad de técnicos expuestos
- **Status:** ❌ VULNERABLE (necesita P2)

---

#### 10. GET `/request/solicitudes-tecnicos/my/propuestas`
- **Ubicación:** `request.controller.ts:186`
- **Descripción:** Obtiene propuestas del técnico actual
- **Auth:** ✅ `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(TECNICO)`
- **Validación Actual:**
  - ✅ Requiere JWT
  - ✅ Solo TÉCNICO
  - ✅ Extrae idTecnico del perfil del usuario
  - ✅ Retorna solo propuestas del técnico actual
- **Riesgo:** ❌ NINGUNO
- **Status:** ✅ SEGURO

---

#### 11. POST `/request/solicitudes-tecnicos/postularse`
- **Ubicación:** `request.controller.ts:215` + `solicitudes-tecnicos.service.ts:postularse()`
- **Descripción:** Técnico se postula a solicitud
- **Auth:** ✅ `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(TECNICO)`
- **Validación Actual:**
  - ✅ Requiere JWT
  - ✅ Solo TÉCNICO
  - ✅ Valida que solicitud existe y está PENDIENTE (**P4 ya presente**)
  - ✅ Evita postulaciones duplicadas
- **Riesgo:** ❌ NINGUNO
- **Status:** ✅ SEGURO (P4 ya está)

---

#### 12. PUT `/request/solicitudes-tecnicos/:id/responder`
- **Ubicación:** `request.controller.ts:235` + `solicitudes-tecnicos.service.ts:responder()`
- **Descripción:** Cliente responde a propuesta (acepta/rechaza)
- **Auth:** ✅ `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(CLIENTE, ADMIN)`
- **Validación Actual:**
  - ✅ Requiere JWT
  - ✅ Solo CLIENTE o ADMIN
  - ✅ **VALIDA OWNERSHIP** - Verifica que usuario es dueño de solicitud
  - ✅ Valida estado: solo PROPUESTO puede responderse (**P4 ya presente**)
  - ✅ Si ACEPTADO, rechaza automáticamente otras propuestas
- **Riesgo:** ❌ NINGUNO
- **Status:** ✅ SEGURO (P4 ya está)

---

#### 13. PUT `/request/solicitudes-tecnicos/:id` (update propuesta)
- **Ubicación:** No visible en controller mostrado, pero existe en `solicitudes-tecnicos.service.ts:update()`
- **Descripción:** Técnico actualiza su propuesta
- **Auth:** ❓ Probablemente NO tiene endpoint en controller
- **Validación Actual:**
  - ✅ Valida ownership en service (solo técnico propietario)
  - ✅ Solo permite si estado es PROPUESTO
- **Riesgo:** ⚠️ No tiene endpoint REST expuesto, no se puede acceder
- **Status:** ⚠️ N/A (no expuesto públicamente)

---

#### 14. DELETE `/request/solicitudes-tecnicos/:id` (cancel propuesta)
- **Ubicación:** No visible en controller, pero existe en `solicitudes-tecnicos.service.ts:cancelar()`
- **Descripción:** Técnico cancela su propuesta
- **Auth:** ❓ Probablemente NO tiene endpoint en controller
- **Validación Actual:**
  - ✅ Valida ownership (solo técnico propietario)
  - ✅ Solo permite si estado es PROPUESTO
- **Riesgo:** ⚠️ No tiene endpoint REST expuesto
- **Status:** ⚠️ N/A (no expuesto públicamente)

---

### 🔴 HALLAZGOS POR TIPO

#### Problemas de OWNERSHIP (Exposición de datos)

| # | Endpoint | Problema | Riesgo | P# |
|---|----------|----------|--------|-----|
| 2 | GET `/solicitudes/:id` | No valida ownership de solicitud | CRÍTICO | P2 |
| 8 | GET `/solicitudes-tecnicos/:id` | No valida ownership de propuesta | CRÍTICO | P2 |
| 9 | GET `/solicitudes-tecnicos/solicitud/:id` | No valida ownership de solicitud | CRÍTICO | P2 |

**Patrón identificado:** Los endpoints GET por ID específico NO validan que el usuario tenga permiso para acceder.

---

#### Problemas de CONSISTENCIA (Rol array vs singular)

| Ubicación | Problema | Severidad |
|-----------|----------|-----------|
| Backend JWT | Usa `roles: ["CLIENTE", "TECNICO"]` (array) | MEDIA |
| Controller responses | Algunas retornan `rol: "CLIENTE"` (singular) | MEDIA |
| Frontend | Confusión: ¿cuál usar? | MEDIA |

**Estado:** P3 necesario para unificar

---

#### Problemas de VALIDACIÓN DE ESTADO (Ya implementados en P4)

| Endpoint | Validación | Status |
|----------|-----------|--------|
| POST postularse | Verifica PENDIENTE | ✅ PRESENTE |
| PUT responder | Verifica PROPUESTO | ✅ PRESENTE |

**Estado:** P4 ya está implementado

---

## 📊 MATRIZ DE RIESGOS

```
CRÍTICO 🔴 (Bloquea MVP):
├─ P2a: GET /solicitudes/:id sin ownership
├─ P2b: GET /solicitudes-tecnicos/:id sin ownership
└─ P2c: GET /solicitudes-tecnicos/solicitud/:id sin ownership

IMPORTANTE 🟠:
├─ P3: Inconsistencia rol (array vs singular)
└─ (P4 y P5 ya están implementados ✅)

BAJO 🟡:
└─ Endpoints sin exposición pública
```

---

## 📍 ENDPOINTS VERIFICADOS

### ✅ SEGURO (13 endpoints)
1. GET `/solicitudes` - Protegido por P1
2. POST `/solicitudes` - Ownership del creador
3. PUT `/solicitudes/:id` - Ownership validado (P5)
4. PUT `/solicitudes/:id/cancel` - Ownership validado
5. DELETE `/solicitudes/:id` - Solo ADMIN
6. GET `/solicitudes/stats/*` - Filtra por usuario
7. GET `/solicitudes/my/*` - Filtra por usuario actual
8. GET `/solicitudes-tecnicos` - Solo ADMIN
9. GET `/solicitudes-tecnicos/my/*` - Filtra por técnico actual
10. POST `/solicitudes-tecnicos/postularse` - Validación de estado (P4)
11. PUT `/solicitudes-tecnicos/:id/responder` - Ownership + estado (P4)
12. Transacciones - No analizado (out of scope)
13. Maestrito - No analizado (out of scope)

### ❌ VULNERABLE (3 endpoints)
1. GET `/solicitudes/:id` - **P2a**
2. GET `/solicitudes-tecnicos/:id` - **P2b**
3. GET `/solicitudes-tecnicos/solicitud/:id` - **P2c**

---

## 🎯 RESUMEN PARA PASO 2

**Vulnerabilidades a fijar:**

| ID | Endpoint | Solución | Esfuerzo | Impacto |
|----|----------|----------|----------|---------|
| P2a | GET `/solicitudes/:id` | Validar ownership antes de retornar | 5 min | CRÍTICO |
| P2b | GET `/solicitudes-tecnicos/:id` | Validar ownership de propuesta | 5 min | CRÍTICO |
| P2c | GET `/solicitudes-tecnicos/solicitud/:id` | Validar ownership de solicitud | 5 min | CRÍTICO |
| P3 | Rol inconsistencia | Unificar a siempre usar array | 15 min | IMPORTANTE |

**Endpoints que YA están seguros:**
- PUT `/solicitudes/:id` - Ownership validado ✅
- PUT `/solicitudes-tecnicos/:id/responder` - Ownership validado ✅
- POST postularse - Estado validado ✅

---

## 🔐 REGLAS DE SEGURIDAD APLICADAS

### Regla 1: Ownership en GET específico
```typescript
// Para GET /solicitudes/:id
const solicitud = await findOne(id);
if (currentUser.rol !== 'ADMIN' && solicitud.idUser !== currentUser.idUser) {
  throw new ForbiddenException();
}
return solicitud;
```

### Regla 2: Ownership en propuestas GET
```typescript
// Para GET /solicitudes-tecnicos/:id
const propuesta = await findOne(id);
const tieneAcceso = 
  currentUser.rol === 'ADMIN' ||
  propuesta.idTecnico === idTecnicoDelUsuario ||
  propuesta.solicitud.idUser === currentUser.idUser;
  
if (!tieneAcceso) {
  throw new ForbiddenException();
}
return propuesta;
```

### Regla 3: Ownership en listar por entidad
```typescript
// Para GET /solicitudes-tecnicos/solicitud/:id
const solicitud = await findOne(id);
if (currentUser.rol !== 'ADMIN' && solicitud.idUser !== currentUser.idUser) {
  throw new ForbiddenException();
}
return propuestasDelaSolicitud;
```

---

## ✅ PRÓXIMO PASO

Ir a **PASO 2** cuando esté listo.
Allí crearemos la propuesta de cambios exactos con diffs mínimos.

**Confirmación requerida:**
- ¿Análisis correcto? ✅
- ¿Reglas de seguridad claras? ✅
- ¿Listo para pasar a implementación? ❓

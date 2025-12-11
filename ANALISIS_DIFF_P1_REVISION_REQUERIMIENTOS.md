# 📋 ANÁLISIS DIFF P1 - REVISIÓN DE REQUERIMIENTOS

**Estado:** PENDIENTE DE APROBACIÓN
**Fecha:** 11 de Diciembre de 2025
**Prioridad:** CRÍTICA - Requiere corrección antes de continuar

---

## 📊 DIFF COMPLETO DE CAMBIOS REALIZADOS

### 1️⃣ ARCHIVO: `apps/api-gateway/src/controllers/request.controller.ts`

#### ✅ CAMBIOS APLICADOS:
```diff
--- ANTES (Original)
+++ DESPUÉS (Actual - P1)

@@ Imports @@
-import { BadRequestException } from '@nestjs/common';
+import { BadRequestException, DefaultValuePipe } from '@nestjs/common';
-import { Public, Roles, RolUsuario } from '@app/shared';
+import { Public, Roles, RolUsuario, EstadoSolicitud } from '@app/shared';

@@ Decoradores y Guarda @@
     /**
      * Obtiene todas las solicitudes con filtros opcionales
+     * Requiere autenticación - Por defecto retorna PENDIENTE
      */
     @Get('solicitudes')
-    @Public()
-    findAllSolicitudes(@Query() filterDto: any): Observable<any> {
-        return this.requestProxyService.findAllSolicitudes(filterDto);
+    @UseGuards(JwtAuthGuard)
+    @Query('estado', new DefaultValuePipe(EstadoSolicitud.PENDIENTE))
+    findAllSolicitudes(
+        @Query() filterDto: any,
+        @Query('estado') estado?: EstadoSolicitud
+    ): Observable<any> {
+        return this.requestProxyService.findAllSolicitudes({...filterDto, estado});
     }
```

**¿QUÉ CAMBIÓ?**
- ❌ Removido: `@Public()` - Ahora requiere autenticación
- ✅ Agregado: `@UseGuards(JwtAuthGuard)` - Solo usuarios autenticados
- ✅ Agregado: `DefaultValuePipe` con `EstadoSolicitud.PENDIENTE`
- ✅ Agregado: Parámetro `estado` a la firma del método
- ✅ Agregado: Spread operator para pasar `estado` al proxy

---

### 2️⃣ ARCHIVO: `apps/api-gateway/src/proxy/services/request-proxy.service.ts`

#### ✅ CAMBIOS APLICADOS:
```diff
--- ANTES (Original)
+++ DESPUÉS (Actual - P1)

@@ Imports @@
-import { REQUEST_PATTERNS, MAESTRITO_PATTERNS } from '@app/events';
+import { REQUEST_PATTERNS, MAESTRITO_PATTERNS, EstadoSolicitud } from '@app/events';

@@ Método findAllSolicitudes @@
     // === SOLICITUDES ===
     findAllSolicitudes(filterDto?: any): Observable<any> {
-        return this.sendToRequest(REQUEST_PATTERNS.FIND_ALL_SOLICITUDES, { filterDto });
+        // ✅ Asegurar que siempre hay estado (default PENDIENTE desde controller)
+        const payload = {
+            ...filterDto,
+            estado: filterDto?.estado || EstadoSolicitud.PENDIENTE
+        };
+        return this.sendToRequest(REQUEST_PATTERNS.FIND_ALL_SOLICITUDES, payload);
     }
```

**¿QUÉ CAMBIÓ?**
- ✅ Agregado: Import de `EstadoSolicitud`
- ❌ Removido: Estructura `{ filterDto }` (pasaba objeto envuelto)
- ✅ Agregado: Destructuring de `filterDto` con spread operator
- ✅ Agregado: Lógica de default `estado || EstadoSolicitud.PENDIENTE`
- ✅ Cambio: Ahora pasa `payload` directamente en lugar de `{ filterDto }`

---

### 3️⃣ ARCHIVO: `apps/request/src/services/solicitudes.service.ts`

#### ✅ CAMBIOS APLICADOS:
```diff
--- ANTES (Original)
+++ DESPUÉS (Actual - P1)

@@ Docstring @@
     /**
      * Obtiene todas las solicitudes con filtros opcionales
+     * Por defecto retorna solo PENDIENTE si no se especifica estado
      */

@@ Lógica del where clause @@
         const where: any = {
             isActive: true
         };
 
+        // ✅ P1 FIX: Por defecto filtrar por PENDIENTE si no se especifica estado
         if (estadoSolicitud) {
             where.estadoSolicitud = estadoSolicitud;
+        } else {
+            // Default: Solo PENDIENTE
+            where.estadoSolicitud = EstadoSolicitud.PENDIENTE;
+        }
```

**¿QUÉ CAMBIÓ?**
- ✅ Agregado: Docstring actualizando comportamiento
- ❌ Removido: Condición que permitía omitir `estadoSolicitud`
- ✅ Agregado: Else clause con default a `EstadoSolicitud.PENDIENTE`
- ⚠️ PROBLEMA: **Fuerza SIEMPRE a devolver solo PENDIENTE por defecto**

---

### 4️⃣ ARCHIVO: `src/services/technician.service.ts` (Frontend)

#### ✅ CAMBIOS APLICADOS:
```diff
--- ANTES (Original)
+++ DESPUÉS (Actual - P1)

@@ Comentario @@
-// ✅ ACTUALIZADO: Usa la ruta correcta del backend
+// ✅ ACTUALIZADO: Backend ahora filtra por estado, frontend solo unwraps

@@ URL @@
 export async function getAvailableRequests(): Promise<Solicitud[]> {
   try {
-    const url = getApiUrl('/request/solicitudes');
+    // Backend retorna solo PENDIENTE por defecto con parámetro estado
+    const url = getApiUrl('/request/solicitudes?estado=PENDIENTE');

@@ Filtrado en Cliente @@
-    // Filtrar solo las PENDIENTES
-    return allRequests.filter(
-      req => req.estadoSolicitud === EstadoSolicitud.PENDIENTE,
-    );
+    // ✅ Backend ya retorna solo PENDIENTE, no necesitamos filtrar
+    return allRequests;
```

**¿QUÉ CAMBIÓ?**
- ✅ Agregado: URL parámetro explícito `?estado=PENDIENTE`
- ❌ Removido: Filtrado en cliente con `.filter(req => req.estadoSolicitud === ...)`
- ✅ Cambio: Ahora retorna `allRequests` directamente sin filtrar

---

## 🚨 PROBLEMAS IDENTIFICADOS

### PROBLEMA CRÍTICO: Clientes no pueden ver sus solicitudes por estado

**Requerimiento Original:** 
> "El cliente debe ver TODAS SUS SOLICITUDES (cualquier estado)"

**Comportamiento Actual (P1):**
```
GET /request/solicitudes                     → Sin autenticación = 401 ✅
GET /request/solicitudes?estado=PENDIENTE    → Solo PENDIENTE ✅
GET /request/solicitudes (sin estado)        → Por defecto PENDIENTE ❌
```

**Impacto:**
- ❌ Un cliente NO puede ver sus solicitudes EN PROGRESO
- ❌ Un cliente NO puede ver sus solicitudes COMPLETADAS
- ❌ Un cliente NO puede ver sus solicitudes CANCELADAS
- ❌ El frontend NO tiene tabs para cambiar entre estados

**Raíz del Problema:**
La implementación actual asume que TODOS los usuarios deben ver solo PENDIENTE por defecto. Pero los requerimientos claramente establecen que:
- **CLIENTE:** Ve TODAS sus solicitudes, sin filtro de estado por defecto
- **TÉCNICO:** Ve SOLO PENDIENTE (solicitudes disponibles para propuestas)
- **ADMIN:** Ve TODAS (futuro)

---

## 🎯 ANÁLISIS DE IMPACTO POR ROL

### ROL: CLIENTE
| Acción | Esperado | Actual (P1) | Estado |
|--------|----------|-------------|--------|
| Ver todas sus solicitudes | TODAS | SOLO PENDIENTE | ❌ **ROTO** |
| Ver solicitudes EN PROGRESO | ✅ Mostrar | ❌ No mostrar | ❌ **ROTO** |
| Ver solicitudes COMPLETADAS | ✅ Mostrar | ❌ No mostrar | ❌ **ROTO** |
| Ver solicitudes CANCELADAS | ✅ Mostrar | ❌ No mostrar | ❌ **ROTO** |
| Pasar ?estado=EN_PROGRESO | ✅ Filtrar | ✅ Filtrar | ✅ **OK** |
| Ver propuestas recibidas | ✅ Mostrar | ✅ Mostrar | ✅ **OK** |

### ROL: TÉCNICO (Maestrito)
| Acción | Esperado | Actual (P1) | Estado |
|--------|----------|-------------|--------|
| Ver SOLO PENDIENTE | ✅ Mostrar | ✅ Mostrar | ✅ **OK** |
| Ver propias solicitudes | ❌ No mostrar | ❌ No mostrar | ✅ **OK** |
| Filtrar por categoría | ⏳ Futuro | ⏳ Futuro | ✅ **OK** |
| Crear propuesta | ✅ Permitir | ✅ Permitir | ✅ **OK** |

### ROL: ADMIN (Futuro)
| Acción | Esperado | Actual (P1) | Estado |
|--------|----------|-------------|--------|
| Ver TODAS las solicitudes | ✅ Futuro | ❌ Ve PENDIENTE | ⚠️ **PREPARACIÓN** |
| Sin filtro de estado | ✅ Futuro | ❌ Default PENDIENTE | ⚠️ **PREPARACIÓN** |

---

## 📝 LÓGICA ACTUAL (INCORRECTA)

### Flujo Backend (Actual):
```
Cliente Técnico hace GET /request/solicitudes
├─ Controller: @UseGuards(JwtAuthGuard) ✅
├─ DefaultValuePipe: estado = PENDIENTE (siempre) ❌
├─ Proxy: Pasa estado=PENDIENTE al microservice ❌
└─ Service: Filtra WHERE estadoSolicitud = PENDIENTE ❌
   └─ Resultado: Solo PENDIENTE (correcto para TÉCNICO, INCORRECTO para CLIENTE)
```

### Flujo Frontend (Actual):
```
getAvailableRequests() para Técnico
├─ URL: /request/solicitudes?estado=PENDIENTE ✅
├─ Backend: Retorna solicitudes PENDIENTE ✅
└─ Frontend: Retorna allRequests directamente ✅

getMyRequests() para Cliente
├─ Usa diferente endpoint: /request/solicitudes/my/solicitudes ✅
└─ Retorna solicitudes por usuario (cualquier estado) ✅
```

**Problema de Confusión:**
- El endpoint `/request/solicitudes` (PÚBLICO/GENERAL) está siendo usado como si fuera "solicitudes para técnico"
- El endpoint `/request/solicitudes/my/solicitudes` (PRIVADO/USUARIO) sí devuelve todas las solicitudes del usuario
- **P1 está protegiendo el endpoint público pero asumiendo que TODOS ven PENDIENTE por defecto**

---

## 🔧 CORRECCIONES NECESARIAS

### CORRECCIÓN 1: Distinguir por ROL en Backend

**Ubicación:** `apps/request/src/services/solicitudes.service.ts`

```typescript
// OPCIÓN A: Pasar rol en filterDto y decidir en service
async findAll(filterDto?: SolicitudFilterDto) {
    const where: any = { isActive: true };
    
    // Si es TÉCNICO: Default PENDIENTE
    // Si es CLIENTE: Sin default, mostrar TODAS
    // Si es ADMIN: Sin default, mostrar TODAS
    
    if (filterDto?.rol === RolUsuario.TECNICO && !filterDto?.estadoSolicitud) {
        where.estadoSolicitud = EstadoSolicitud.PENDIENTE;
    } else if (filterDto?.estadoSolicitud) {
        where.estadoSolicitud = filterDto.estadoSolicitud;
    }
    // Si no hay estado y no es técnico: retorna TODAS (sin filtro de estado)
}

// OPCIÓN B: Usar endpoint diferente para técnico
// GET /request/solicitudes → TODAS (para cliente/admin)
// GET /request/solicitudes/available → PENDIENTE (para técnico)
```

### CORRECCIÓN 2: Pasar información del usuario desde Controller

**Ubicación:** `apps/api-gateway/src/controllers/request.controller.ts`

```typescript
@Get('solicitudes')
@UseGuards(JwtAuthGuard)
findAllSolicitudes(
    @Request() req: any,  // ← AGREGAR para obtener rol
    @Query() filterDto: any,
    @Query('estado') estado?: EstadoSolicitud
): Observable<any> {
    // Pasar rol del usuario actual al proxy
    return this.requestProxyService.findAllSolicitudes({
        ...filterDto, 
        estado,
        rol: req.user.rol  // ← AGREGAR
    });
}
```

### CORRECCIÓN 3: NO forzar default en Service

**Ubicación:** `apps/request/src/services/solicitudes.service.ts`

```typescript
async findAll(filterDto?: SolicitudFilterDto) {
    // ...
    const where: any = { isActive: true };
    
    // ✅ NUEVO: Aplicar default SOLO si es técnico
    if (filterDto?.estadoSolicitud) {
        where.estadoSolicitud = filterDto.estadoSolicitud;
    } else if (filterDto?.rol === RolUsuario.TECNICO) {
        // Default: Solo PENDIENTE para técnico
        where.estadoSolicitud = EstadoSolicitud.PENDIENTE;
    }
    // Si no hay estado y no es técnico: no filtra por estado
}
```

### CORRECCIÓN 4: Remover default del Controller

**Ubicación:** `apps/api-gateway/src/controllers/request.controller.ts`

```typescript
@Get('solicitudes')
@UseGuards(JwtAuthGuard)
@Query('estado', new DefaultValuePipe(EstadoSolicitud.PENDIENTE))  // ← REMOVER
findAllSolicitudes(
    @Request() req: any,
    @Query() filterDto: any,
    @Query('estado') estado?: EstadoSolicitud
): Observable<any> {
    // El default lo maneja el service según el rol
}

// OPCIÓN ALTERNATIVA: Mantener pero permitir null
@Query('estado')  // Sin DefaultValuePipe
estado?: EstadoSolicitud
```

---

## 📋 TABLA COMPARATIVA: ANTES vs DESPUÉS vs PROPUESTO

| Comportamiento | ANTES (Original) | ACTUAL (P1) | PROPUESTO (Corrección) |
|---|---|---|---|
| **Cliente: GET /solicitudes** | ❌ Sin guard | ✅ Con guard, pero DEFAULT PENDIENTE ❌ | ✅ Con guard, SIN default |
| **Cliente: Ve todas sus solicitudes** | ❌ N/A (no autenticado) | ❌ Solo PENDIENTE | ✅ Todas (sin default) |
| **Técnico: GET /solicitudes** | ❌ Sin guard | ✅ Con guard, DEFAULT PENDIENTE ✅ | ✅ Con guard, DEFAULT PENDIENTE |
| **Técnico: Solo PENDIENTE** | ❌ Via filtrado cliente | ✅ Via backend | ✅ Via backend (mejor) |
| **Admin: Futuro** | ❌ Sin preparación | ⚠️ Verá solo PENDIENTE | ✅ Verá todas (sin default) |
| **URL con parámetro estado** | ✅ Funciona | ✅ Funciona | ✅ Funciona |

---

## 🎬 RESUMEN: QUÉ PASÓ Y QUÉ SE ROMPIÓ

### ✅ Lo que P1 hizo BIEN:
1. ✅ Agregó autenticación al endpoint GET /request/solicitudes
2. ✅ Movió el filtrado de cliente a backend (mejor seguridad)
3. ✅ Técnico ahora ve SOLO PENDIENTE desde backend
4. ✅ Removió filtrado duplicado en frontend

### ❌ Lo que P1 hizo MAL:
1. ❌ Forzó default PENDIENTE para TODOS los usuarios
2. ❌ Asumió que el endpoint es "solo para técnico"
3. ❌ Rompió la capacidad de cliente de ver todas sus solicitudes
4. ❌ No consideró los 3 roles (Cliente, Técnico, Admin)
5. ❌ No pasó información de rol desde controller al service

### 💥 Consecuencias:
- Cliente no puede ver tabs: PENDIENTE, EN PROGRESO, COMPLETADAS, CANCELADAS
- Cliente no puede navegar el historial de sus solicitudes
- Admin (cuando exista) verá solo PENDIENTE en lugar de TODAS

---

## 🔍 PREGUNTAS A RESOLVER ANTES DE CORRECCIONES

1. **¿Cómo identificar el rol en el endpoint?**
   - ¿Pasar desde controller vía `@Request() req`?
   - ¿O el service consulta la DB por idUser?

2. **¿Qué pasa con solicitudes del usuario actual?**
   - ¿El cliente ve sus PROPIAS solicitudes + las de otros?
   - ¿O el endpoint es "global" sin filtro de usuario?
   - (Nota: `/request/solicitudes/my/solicitudes` ya existe para esto)

3. **¿DefaultValuePipe debe removerse completamente?**
   - ¿O mantenerlo pero solo aplicar en service según rol?

4. **¿Admin necesita parámetro especial?**
   - ¿Admin hace request especial?
   - ¿O simplemente no tienen default?

---

## ✋ ESTADO ACTUAL

**IMPLEMENTACIÓN:** Parcialmente completa pero INCORRECTA
- 4 de 5 archivos modificados
- DefaultValuePipe fuerza comportamiento incorrecto
- Requiere correcciones ANTES de validar con test curl

**PRÓXIMO PASO:** Esperar aprobación del usuario para proceder con correcciones


# 📋 PASO 2 - PROPUESTA DE CAMBIOS Y VALIDACIONES (P2-P5)

**Fecha:** 11 de Diciembre, 2025
**Prerequisito:** PASO 1 completado ✅
**Status:** Esperando confirmación

---

## 🎯 CAMBIOS PROPUESTOS

### CAMBIO 1: P2a - Validar Ownership en GET `/solicitudes/:id`

**Archivo:** `apps/request/src/services/solicitudes.service.ts`

**Ubicación:** Método `findOne()` (línea ~138)

**Problema:**
```typescript
// ACTUAL (VULNERABLE):
async findOne(idSolicitud: number) {
    const solicitud = await this.database.solicitud.findUnique({...});
    if (!solicitud) throw new NotFoundException(...);
    return solicitud;  // ❌ Retorna sin verificar ownership
}
```

**Solución propuesta:**
```typescript
// PROPUESTO (SEGURO):
async findOne(idSolicitud: number, currentUser?: { idUser: number; rol: string }) {
    const solicitud = await this.database.solicitud.findUnique({...});
    if (!solicitud) throw new NotFoundException(...);
    
    // ✅ Si currentUser se proporciona, validar ownership
    if (currentUser && currentUser.rol !== 'ADMIN' && solicitud.idUser !== currentUser.idUser) {
        throw new ForbiddenException('No tienes permisos para acceder a esta solicitud');
    }
    
    return solicitud;
}
```

**Dónde se aplica:**
1. **GET `/solicitudes/:id`** en controller → llamar con `currentUser`
2. **PUT `/solicitudes/:id`** en controller → ya lo hace ✅
3. **PUT `/solicitudes/:id/cancel`** en controller → ya lo hace ✅
4. **DELETE `/solicitudes/:id`** en controller → ya lo hace ✅

**Cambio en Controller:**
```typescript
// ACTUAL:
@Get('solicitudes/:id')
findOneSolicitud(@Param('id', ParseIntPipe) id: number): Observable<any> {
    return this.requestProxyService.findSolicitudById(id);
}

// PROPUESTO:
@Get('solicitudes/:id')
@UseGuards(JwtAuthGuard)
findOneSolicitud(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
): Observable<any> {
    return this.requestProxyService.findSolicitudById(id, req.user);
}
```

**Impacto:**
- ✅ Previene acceso a solicitudes ajenas
- ✅ No rompe flujos existentes
- ✅ Validación ocurre en service (backend-only)
- ✅ Responde 403 si no es dueño, 404 si no existe

---

### CAMBIO 2: P2b - Validar Ownership en GET `/solicitudes-tecnicos/:id`

**Archivo:** `apps/request/src/services/solicitudes-tecnicos.service.ts`

**Ubicación:** Método `findOne()` (línea ~50)

**Problema:**
```typescript
// ACTUAL (VULNERABLE):
async findOne(idSolTec: number) {
    const propuesta = await this.database.solicitudTecnico.findUnique({...});
    if (!propuesta) throw new NotFoundException(...);
    return propuesta;  // ❌ No verifica ownership
}
```

**Solución propuesta:**
```typescript
// PROPUESTO (SEGURO):
async findOne(
    idSolTec: number,
    currentUser?: { idUser: number; rol: string; idTecnico?: number }
) {
    const propuesta = await this.database.solicitudTecnico.findUnique({
        where: { idSolTec },
        include: { solicitud: true }  // ✅ Necesario para verificar ownership
    });

    if (!propuesta) {
        throw new NotFoundException(`Propuesta con ID ${idSolTec} no encontrada`);
    }

    // ✅ Validar ownership si se proporciona currentUser
    if (currentUser && currentUser.rol !== 'ADMIN') {
        const esPropietarioDeOperacion = 
            propuesta.idTecnico === currentUser.idTecnico || // Técnico es propietario de propuesta
            propuesta.solicitud.idUser === currentUser.idUser; // Cliente es propietario de solicitud
        
        if (!esPropietarioDeOperacion) {
            throw new ForbiddenException('No tienes permisos para acceder a esta propuesta');
        }
    }

    return propuesta;
}
```

**Dónde se aplica:**
1. **GET `/solicitudes-tecnicos/:id`** → nuevo endpoint expuesto, necesita validación
2. **PUT responder** → ya valida ownership de solicitud ✅

**Cambio en Controller:**
```typescript
// ACTUAL:
@Get('solicitudes-tecnicos/:id')
@UseGuards(JwtAuthGuard)
findOneSolicitudTecnico(@Param('id', ParseIntPipe) id: number): Observable<any> {
    return this.requestProxyService.findSolicitudTecnicoById(id);
}

// PROPUESTO:
@Get('solicitudes-tecnicos/:id')
@UseGuards(JwtAuthGuard)
findOneSolicitudTecnico(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
): Observable<any> {
    return this.requestProxyService.findSolicitudTecnicoById(id, req.user);
}
```

**Impacto:**
- ✅ Evita que Técnico A vea propuestas de Técnico B
- ✅ Evita que Cliente A vea propuestas de solicitud de Cliente B
- ✅ Cliente ve propuestas de su propia solicitud (OK)
- ✅ Técnico ve sus propias propuestas (OK)
- ✅ ADMIN ve todas (OK)

---

### CAMBIO 3: P2c - Validar Ownership en GET `/solicitudes-tecnicos/solicitud/:id`

**Archivo:** `apps/request/src/services/solicitudes-tecnicos.service.ts`

**Ubicación:** Método `findBySolicitud()` (línea ~238)

**Problema:**
```typescript
// ACTUAL (VULNERABLE):
async findBySolicitud(idSolicitud: number) {
    const solicitud = await this.database.solicitud.findUnique({...});
    if (!solicitud) throw new NotFoundException(...);
    return this.database.solicitudTecnico.findMany({...});
    // ❌ No verifica que el usuario sea propietario de la solicitud
}
```

**Solución propuesta:**
```typescript
// PROPUESTO (SEGURO):
async findBySolicitud(
    idSolicitud: number,
    currentUser?: { idUser: number; rol: string }
) {
    // Verificar que solicitud existe
    const solicitud = await this.database.solicitud.findUnique({
        where: { idSolicitud, isActive: true }
    });

    if (!solicitud) {
        throw new NotFoundException(`Solicitud con ID ${idSolicitud} no encontrada`);
    }

    // ✅ Validar que usuario tiene permiso para ver propuestas de esta solicitud
    if (currentUser && currentUser.rol !== 'ADMIN' && solicitud.idUser !== currentUser.idUser) {
        throw new ForbiddenException('No tienes permisos para ver propuestas de esta solicitud');
    }

    return this.database.solicitudTecnico.findMany({
        where: { idSolicitud },
        orderBy: { fechaPropuesta: 'desc' }
    });
}
```

**Dónde se aplica:**
1. **GET `/solicitudes-tecnicos/solicitud/:id`** → nuevo endpoint, necesita validación

**Cambio en Controller:**
```typescript
// ACTUAL:
@Get('solicitudes-tecnicos/solicitud/:idSolicitud')
@UseGuards(JwtAuthGuard)
findSolicitudesTecnicosBySolicitud(
    @Param('idSolicitud', ParseIntPipe) idSolicitud: number
): Observable<any> {
    return this.requestProxyService.findSolicitudesBySolicitud(idSolicitud);
}

// PROPUESTO:
@Get('solicitudes-tecnicos/solicitud/:idSolicitud')
@UseGuards(JwtAuthGuard)
findSolicitudesTecnicosBySolicitud(
    @Param('idSolicitud', ParseIntPipe) idSolicitud: number,
    @Request() req: any
): Observable<any> {
    return this.requestProxyService.findSolicitudesBySolicitud(idSolicitud, req.user);
}
```

**Impacto:**
- ✅ Cliente solo ve propuestas de sus propias solicitudes
- ✅ Técnico no puede pescar solicitudes ajenas
- ✅ Cierra ataque de fuerza bruta (probar IDs hasta encontrar)

---

### CAMBIO 4: P3 - Unificar Consistencia de Rol

**Archivo:** `apps/request/src/request.controller.ts` (y otros)

**Problema:**
```typescript
// A veces backend retorna:
{ role: "CLIENTE" }        // ❌ singular

// A veces retorna:
{ roles: ["CLIENTE"] }     // ✅ array

// Frontend confundido: ¿cuál validar?
```

**Solución propuesta:**

**1. JWT siempre usa array (YA ESTÁ BIEN):**
```typescript
// En auth.service al generar JWT:
const payload = {
    idUser: user.idUser,
    roles: ["CLIENTE", "TECNICO"],  // ✅ SIEMPRE array
    email: user.email
};
```

**2. Todas las respuestas deben usar array:**

Buscar y reemplazar en toda respuesta de solicitud:
- Si hay `rol: string` → cambiar a `roles: string[]`
- Persistencia en BD: verificar que solicitud.rol es string
- Respuesta al frontend: `{ roles: ["CLIENTE"] }`

**Cambios específicos:**
- ❓ Revisar si hay `.rol` singular siendo retornado en servicios
- ✅ Controller: ya usa `req.user.rol` (correcto, del JWT)
- ✅ Service: ya almacena `rol` singular en BD (correcto)

**Nota:** Esta es una verificación de consistencia. Puede que NO haya cambios necesarios si JWT ya usa array y respuestas ya usan lo correcto.

**Impacto:**
- ✅ Una sola fuente de verdad
- ✅ Frontend no confundido
- ✅ Tipos correctos en TypeScript

---

## 📊 TABLA RESUMEN DE CAMBIOS

| P | Endpoint | Archivo | Método | Cambio | Esfuerzo | Riesgo |
|---|----------|---------|--------|--------|----------|--------|
| P2a | GET `/solicitudes/:id` | `solicitudes.service.ts` | `findOne()` | Agregar validación ownership | 5 min | BAJO |
| P2a | GET `/solicitudes/:id` | `request.controller.ts` | `findOneSolicitud()` | Pasar currentUser | 2 min | BAJO |
| P2b | GET `/solicitudes-tecnicos/:id` | `solicitudes-tecnicos.service.ts` | `findOne()` | Agregar validación ownership | 5 min | BAJO |
| P2b | GET `/solicitudes-tecnicos/:id` | `request.controller.ts` | `findOneSolicitudTecnico()` | Pasar currentUser | 2 min | BAJO |
| P2c | GET `/solicitudes-tecnicos/solicitud/:id` | `solicitudes-tecnicos.service.ts` | `findBySolicitud()` | Agregar validación ownership | 5 min | BAJO |
| P2c | GET `/solicitudes-tecnicos/solicitud/:id` | `request.controller.ts` | `findSolicitudesTecnicosBySolicitud()` | Pasar currentUser | 2 min | BAJO |
| P3 | Global | Múltiples | Múltiples | Unificar rol array vs singular | ❓ 0-15 min | BAJO |
| P4 | Propuestas | - | - | YA IMPLEMENTADO ✅ | - | - |
| P5 | Solicitudes | - | - | YA IMPLEMENTADO ✅ | - | - |

**Total estimado:** ~35 minutos (incluyendo testing)

---

## 🔐 PATRONES DE SEGURIDAD APLICADOS

### Pattern 1: Ownership Check en GET específico
```typescript
if (currentUser && currentUser.rol !== 'ADMIN' && entidad.idUser !== currentUser.idUser) {
    throw new ForbiddenException('No tienes permisos');
}
```

### Pattern 2: Ownership Check multi-rol
```typescript
const tieneAcceso = 
    currentUser.rol === 'ADMIN' ||
    entidad.idTecnico === currentUser.idTecnico ||
    entidad.solicitud.idUser === currentUser.idUser;

if (!tieneAcceso) {
    throw new ForbiddenException('No tienes permisos');
}
```

### Pattern 3: Respuestas de error
- **403 Forbidden:** Usuario autenticado pero sin permisos
- **404 Not Found:** Recurso no existe o sin permisos (mantener consistencia)
- **401 Unauthorized:** Token inválido o expirado (ya manejado por JwtAuthGuard)

---

## ✅ CHECKLIST DE CAMBIOS

### Cambios de código:
- [ ] Modificar `solicitudes.service.ts:findOne()` - P2a
- [ ] Modificar `request.controller.ts:findOneSolicitud()` - P2a
- [ ] Modificar `solicitudes-tecnicos.service.ts:findOne()` - P2b
- [ ] Modificar `request.controller.ts:findOneSolicitudTecnico()` - P2b
- [ ] Modificar `solicitudes-tecnicos.service.ts:findBySolicitud()` - P2c
- [ ] Modificar `request.controller.ts:findSolicitudesTecnicosBySolicitud()` - P2c
- [ ] Verificar consistencia rol (P3) - Revisar si hay cambios necesarios

### Testing:
- [ ] Verificar GET `/solicitudes/:id` - caso válido (owner)
- [ ] Verificar GET `/solicitudes/:id` - caso inválido (no owner)
- [ ] Verificar GET `/solicitudes-tecnicos/:id` - caso válido (técnico dueño)
- [ ] Verificar GET `/solicitudes-tecnicos/:id` - caso inválido (técnico no dueño)
- [ ] Verificar GET `/solicitudes-tecnicos/solicitud/:id` - caso válido (cliente dueño)
- [ ] Verificar GET `/solicitudes-tecnicos/solicitud/:id` - caso inválido (cliente no dueño)
- [ ] Verificar Expo frontend NO se rompe
- [ ] Verificar navegación sigue funcionando
- [ ] Verificar auth sigue funcionando

---

## 🚀 PRÓXIMO PASO

**Confirmación requerida:**

1. ✅ ¿Propuesta de cambios clara?
2. ✅ ¿Patrones de seguridad correctos?
3. ✅ ¿Esfuerzo estimado razonable (~35 min)?
4. ✅ ¿Listo para PASO 3 (Implementación)?

Si todo está OK → Proceder a **PASO 3**

# 🎯 RESUMEN EJECUTIVO: PROBLEMAS Y RECOMENDACIONES

**Documento ejecutivo de hallazgos críticos del análisis de flujos y roles**

---

## 📊 RESUMEN DE HALLAZGOS

### Total de Problemas Detectados: **5 CRÍTICOS + 4 MAYORES**

| Severidad | Cantidad | Riesgo |
|-----------|----------|--------|
| 🔴 CRÍTICA | 3 | Exposición de datos, acceso no autorizado |
| 🟡 MAYOR | 2 | Inconsistencias de datos, validaciones incompletas |
| ℹ️ INFORMACIÓN | 4 | Mejoras menores, optimizaciones |

---

## 🔴 PROBLEMAS CRÍTICOS (Implementar Inmediatamente)

### P1: GET /request/solicitudes Sin Protección de Rol

**Ubicación:** `apps/api-gateway/src/controllers/request.controller.ts` (línea 80)

```typescript
@Get('solicitudes')
@Public()  // ⚠️ PROBLEMA: Sin protección
findAllSolicitudes(@Query() filterDto: any): Observable<any>
```

**Impacto:**
- ❌ Usuarios NO autenticados pueden ver TODAS las solicitudes
- ❌ Exposición de datos sensibles: costos, ubicaciones, descripciones
- ❌ Ningún filtrado por estado (retorna PENDIENTES, ACEPTADAS, CANCELADAS)
- ❌ Posible scraping de datos del mercado

**Severidad:** 🔴 CRÍTICA  
**CVSS Score:** 7.5 (High) - Information Disclosure  
**Esfuerzo de Fix:** 15 minutos

**Solución:**
```typescript
@Get('solicitudes')
@UseGuards(JwtAuthGuard)  // Agregar autenticación
@Query('estado', new DefaultValuePipe(EstadoSolicitud.PENDIENTE))
findAllSolicitudes(
  @Query() filterDto: any,
  @Query('estado') estado: EstadoSolicitud
): Observable<any> {
  // Backend filtra por estado, no cliente
  return this.requestProxyService.findAllSolicitudes({...filterDto, estado});
}
```

**Pasos:**
1. Agregar `@UseGuards(JwtAuthGuard)`
2. Cambiar `@Public()` a autenticado
3. Pasar parámetro `estado` al servicio backend
4. Filtrar en `SolicitudesService.findAll()` por estado

**Validación:**
```bash
# ANTES (funciona sin token):
curl "${API}/request/solicitudes" | jq '.data | length'
# Retorna: 42 (todas las solicitudes)

# DESPUÉS (requiere token):
curl "${API}/request/solicitudes"
# 401 Unauthorized

curl -H "Authorization: Bearer ${TOKEN}" "${API}/request/solicitudes?estado=PENDIENTE"
# Retorna: solo PENDIENTE
```

---

### P2: Cliente Puede Ver Propuestas de Otros Clientes

**Ubicación:** `apps/api-gateway/src/controllers/request.controller.ts` (línea 164)  
y `apps/request/src/services/solicitudes-tecnicos.service.ts` (línea ~165)

```typescript
// CONTROLADOR
@Get('solicitudes-tecnicos/solicitud/:idSolicitud')
@UseGuards(JwtAuthGuard)  // ⚠️ Sin validación de propiedad
findSolicitudesTecnicosBySolicitud(
  @Param('idSolicitud', ParseIntPipe) idSolicitud: number
): Observable<any>
```

**Impacto:**
- ❌ Cliente B ve propuestas de solicitud de Cliente A
- ❌ Exposición de costos que técnicos proponen
- ❌ Información sensible de negociación
- ❌ Competencia desleal (técnicos ven costos compitiendo)

**Severidad:** 🔴 CRÍTICA  
**CVSS Score:** 6.5 (Medium) - Information Disclosure + Unauthorized Access  
**Esfuerzo de Fix:** 20 minutos

**Escenario Vulnerable:**
```
1. Cliente A crea Solicitud #42
2. Técnico 1 se postula con costo $120
3. Técnico 2 se postula con costo $130
4. Cliente B hace:
   GET /solicitudes-tecnicos/solicitud/42
5. ❌ Ve ambas propuestas (costos, notas, técnicos)
```

**Solución:**
```typescript
// SERVICIO
async findBySolicitud(
  idSolicitud: number,
  currentUser: {idUser: number; rol: string}  // Agregar parámetro
) {
  const solicitud = await this.database.solicitud.findUnique({
    where: { idSolicitud, isActive: true }
  });

  if (!solicitud) {
    throw new NotFoundException(...);
  }

  // ✅ AGREGAR VALIDACIÓN
  if (currentUser.rol !== 'ADMIN' && solicitud.idUser !== currentUser.idUser) {
    throw new ForbiddenException(
      'No tienes permisos para ver las propuestas de este cliente'
    );
  }

  return this.database.solicitudTecnico.findMany({
    where: { idSolicitud },
    orderBy: { fechaPropuesta: 'desc' }
  });
}

// CONTROLADOR (actualizar para pasar currentUser)
findSolicitudesTecnicosBySolicitud(
  @Param('idSolicitud', ParseIntPipe) idSolicitud: number,
  @Request() req: any  // Agregar
): Observable<any> {
  return this.requestProxyService.findSolicitudesBySolicitud(
    idSolicitud,
    req.user  // Pasar usuario
  );
}
```

**Validación:**
```bash
# Cliente B intenta ver propuestas de Cliente A:
curl -X GET "${API}/solicitudes-tecnicos/solicitud/${SOLICITUD_AJENA}" \
  -H "Authorization: Bearer ${TOKEN_CLIENT_B}"

# ANTES: 200 OK (PROBLEMA)
# DESPUÉS: 403 Forbidden ✅
```

---

### P3: GET /solicitudes-tecnicos/:id Sin Validación de Propiedad

**Ubicación:** `apps/api-gateway/src/controllers/request.controller.ts` (línea 155)

```typescript
@Get('solicitudes-tecnicos/:id')
@UseGuards(JwtAuthGuard)  // ⚠️ Sin validación de propiedad
findOneSolicitudTecnico(
  @Param('id', ParseIntPipe) id: number
): Observable<any>
```

**Impacto:**
- ❌ Técnico A puede ver propuesta de Técnico B
- ❌ Cliente no propietario puede ver propuesta
- ❌ Exposición de costos y estrategias de precios
- ❌ Cada propuesta puede ser accedida directamente por ID

**Severidad:** 🔴 CRÍTICA (pero menor que P1 y P2)  
**CVSS Score:** 6.0 (Medium) - Information Disclosure  
**Esfuerzo de Fix:** 25 minutos

**Solución:**
```typescript
// SERVICIO
async findOne(
  idSolTec: number,
  currentUser: {idUser: number; rol: string}  // Agregar
) {
  const propuesta = await this.database.solicitudTecnico.findUnique({
    where: { idSolTec },
    include: { solicitud: true }
  });

  if (!propuesta) {
    throw new NotFoundException(...);
  }

  // ✅ AGREGAR VALIDACIÓN
  const esAdmin = currentUser.rol === 'ADMIN';
  const esDuenioTecnico = propuesta.idTecnico === (await this.getTecnicoIdFromUser(currentUser.idUser));
  const esDuenioCliente = propuesta.solicitud.idUser === currentUser.idUser;

  if (!esAdmin && !esDuenioTecnico && !esDuenioCliente) {
    throw new ForbiddenException('No tienes permisos para ver esta propuesta');
  }

  return propuesta;
}
```

---

## 🟡 PROBLEMAS MAYORES (Implementar Pronto)

### P4: Validación de Estado Incompleta en Responder Propuesta

**Ubicación:** `apps/request/src/services/solicitudes-tecnicos.service.ts` (línea ~115)

```typescript
async responder(
  idSolTec: number,
  respuestaDto: ResponderSolicitudDto,
  currentUser: { idUser: number; rol: string }
) {
  const propuesta = await this.findOne(idSolTec);

  // Valida estado de propuesta
  if (propuesta.estadoAcuerdo !== EstadoAceptacion.PROPUESTO) {
    throw new BadRequestException(...);
  }

  // ⚠️ FALTA: No valida estado de solicitud
  // Debería rechazar si solicitud está CANCELADA o COMPLETADA
}
```

**Impacto:**
- ❌ Cliente puede aceptar propuesta de solicitud CANCELADA
- ❌ Técnico espera trabajo que fue cancelado
- ❌ Inconsistencia de datos
- ❌ Confusión en UX

**Escenario Problemático:**
```
1. Solicitud #42 está PENDIENTE
2. Técnico propone (Propuesta #101 está PROPUESTO)
3. Cliente cancela Solicitud #42 (estado → CANCELADA)
4. Cliente intenta aceptar Propuesta #101
5. ❌ Se acepta, aunque solicitud está CANCELADA
6. Técnico recibe notificación de aceptación pero solicitud está cancelada
```

**Severidad:** 🟡 MAYOR  
**Esfuerzo de Fix:** 10 minutos

**Solución:**
```typescript
async responder(
  idSolTec: number,
  respuestaDto: ResponderSolicitudDto,
  currentUser: { idUser: number; rol: string }
) {
  const propuesta = await this.findOne(idSolTec);

  // Validar estado de propuesta
  if (propuesta.estadoAcuerdo !== EstadoAceptacion.PROPUESTO) {
    throw new BadRequestException('Solo se puede responder a propuestas PROPUESTO');
  }

  // ✅ AGREGAR: Validar estado de solicitud
  if (propuesta.solicitud.estadoSolicitud !== EstadoSolicitud.PENDIENTE) {
    throw new BadRequestException(
      `No puedes responder a solicitudes en estado ${propuesta.solicitud.estadoSolicitud}`
    );
  }

  // ... resto de la lógica ...
}
```

---

### P5: Inconsistencia rol Array vs Singular

**Ubicación:** En múltiples archivos

```typescript
// Schema Prisma (ARRAY)
model Usuario {
  roles RolUsuario[] @default([CLIENTE])
}

// Pero en servicios (SINGULAR)
async responder(..., currentUser: {rol: string}) {  // ⚠️ SINGULAR
  if (currentUser.rol !== 'ADMIN') ...
}
```

**Impacto:**
- ❌ Inconsistencia en todo el codebase
- ❌ Usuario con `roles: ['TECNICO', 'CLIENTE']` no valida correctamente
- ❌ Difícil de mantener, confuso
- ❌ Puede causar bugs sutiles en validaciones

**Severidad:** 🟡 MAYOR  
**Esfuerzo de Fix:** 2-3 horas (buscar y reemplazar en múltiples archivos)

**Ubicaciones Encontradas:**
1. `SolicitudesTecnicosService.responder()` (línea ~115)
2. `SolicitudesService.update()` (línea ~80)
3. Varios places donde se pasa `currentUser`

**Solución:**
```typescript
// Opción A: Usar siempre ARRAY (recomendado)
async responder(
  ...,
  currentUser: {idUser: number; roles: RolUsuario[]}  // Array
) {
  if (!currentUser.roles.includes('ADMIN') && ...) {
    throw new ForbiddenException(...);
  }
}

// Opción B: Hacer función helper
function hasRole(user: {roles?: RolUsuario[]; rol?: string}, requiredRole: RolUsuario): boolean {
  const userRoles = user.roles || (user.rol ? [user.rol as RolUsuario] : []);
  return userRoles.includes(requiredRole);
}

// Uso
if (!hasRole(currentUser, RolUsuario.ADMIN) && ...) {
  throw new ForbiddenException(...);
}
```

**Pasos:**
1. Buscar todos los usos de `currentUser.rol`
2. Cambiar a `currentUser.roles` (array)
3. Actualizar lógica de validación
4. Actualizar guards para consistency
5. Actualizar tests

---

## ℹ️ PROBLEMAS MENORES (Considerar)

### M1: Filtrado de Solicitudes PENDIENTES en Cliente

**Ubicación:** `front_end_fixit-1/src/services/technician.service.ts` (línea ~54)

```typescript
export async function getAvailableRequests(): Promise<Solicitud[]> {
  const url = getApiUrl('/request/solicitudes');
  const resp = await apiClient.get<unknown>(url);
  // ... unwrap ...
  
  // ⚠️ Filtrado en CLIENTE
  return allRequests.filter(
    req => req.estadoSolicitud === EstadoSolicitud.PENDIENTE
  );
}
```

**Impacto:**
- ⚠️ Backend retorna TODAS las solicitudes (ineficiente)
- ⚠️ Si filtrado falla, técnico ve solicitudes aceptadas
- ⚠️ Transferencia innecesaria de datos

**Severidad:** ℹ️ OPTIMIZACIÓN  
**Esfuerzo de Fix:** 15 minutos

**Solución:**
```typescript
// Opción 1: Parámetro query
const url = getApiUrl('/request/solicitudes?estado=PENDIENTE');

// Opción 2: Endpoint específico
const url = getApiUrl('/request/solicitudes/disponibles');

// Backend filtros antes de retornar
```

---

### M2: Falta @Roles en POST /solicitudes-tecnicos/:id/responder

**Ubicación:** `apps/api-gateway/src/controllers/request.controller.ts` (línea ~207)

```typescript
@Post('solicitudes-tecnicos/:id/responder')
@UseGuards(JwtAuthGuard)  // ⚠️ Sin @Roles
responderSolicitudTecnico(...)
```

**Impacto:**
- ⚠️ Validación de roles solo en servicio (no es obvio)
- ⚠️ Documentación incompleta
- ⚠️ Otros endpoints tienen @Roles explícito

**Severidad:** ℹ️ CODE CLARITY  
**Esfuerzo de Fix:** 5 minutos

**Solución:**
```typescript
@Post('solicitudes-tecnicos/:id/responder')
@UseGuards(JwtAuthGuard, RolesGuard)  // Agregar RolesGuard
@Roles(RolUsuario.ADMIN, RolUsuario.CLIENTE)  // Agregar explícitamente
responderSolicitudTecnico(...)
```

---

### M3: Hard Delete en lugar de Soft Delete

**Ubicación:** Varios controladores DELETE

```typescript
// Actualmente: delete(
async removeSolicitud(idSolicitud: number) {
  return this.database.solicitud.delete({
    where: { idSolicitud }
  });
}
```

**Consideración:**
- Datos auditoría se pierden
- Difícil recuperar datos eliminados accidentalmente
- Mejor: Marcar como `deletedAt`

**Severidad:** ℹ️ AUDITORÍA  
**Esfuerzo de Fix:** 2-3 horas

---

### M4: Falta Validación en PUT /request/solicitudes/:id

**Ubicación:** `apps/request/src/services/solicitudes.service.ts` (línea ~80)

```typescript
async update(idSolicitud: number, updateDto: UpdateSolicitudDto, currentUser: ...) {
  // ✅ Valida propiedad
  // ⚠️ Pero no valida estado
  // Debería permitir actualizar solo si está PENDIENTE
}
```

**Impacto:**
- ⚠️ Cliente puede actualizar solicitud ACEPTADA
- ⚠️ Datos inconsistentes

**Severidad:** ℹ️ BUSINESS LOGIC  
**Esfuerzo de Fix:** 10 minutos

---

## 📋 MATRIZ DE PRIORIZACIÓN

| ID | Problema | Severidad | Esfuerzo | Impacto | Prioridad |
|----|----------|-----------|----------|---------|-----------|
| P1 | GET /solicitudes sin protección | 🔴 CRÍTICA | 15min | Alto | 1️⃣ |
| P2 | Cliente ve propuestas de otros | 🔴 CRÍTICA | 20min | Alto | 2️⃣ |
| P3 | Ver propuesta por ID sin validación | 🔴 CRÍTICA | 25min | Medio | 3️⃣ |
| P4 | Estado solicitud no validado | 🟡 MAYOR | 10min | Medio | 4️⃣ |
| P5 | Rol array vs singular | 🟡 MAYOR | 2-3h | Alto | 5️⃣ |
| M1 | Filtrado en cliente | ℹ️ MENOR | 15min | Bajo | 6️⃣ |
| M2 | Falta @Roles explícito | ℹ️ MENOR | 5min | Bajo | 7️⃣ |

---

## 🚀 PLAN DE IMPLEMENTACIÓN

### Fase 1: CRÍTICA (1-2 días)
**Objetivo:** Cerrar vulnerabilidades de exposición de datos

1. **P1: Proteger GET /solicitudes** (15 min)
   - Agregar `@UseGuards(JwtAuthGuard)`
   - Filtrar por estado en backend
   - Test con curl

2. **P2: Validar propiedad en ver propuestas** (20 min)
   - Agregar validación en `findBySolicitud()`
   - Pasar `currentUser` desde controlador
   - Test con curl

3. **P3: Validar propiedad en GET propuesta/:id** (25 min)
   - Agregar validación en `findOne()`
   - Test con múltiples usuarios

**Validación Total:** ~1 hora  
**Testing:** ~30 minutos

---

### Fase 2: MAYOR (1-2 días)
**Objetivo:** Completar validaciones y unificar código

1. **P4: Validar estado en responder** (10 min)
   - Agregar check de `estadoSolicitud`
   - Test flujo cancelación

2. **P5: Unificar rol array vs singular** (2-3 horas)
   - Buscar todos los `currentUser.rol`
   - Cambiar a `currentUser.roles`
   - Actualizar tests

3. **M2: Agregar @Roles explícito** (5 min)

**Validación Total:** ~2.5 horas  
**Testing:** ~1 hora

---

### Fase 3: MENOR (1 día)
**Objetivo:** Optimizaciones y mejoras

1. **M1: Mover filtrado al backend** (15 min)
2. **M3: Implementar soft delete** (2-3 horas)
3. **M4: Validar estado en PUT** (10 min)

---

## 🧪 TESTING RECOMENDADO

### Test Automatizados Recomendados

```typescript
// E2E Tests
describe('Solicitudes - Autorización', () => {
  it('GET /solicitudes requiere autenticación', () => {
    expect(GET('/solicitudes')).toBe(401);
  });

  it('Cliente ve solo propuestas de sus solicitudes', () => {
    const propuestas = GET('/solicitudes-tecnicos/solicitud/42', TOKEN_CLIENTE_A);
    expect(propuestas).not.toContain(solicitud_de_cliente_b);
  });

  it('Cliente no puede aceptar propuesta de solicitud CANCELADA', () => {
    solicitud.cancel();
    expect(POST('/responder', {...})).toBe(400);
  });
});
```

### Test Manuales (Curl)
Use `GUIA_VALIDACION_CURL_Y_TEST_CASES.md` para validación manual

---

## 📊 MÉTRICAS DE IMPACTO

### Antes de Correcciones
- ❌ 3 vulnerabilidades críticas activas
- ❌ 2 inconsistencias mayores
- ❌ Exposición de datos: ALTA
- ❌ Validación: INCOMPLETA

### Después de Correcciones
- ✅ 0 vulnerabilidades críticas
- ✅ 0 inconsistencias mayores
- ✅ Exposición de datos: MÍNIMA
- ✅ Validación: COMPLETA

---

## 📞 CONTACTO Y ESCALACIÓN

**Para consultas sobre:**
- Priorización: PM/Product Owner
- Implementación técnica: Lead Backend
- Testing: QA Lead
- Deployment: DevOps/Release Manager

---

## 📎 DOCUMENTOS RELACIONADOS

1. **ANALISIS_FLUJO_SOLICITUDES_Y_ROLES.md** - Análisis técnico detallado
2. **REFERENCIA_ENDPOINTS_Y_VALIDACIONES.md** - Especificación de endpoints
3. **GUIA_VALIDACION_CURL_Y_TEST_CASES.md** - Test cases y validación manual

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Antes de Iniciar
- [ ] Revisar todos los documentos
- [ ] Crear rama de trabajo: `fix/solicitudes-auth`
- [ ] Crear tickets en sistema de tracking
- [ ] Asignar responsables

### P1 Implementación
- [ ] Actualizar controlador
- [ ] Actualizar servicio
- [ ] Escribir tests
- [ ] Validar con curl
- [ ] Merge a develop

### P2 Implementación
- [ ] Actualizar controlador
- [ ] Actualizar servicio
- [ ] Agregar parámetro currentUser
- [ ] Escribir tests
- [ ] Validar con curl

### P3 Implementación
- [ ] Actualizar controlador
- [ ] Actualizar servicio
- [ ] Escribir tests
- [ ] Validar con curl

### P4 Implementación
- [ ] Actualizar servicio
- [ ] Escribir tests
- [ ] Validar flujo cancelación

### P5 Implementación
- [ ] Buscar y documentar todos los usos
- [ ] Actualizar cada archivo
- [ ] Actualizar guards
- [ ] Actualizar tests
- [ ] Review de cambios

### Validación Final
- [ ] Todos los tests pasan
- [ ] Curl validations OK
- [ ] Code review completado
- [ ] Documentación actualizada
- [ ] Release notes preparadas

---

## 🎓 CONCLUSIÓN

El sistema FixIt tiene una arquitectura sólida en términos de flujos y patrones, pero requiere **correcciones inmediatas en validación de acceso** para evitar exposición de datos y accesos no autorizados.

Las correcciones propuestas son **directas, de bajo riesgo**, y pueden implementarse en **2-3 días de desarrollo** con máxima cobertura de testing.

**Recomendación:** Implementar Fase 1 (CRÍTICA) inmediatamente antes de cualquier scaling o release a producción.


# 🧪 P2 VALIDACIÓN: OWNERSHIP CHECKS (P2a, P2b, P2c)

**Fecha:** $(date)
**Estado:** Listo para Testing
**Vulnerabilidades Corregidas:** 3 (P2a, P2b, P2c)

---

## 📋 RESUMEN DE CAMBIOS

### Archivos Modificados (6 archivos, ~60 líneas de código)

| Archivo | Cambios | Líneas |
|---------|---------|--------|
| `apps/request/src/services/solicitudes.service.ts` | P2a: Add ownership check to findOne() | +6 |
| `apps/request/src/services/solicitudes-tecnicos.service.ts` | P2b, P2c: Add multi-role checks + 2 helpers | +35 |
| `apps/api-gateway/src/controllers/request.controller.ts` | Pass req.user to 3 endpoints | +3 |
| `apps/api-gateway/src/proxy/services/request-proxy.service.ts` | Forward currentUser in 3 methods | +3 |
| `apps/request/src/controllers/solicitudes.controller.ts` | Update findOne to accept currentUser | +1 |
| `apps/request/src/controllers/solicitudes-tecnicos.controller.ts` | Update findOne + add findBySolicitud | +12 |

**Total:** ~60 líneas, NO cambios en respuestas, NO cambios en contratos

---

## 🧬 VALIDACIONES IMPLEMENTADAS

### P2a: GET /request/solicitudes/:id - Ownership Check

**Vulnerabilidad Corregida:**
```typescript
// ANTES (Vulnerable)
async findOne(idSolicitud: number) {
    const solicitud = await this.database.solicitud.findUnique(...);
    if (!solicitud) throw new NotFoundException(...);
    return solicitud;  // ❌ No validation
}

// DESPUÉS (Seguro)
async findOne(idSolicitud: number, currentUser?: { idUser: number; rol: string }) {
    const solicitud = await this.database.solicitud.findUnique(...);
    if (!solicitud) throw new NotFoundException(...);
    
    // ✅ Ownership validation
    if (currentUser && currentUser.rol !== 'ADMIN' && solicitud.idUser !== currentUser.idUser) {
        throw new ForbiddenException('No tienes permisos para acceder a esta solicitud');
    }
    
    return solicitud;
}
```

**Casos de Test:**
- ✅ ADMIN accede a cualquier solicitud → 200 OK
- ✅ CLIENTE accede a su propia solicitud → 200 OK
- ❌ CLIENTE accede a solicitud de otro → 403 Forbidden
- ❌ TECNICO accede a solicitud cualquiera → 403 Forbidden (P2a no lo permite)

---

### P2b: GET /request/solicitudes-tecnicos/:id - Multi-Role Ownership

**Vulnerabilidad Corregida:**
```typescript
// ANTES (Vulnerable)
async findOne(idSolTec: number) {
    const propuesta = await this.database.solicitudTecnico.findUnique({
        where: { idSolTec },
        include: { solicitud: true }
    });
    if (!propuesta) throw new NotFoundException(...);
    return propuesta;  // ❌ No validation
}

// DESPUÉS (Seguro - Multi-role check)
async findOne(idSolTec: number, currentUser?: any) {
    const propuesta = await this.database.solicitudTecnico.findUnique({
        where: { idSolTec },
        include: { solicitud: true }
    });
    if (!propuesta) throw new NotFoundException(...);
    
    // ✅ Multi-role validation
    if (currentUser) {
        const roles = this.normalizeRoles(currentUser);
        const isAdmin = roles.includes('ADMIN');
        
        if (!isAdmin) {
            const idTecnicoActual = await this.getIdTecnicoFromCurrentUser(currentUser);
            const isTecnicoDueno = propuesta.idTecnico === idTecnicoActual;
            const isClienteDueno = propuesta.solicitud.idUser === currentUser.idUser;
            
            if (!isTecnicoDueno && !isClienteDueno) {
                throw new ForbiddenException('No tienes permisos para acceder a esta propuesta');
            }
        }
    }
    
    return propuesta;
}
```

**Casos de Test:**
- ✅ ADMIN accede a cualquier propuesta → 200 OK
- ✅ TECNICO accede a su propia propuesta → 200 OK
- ✅ CLIENTE accede a propuesta de su solicitud → 200 OK
- ❌ TECNICO B accede a propuesta de TECNICO A → 403 Forbidden
- ❌ CLIENTE B accede a propuesta de solicitud de CLIENTE A → 403 Forbidden

---

### P2c: GET /request/solicitudes-tecnicos/solicitud/:id - Solicitud Ownership

**Vulnerabilidad Corregida:**
```typescript
// ANTES (Vulnerable)
async findBySolicitud(idSolicitud: number) {
    const solicitud = await this.database.solicitud.findUnique(...);
    if (!solicitud) throw new NotFoundException(...);
    
    return this.database.solicitudTecnico.findMany({
        where: { idSolicitud },
        orderBy: { fechaPropuesta: 'desc' }
    });  // ❌ No validation of solicitud ownership
}

// DESPUÉS (Seguro)
async findBySolicitud(idSolicitud: number, currentUser?: any) {
    const solicitud = await this.database.solicitud.findUnique(...);
    if (!solicitud) throw new NotFoundException(...);
    
    // ✅ Solicitud ownership validation
    if (currentUser) {
        const roles = this.normalizeRoles(currentUser);
        const isAdmin = roles.includes('ADMIN');
        
        if (!isAdmin && solicitud.idUser !== currentUser.idUser) {
            throw new ForbiddenException('No tienes permisos para ver propuestas de esta solicitud');
        }
    }
    
    return this.database.solicitudTecnico.findMany({...});
}
```

**Casos de Test:**
- ✅ ADMIN accede a cualquier solicitud → 200 OK (lista propuestas)
- ✅ CLIENTE accede a su propia solicitud → 200 OK (ve propuestas)
- ❌ CLIENTE B accede a solicitud de CLIENTE A → 403 Forbidden
- ❌ TECNICO accede a cualquier solicitud → 403 Forbidden (endpoint es client-facing)

---

## 🧪 SCRIPT DE VALIDACIÓN MANUAL

### Setup Previo
```bash
# 1. Asegurar que backend está corriendo
npm run start:dev

# 2. Obtener 3 usuarios de prueba (Admin, Cliente, Técnico)
# Usar AuthContext del frontend para obtener tokens válidos
```

### Test 1: P2a - GET /request/solicitudes/:id

```bash
# Crear solicitud por Cliente A
CLIENTE_A_TOKEN=$(obtener_token_cliente_a)
SOLICITUD_ID=42

# Caso 1: Cliente A accede a su solicitud (✅ DEBE PASAR)
curl -X GET \
  http://localhost:3000/request/solicitudes/$SOLICITUD_ID \
  -H "Authorization: Bearer $CLIENTE_A_TOKEN" \
  -H "Content-Type: application/json"
# Esperado: 200 OK + data completa

# Caso 2: Cliente B intenta acceder a solicitud de Cliente A (❌ DEBE FALLAR)
CLIENTE_B_TOKEN=$(obtener_token_cliente_b)
curl -X GET \
  http://localhost:3000/request/solicitudes/$SOLICITUD_ID \
  -H "Authorization: Bearer $CLIENTE_B_TOKEN" \
  -H "Content-Type: application/json"
# Esperado: 403 Forbidden + "No tienes permisos para acceder a esta solicitud"

# Caso 3: Admin accede a cualquier solicitud (✅ DEBE PASAR)
ADMIN_TOKEN=$(obtener_token_admin)
curl -X GET \
  http://localhost:3000/request/solicitudes/$SOLICITUD_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
# Esperado: 200 OK + data completa
```

### Test 2: P2b - GET /request/solicitudes-tecnicos/:id

```bash
# Propuesta creada por Técnico A para Solicitud de Cliente X
TECNICO_A_TOKEN=$(obtener_token_tecnico_a)
TECNICO_B_TOKEN=$(obtener_token_tecnico_b)
CLIENTE_X_TOKEN=$(obtener_token_cliente_x)
PROPUESTA_ID=123

# Caso 1: Técnico A accede a su propia propuesta (✅ DEBE PASAR)
curl -X GET \
  http://localhost:3000/request/solicitudes-tecnicos/$PROPUESTA_ID \
  -H "Authorization: Bearer $TECNICO_A_TOKEN"
# Esperado: 200 OK + propuesta completa

# Caso 2: Cliente X (dueño de solicitud) accede a propuesta (✅ DEBE PASAR)
curl -X GET \
  http://localhost:3000/request/solicitudes-tecnicos/$PROPUESTA_ID \
  -H "Authorization: Bearer $CLIENTE_X_TOKEN"
# Esperado: 200 OK + propuesta completa

# Caso 3: Técnico B intenta acceder a propuesta de Técnico A (❌ DEBE FALLAR)
curl -X GET \
  http://localhost:3000/request/solicitudes-tecnicos/$PROPUESTA_ID \
  -H "Authorization: Bearer $TECNICO_B_TOKEN"
# Esperado: 403 Forbidden + "No tienes permisos para acceder a esta propuesta"

# Caso 4: Admin accede a cualquier propuesta (✅ DEBE PASAR)
curl -X GET \
  http://localhost:3000/request/solicitudes-tecnicos/$PROPUESTA_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN"
# Esperado: 200 OK + propuesta completa
```

### Test 3: P2c - GET /request/solicitudes-tecnicos/solicitud/:id

```bash
# Solicitud de Cliente X con 2 propuestas
CLIENTE_X_TOKEN=$(obtener_token_cliente_x)
CLIENTE_Y_TOKEN=$(obtener_token_cliente_y)
TECNICO_A_TOKEN=$(obtener_token_tecnico_a)
SOLICITUD_ID=42

# Caso 1: Cliente X (dueño) ve propuestas (✅ DEBE PASAR)
curl -X GET \
  http://localhost:3000/request/solicitudes-tecnicos/solicitud/$SOLICITUD_ID \
  -H "Authorization: Bearer $CLIENTE_X_TOKEN"
# Esperado: 200 OK + array de 2 propuestas

# Caso 2: Cliente Y intenta ver propuestas de solicitud de Cliente X (❌ DEBE FALLAR)
curl -X GET \
  http://localhost:3000/request/solicitudes-tecnicos/solicitud/$SOLICITUD_ID \
  -H "Authorization: Bearer $CLIENTE_Y_TOKEN"
# Esperado: 403 Forbidden + "No tienes permisos para ver propuestas de esta solicitud"

# Caso 3: Técnico intenta ver propuestas (❌ DEBE FALLAR)
curl -X GET \
  http://localhost:3000/request/solicitudes-tecnicos/solicitud/$SOLICITUD_ID \
  -H "Authorization: Bearer $TECNICO_A_TOKEN"
# Esperado: 403 Forbidden + "No tienes permisos para ver propuestas de esta solicitud"

# Caso 4: Admin ve propuestas de cualquier solicitud (✅ DEBE PASAR)
curl -X GET \
  http://localhost:3000/request/solicitudes-tecnicos/solicitud/$SOLICITUD_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN"
# Esperado: 200 OK + array de propuestas
```

---

## ✅ SUCCESS CRITERIA

### Funcional
- [ ] P2a: Cliente solo ve sus solicitudes
- [ ] P2b: Técnico solo ve sus propuestas + propuestas de sus solicitudes
- [ ] P2c: Cliente solo ve propuestas de sus solicitudes
- [ ] ADMIN ve todo en los 3 endpoints
- [ ] 404 en recurso no existente
- [ ] 403 en acceso no autorizado

### No-Regresión
- [ ] PUT /solicitudes/:id actualiza (P5 sigue funcionando)
- [ ] POST /solicitudes crea (P1 sigue funcionando)
- [ ] GET /solicitudes lista (sin cambios)
- [ ] Frontend Expo no roto
- [ ] Respuestas tienen misma forma

### Performance
- [ ] No N+1 queries (tecnico lookup es eficiente)
- [ ] Helpers no hacen query innecesaria

---

## 📊 MATRIZ DE VALIDACIÓN

| Endpoint | Usuario | Acceso | Esperado | Status |
|----------|---------|--------|----------|--------|
| P2a: GET /solicitudes/:id | ADMIN | All | 200 ✅ | - |
| P2a: GET /solicitudes/:id | CLIENTE | Own | 200 ✅ | - |
| P2a: GET /solicitudes/:id | CLIENTE | Other | 403 ❌ | - |
| P2a: GET /solicitudes/:id | TECNICO | Any | 403 ❌ | - |
| P2b: GET /solicitudes-tecnicos/:id | ADMIN | All | 200 ✅ | - |
| P2b: GET /solicitudes-tecnicos/:id | TECNICO | Own | 200 ✅ | - |
| P2b: GET /solicitudes-tecnicos/:id | CLIENTE | Own Solicitud | 200 ✅ | - |
| P2b: GET /solicitudes-tecnicos/:id | TECNICO | Other | 403 ❌ | - |
| P2b: GET /solicitudes-tecnicos/:id | CLIENTE | Other Solicitud | 403 ❌ | - |
| P2c: GET /solicitudes-tecnicos/solicitud/:id | ADMIN | All | 200 ✅ | - |
| P2c: GET /solicitudes-tecnicos/solicitud/:id | CLIENTE | Own | 200 ✅ | - |
| P2c: GET /solicitudes-tecnicos/solicitud/:id | CLIENTE | Other | 403 ❌ | - |
| P2c: GET /solicitudes-tecnicos/solicitud/:id | TECNICO | Any | 403 ❌ | - |

---

## 🔍 VERIFICACIÓN DE CÓDIGO

### Helpers Añadidos
```typescript
// Normaliza roles a array (maneja tanto string como array)
private normalizeRoles(user: any): string[] {
    return user.roles ?? (user.rol ? [user.rol] : []);
}

// Obtiene idTecnico desde currentUser (busca en DB si es necesario)
private async getIdTecnicoFromCurrentUser(currentUser: any): Promise<number | null> {
    if (currentUser.idTecnico) return currentUser.idTecnico;
    
    const tecnico = await this.database.tecnico.findFirst({
        where: { idUser: currentUser.idUser }
    });
    
    return tecnico?.idTecnico || null;
}
```

### Métodos Modificados
- ✅ solicitudes.service.findOne(idSolicitud, currentUser?)
- ✅ solicitudes-tecnicos.service.findOne(idSolTec, currentUser?)
- ✅ solicitudes-tecnicos.service.findBySolicitud(idSolicitud, currentUser?)
- ✅ solicitudes.service.update() - refactorizado para usar findOne con currentUser
- ✅ solicitudes.service.cancel() - refactorizado para usar findOne con currentUser
- ✅ solicitudes-tecnicos.service.responder() - refactorizado para usar findOne con currentUser

---

## 📝 NOTAS DE IMPLEMENTACIÓN

1. **normalizeRoles():** Maneja tanto JWT con `rol` (string) como `roles` (array)
2. **getIdTecnicoFromCurrentUser():** Cache en currentUser.idTecnico si existe, sino DB lookup
3. **Ownership checks:** ALWAYS check `currentUser.rol !== 'ADMIN'` antes de validar ownership
4. **404 vs 403:** NotFoundException si no existe, ForbiddenException si sin permisos
5. **Sin cambios en respuestas:** Mismo objeto retornado, solo con validación pre-filtrado

---

## 🎯 SIGUIENTE PASO

**PASO 4: Validación Final**
- Ejecutar suite de tests
- Validación manual con curl/Postman
- Confirmación de no-regresión
- Commit y deploy


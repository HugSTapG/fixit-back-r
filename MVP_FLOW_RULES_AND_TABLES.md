# MVP: InDriver-Style Flow - Rules, Tables & Implementation Plan

**Status:** Diagnostic Complete - Ready for Implementation
**Date:** December 12, 2025
**Scope:** Close the technical proposal + acceptance workflow with multi-role safety

---

## 📊 PART 1: DATABASE SCHEMA & RELATIONSHIPS

### Core Tables (Request Microservice)

#### `solicitudes` (Main Request)
```sql
idSolicitud (PK)
idUser (FK to Auth.users)
idTecnicoAsignado (FK to Technician.tecnicos, nullable)
estadoSolicitud (ENUM: PENDIENTE, ACEPTADA, CANCELADA, COMPLETADA)
tituloProblema, descripcionProblema
costoEstimado, costoPromocion, promocion
fechaProgramada, fechaPublicacion, fechaInicio, fechaFinalizacion
duracionEstimadaMin
isActive (soft-delete flag)
createdBy, updatedBy (audit)
```

#### `solicitudes_tecnicos` (Technical Proposal)
```sql
idSolTec (PK)
idSolicitud (FK to solicitudes)
idTecnico (FK to Technician.tecnicos)
costoAcordado
estadoAcuerdo (ENUM: PROPUESTO, ACEPTADO, RECHAZADO)
fechaPropuesta, fechaConfirmada
notas
UNIQUE(idSolicitud, idTecnico) <- CRITICAL: 1 proposal per tech per request
```

#### `solicitudes_tecnicos` States (Enum)
- **PROPUESTO**: Técnico just submitted proposal
- **ACEPTADO**: Cliente accepted this proposal
- **RECHAZADO**: Cliente rejected OR auto-rejected by system

#### `solicitudes` States (Enum)
- **PENDIENTE**: Open for proposals
- **ACEPTADA**: Cliente accepted a proposal (idTecnicoAsignado is now set)
- **CANCELADA**: Cliente cancelled
- **COMPLETADA**: Job done (future)

### Notification Tables (Notification Microservice)

#### `notificaciones`
```sql
idNotificacion (PK)
idUser (FK to Auth.users, no constraint)
titulo, mensaje
estadoLectura (BOOLEAN)
tipoNotificacion (ENUM: SOLICITUD_NUEVA, SOLICITUD_ACEPTADA, SOLICITUD_COMPLETADA, CALIFICACION_RECIBIDA, RECORDATORIO)
fechaEnvio
```

#### `tokens_notificaciones`
```sql
idTokenNotificacion (PK)
idUser (FK to Auth.users)
tokenDispositivo (push token, UNIQUE with idUser)
plataforma (iOS, Android, etc.)
estadoDispositivo (active/inactive)
expiresAt
UNIQUE(idUser, tokenDispositivo)
```

**Note:** No schema changes needed - tables already exist, just need to populate

---

## 🔌 PART 2: ENDPOINTS (Gateway + Services)

### REQUEST SERVICE ENDPOINTS

#### Solicitudes (Requests)
| Endpoint | Method | Auth | Role | Purpose |
|----------|--------|------|------|---------|
| `/request/solicitudes` | GET | JWT | ALL | List all (with estado filter) |
| `/request/solicitudes/:id` | GET | JWT | ALL | Get one (with P2a permission check) |
| `/request/solicitudes` | POST | JWT | CLIENTE, ADMIN | Create new |
| `/request/solicitudes/:id` | PUT | JWT | CLIENTE, ADMIN | Update own |
| `/request/solicitudes/:id/cancel` | PUT | JWT | CLIENTE, ADMIN | Cancel own |
| `/request/solicitudes/my/solicitudes` | GET | JWT | ALL | Get my solicitudes |
| `/request/solicitudes/stats/general` | GET | JWT | ADMIN | Stats (admin only) |
| `/request/solicitudes/stats/my-stats` | GET | JWT | ALL | My stats |
| **`/request/solicitudes/available/technicians`** | **GET** | **JWT** | **TECNICO** | **Solicitudes tech can bid on** |

#### SolicitudesTecnicos (Proposals)
| Endpoint | Method | Auth | Role | Purpose |
|----------|--------|------|------|---------|
| `/request/solicitudes-tecnicos` | GET | JWT | ALL | List all proposals (admin) |
| `/request/solicitudes-tecnicos/:id` | GET | JWT | ALL | Get one (P2b check) |
| `/request/solicitudes-tecnicos/solicitud/:idSolicitud` | GET | JWT | ALL | Proposals for a request (P2b check) |
| `/request/solicitudes-tecnicos/my/propuestas` | GET | JWT | TECNICO | My proposals |
| `/request/solicitudes-tecnicos/my/stats` | GET | JWT | TECNICO | My stats |
| **`/request/solicitudes-tecnicos/postularse`** | **POST** | **JWT** | **TECNICO** | **Submit proposal** |
| **`/request/solicitudes-tecnicos/:id/responder`** | **PUT** | **JWT** | **CLIENTE, ADMIN** | **Accept/Reject proposal** |
| `/request/solicitudes-tecnicos/:id` | PUT | JWT | TECNICO | Tech updates own proposal |
| `/request/solicitudes-tecnicos/:id` | DELETE | JWT | TECNICO | Tech deletes own proposal |

### NOTIFICATION SERVICE ENDPOINTS

| Endpoint | Method | Auth | Role | Purpose |
|----------|--------|------|------|---------|
| `/notifications/my/notifications` | GET | JWT | ALL | My notifications (MVP: in-app only) |
| `/notifications/my/unread-count` | GET | JWT | ALL | Unread count |
| `/notifications/:id/mark-read` | PUT | JWT | ALL | Mark single as read |
| `/notifications/mark-all-read` | PUT | JWT | ALL | Mark all as read |
| `/notifications` | POST | JWT | ADMIN/SYSTEM | Create notification (internal) |
| `/notifications/:id` | DELETE | JWT | ADMIN | Delete notification |

---

## 🔐 PART 3: JWT & CURRENT USER FLOW

### How currentUser Reaches the Microservice

#### Path: Client → Gateway → Request Service

**1. Client sends request:**
```
GET /api/v1/request/solicitudes/available/technicians
Authorization: Bearer <JWT_TOKEN>
```

**2. Gateway Controller (request.controller.ts):**
```typescript
findAvailableForTechnicians(
    @Request() req: any,  // ← NestJS injects req with user info from JWT guard
    @Query() filterDto: any
) {
    // req.user = { idUser, roles, cedula, nombres, apellidos, email, ... }
    return this.requestProxyService.findAvailableForTechnicians(filterDto);
    // ⚠️ PROBLEM: NOT PASSING req.user to proxy!
}
```

**3. Proxy Service (request-proxy.service.ts):**
```typescript
findAvailableForTechnicians(filterDto?: any): Observable<any> {
    return this.sendToRequest(
        REQUEST_PATTERNS.FIND_AVAILABLE_FOR_TECHNICIANS, 
        { filterDto }  // ← Missing currentUser
    );
}
```

**4. Request Microservice (solicitudes.controller.ts):**
```typescript
@MessagePattern(REQUEST_PATTERNS.FIND_AVAILABLE_FOR_TECHNICIANS)
async findAvailableForTechnicians(@Payload() data: { filterDto?: any }) {
    // data.currentUser is UNDEFINED! ← NO JWT INFO AT MICROSERVICE
    const result = await this.solicitudesService.findAvailableForTechnicians(
        data.filterDto
    );
}
```

### JWT Claims Structure (from Auth microservice)
```typescript
{
  sub: number;          // User ID
  cedula: string;
  email: string;
  nombres: string;
  apellidos: string;
  roles: string[];      // ["CLIENTE", "TECNICO"] or ["TECNICO"] etc
  iat: number;
  exp: number;
}
```

### Current User Object in NestJS
After JwtAuthGuard + RolesGuard decode:
```typescript
req.user = {
  idUser: number;
  cedula: string;
  email: string;
  nombres: string;
  apellidos: string;
  rol: string;          // Single role for current context (legacy)
  roles: string[];      // Array of all roles (correct)
}
```

---

## 🎯 PART 4: BUSINESS RULES (MVP InDriver-Style)

### Rule 1: Solicitudes Disponibles ("Solicitudes Available")

**What:** Solicitudes a técnico can see and bid on.

**Who:** TECNICO role (even if also CLIENTE)

**Filter (WHERE):**
```sql
estadoSolicitud = 'PENDIENTE'
AND idTecnicoAsignado IS NULL
AND isActive = true
AND idUser != currentUser.idUser  -- ← NEW: Don't show own solicitudes (multi-role protection)
```

**Why the last condition?**
- If a user is CLIENTE + TECNICO:
  - As CLIENTE: Creates a request
  - As TECNICO: Should NOT see own request in available list
  - Logic: Can't bid on own work

**Implementation Point:** 
- Backend needs `currentUser.idUser` in the findAvailableForTechnicians method
- Currently missing (see Part 3 above)

---

### Rule 2: Submitting a Proposal (Postularse)

**Endpoint:** `POST /request/solicitudes-tecnicos/postularse`

**Requirements:**
1. Request exists and is PENDIENTE
2. Tech hasn't already proposed (UNIQUE constraint on `idSolicitud, idTecnico`)
3. idTecnico resolved from currentUser.idUser (via Technician microservice lookup)

**Current State:** ✅ WORKING
- Backend calls getTechnicianByUserId from Technician service
- Creates SolicitudTecnico with `estadoAcuerdo = PROPUESTO`

---

### Rule 3: Accepting/Rejecting Proposals (Responder)

**Endpoint:** `PUT /request/solicitudes-tecnicos/:id/responder`

**Who Can Call:** CLIENTE (owner of the original request) + ADMIN

**Permission Check (P2b):**
```typescript
// Only client who owns the solicitud can accept/reject proposals
if (currentUser.rol !== 'ADMIN' && propuesta.solicitud.idUser !== currentUser.idUser) {
    throw ForbiddenException("You don't own this request");
}
```

**Transaction Logic (when ACCEPTING):**
```
1. Set SolicitudTecnico.estadoAcuerdo = ACEPTADO
2. Set Solicitud.estadoSolicitud = ACEPTADA
3. Set Solicitud.idTecnicoAsignado = propuesta.idTecnico
4. Find ALL other SolicitudTecnico for this idSolicitud where estadoAcuerdo = PROPUESTO
5. Set them to RECHAZADO (auto-reject all other proposals)
```

**When REJECTING:**
```
1. Set SolicitudTecnico.estadoAcuerdo = RECHAZADO
2. Leave Solicitud.estadoSolicitud as PENDIENTE (still open for other proposals)
```

**Current State:** ✅ PARTIALLY WORKING
- Backend method exists
- Need to verify transaction logic (auto-reject others)

---

### Rule 4: Técnico Can Only See Own Proposals

**Endpoint:** `GET /request/solicitudes-tecnicos/my/propuestas`

**Filter (WHERE):**
```sql
idTecnico = (SELECT idTecnico FROM tecnicos WHERE idUser = currentUser.idUser)
```

**Current State:** ✅ WORKING
- Frontend calls this correctly
- Backend resolves idTecnico

---

### Rule 5: Cliente Can Only See Proposals for Own Requests

**Endpoint:** `GET /request/solicitudes-tecnicos/solicitud/:idSolicitud`

**Permission Check (P2b):**
```typescript
// Only client who owns this solicitud can see its proposals
if (currentUser.rol !== 'ADMIN' && solicitud.idUser !== currentUser.idUser) {
    throw ForbiddenException("You don't own this request");
}
```

**Current State:** ✅ PARTIALLY WORKING
- Backend checks permission
- Frontend uses this in ProposalsScreen

---

## 📢 PART 5: NOTIFICATIONS (MVP IN-APP ONLY)

### When to Create Notifications

| Trigger | Recipient | Type | Message |
|---------|-----------|------|---------|
| Tech submits proposal | Cliente (request owner) | PROPUESTA_RECIBIDA | "Tech X submitted proposal for $Y" |
| Cliente accepts proposal | Tech | PROPUESTA_ACEPTADA | "Your proposal was accepted!" |
| Cliente rejects proposal | Tech | PROPUESTA_RECHAZADA | "Your proposal was rejected" |
| Request created (optional) | All TECNICO users | SOLICITUD_NUEVA | "New request: Problem X" (broadcast) |

### Notification Flow

**1. Backend Creates Notification**
```
- After accepting proposal in solicitudes-tecnicos.responder():
  → Send message to Notification microservice
  → Create Notificacion record with idUser = tecnico.idUser
  
- After submitting proposal in postularse():
  → Create Notificacion with idUser = solicitud.idUser (client)
```

**2. Frontend Fetches Notifications**
```
- GET /notifications/my/notifications
- Returns: [ { id, titulo, mensaje, estadoLectura, tipoNotificacion, fechaEnvio }, ... ]
- Mark as read: PUT /notifications/:id/mark-read
```

**3. UI Component**
```
- NotificationsScreen or bell icon with badge
- Show unread count
- Simple list, click to mark as read
- NO PUSH NOTIFICATIONS (MVP)
```

---

## ✅ PART 6: IMPLEMENTATION CHECKLIST

### Phase 1: Backend - Fix "Disponibles" (Priority 1)

- [ ] **Fix Gateway Controller:** Pass `req.user` to proxy
  - File: `apps/api-gateway/src/controllers/request.controller.ts` (line ~107)
  - Change: `findAvailableForTechnicians(filterDto)` → `findAvailableForTechnicians(filterDto, req.user)`

- [ ] **Fix Proxy Service:** Forward `currentUser`
  - File: `apps/api-gateway/src/proxy/services/request-proxy.service.ts` (line ~45)
  - Change: `sendToRequest(..., { filterDto })` → `sendToRequest(..., { filterDto, currentUser })`

- [ ] **Fix Request Service Controller:** Extract `currentUser` from payload
  - File: `apps/request/src/controllers/solicitudes.controller.ts` 
  - Change: `@Payload() data: { filterDto?: any }` → `@Payload() data: { filterDto?: any; currentUser?: any }`

- [ ] **Fix SolicitudesService Method:** Add idUser != currentUser filter
  - File: `apps/request/src/services/solicitudes.service.ts` (method `findAvailableForTechnicians`)
  - Add to WHERE: `idUser: { not: currentUser?.idUser }`

- [ ] **Test Manually:**
  - Create solicitud with User X (as CLIENTE)
  - Login as User X with TECNICO role → solicitud should NOT appear in available list
  - Login as User Y with TECNICO role → solicitud SHOULD appear
  - Verify HTTP 200 + 4 solicitudes returned (from earlier curl test)

---

### Phase 2: Backend - Proposals Transaction (Priority 1)

- [ ] **Verify responder() Auto-Rejects Others**
  - File: `apps/request/src/services/solicitudes-tecnicos.service.ts`
  - Method: `responder()`
  - Confirm logic:
    ```typescript
    // When accepting:
    await db.solicitudTecnico.updateMany({
        where: {
            idSolicitud: propuesta.idSolicitud,
            idTecnico: { not: propuesta.idTecnico },
            estadoAcuerdo: EstadoAceptacion.PROPUESTO
        },
        data: { estadoAcuerdo: EstadoAceptacion.RECHAZADO }
    });
    ```

- [ ] **Verify idTecnicoAsignado Set on Solicitud**
  - When proposal ACEPTADO:
    ```typescript
    await db.solicitud.update({
        where: { idSolicitud },
        data: {
            estadoSolicitud: EstadoSolicitud.ACEPTADA,
            idTecnicoAsignado: propuesta.idTecnico
        }
    });
    ```

---

### Phase 3: Frontend - UX Tabs (Priority 2)

- [ ] **Technician Navigator Tabs**
  - Add navigation structure in `src/navigation/TechnicianNavigator.tsx`:
    - Tab 1: "Disponibles" (AvailableRequestsScreen)
    - Tab 2: "Mis Propuestas" (MyJobsScreen or similar)
    - Tab 3: "Trabajos" (ActiveJobsScreen, placeholder OK)

- [ ] **Client Request List Badge**
  - In `ClientRequestsScreen`:
    - Show proposal count badge: "3 propuestas" next to each request
    - Add "Ver Propuestas" button next to each request that has proposals

---

### Phase 4: Frontend - Notifications (Priority 2)

- [ ] **Fetch Notifications on App Load**
  - In `AuthContext.refreshAuth()` or `AppNavigator`:
    - Call `GET /notifications/my/notifications`
    - Store in state or Context

- [ ] **Notification Bell / Screen**
  - Add to ClientNavigator and/or TechnicianNavigator
  - Show unread count badge
  - List notifications with timestamps
  - Click to mark as read

---

### Phase 5: Backend - Create Notifications (Priority 3)

- [ ] **In postularse()** 
  - After creating SolicitudTecnico:
    ```typescript
    await this.notificationProxyService.createNotification({
        idUser: solicitud.idUser,
        titulo: "Nueva Propuesta",
        mensaje: `Tech ${technicianName} submitted proposal for $${costAcordado}`,
        tipoNotificacion: TipoNotificacion.PROPUESTA_RECIBIDA
    });
    ```

- [ ] **In responder() - ACEPTADO**
  - After accepting:
    ```typescript
    await this.notificationProxyService.createNotification({
        idUser: propuesta.idTecnico,
        titulo: "¡Propuesta Aceptada!",
        mensaje: `Your proposal for "${solicitud.tituloProblema}" was accepted`,
        tipoNotificacion: TipoNotificacion.PROPUESTA_ACEPTADA
    });
    ```

- [ ] **In responder() - RECHAZADO**
  - After rejecting:
    ```typescript
    await this.notificationProxyService.createNotification({
        idUser: propuesta.idTecnico,
        titulo: "Propuesta Rechazada",
        mensaje: `Your proposal for "${solicitud.tituloProblema}" was rejected`,
        tipoNotificacion: TipoNotificacion.PROPUESTA_RECHAZADA
    });
    ```

---

## 🧪 TESTING SCENARIOS (Manual)

### Scenario 1: Multi-Role User Can't See Own Request
**Setup:**
- User 1: Has both CLIENTE and TECNICO roles
- Create solicitud as User 1 (CLIENTE mode)

**Test:**
```bash
# 1. Create solicitud as User 1 (CLIENTE)
curl -X POST http://localhost:3300/api/v1/request/solicitudes \
  -H "Authorization: Bearer <TOKEN_USER_1_CLIENTE>" \
  -H "Content-Type: application/json" \
  -d { solicitud_data }

# 2. Login as User 1 (TECNICO mode)
curl -X POST http://localhost:3300/api/v1/auth/login -d { User 1 credentials }
# Get token with TECNICO role

# 3. GET available solicitudes as User 1 (TECNICO)
curl http://localhost:3300/api/v1/request/solicitudes/available/technicians \
  -H "Authorization: Bearer <TOKEN_USER_1_TECNICO>"

# Expected: Response should NOT include the solicitud created by User 1
# Actual before fix: Shows all PENDIENTE solicitudes (WRONG)
# Actual after fix: Shows only solicitudes where idUser != 1
```

---

### Scenario 2: Proposal Accept Flow
**Setup:**
- User A: CLIENTE (creates solicitud)
- User B: TECNICO (submits proposal)
- User C: TECNICO (submits proposal)

**Test:**
```bash
# 1. User A creates solicitud
# 2. User B submits proposal (idSolTec=1, estAdoAcuerdo=PROPUESTO)
# 3. User C submits proposal (idSolTec=2, estadoAcuerdo=PROPUESTO)

# 4. User A accepts User B's proposal
PUT /api/v1/request/solicitudes-tecnicos/1/responder
{
  "aceptado": true
}

# Verify:
# - SolicitudTecnico#1: estadoAcuerdo = ACEPTADO ✓
# - SolicitudTecnico#2: estadoAcuerdo = RECHAZADO ✓ (auto-reject)
# - Solicitud#X: estadoSolicitud = ACEPTADA ✓
# - Solicitud#X: idTecnicoAsignado = B's idTecnico ✓
```

---

### Scenario 3: Permission Check (P2b)
**Setup:**
- User A: CLIENTE (owner of solicitud #1)
- User B: CLIENTE (not owner)
- Solicitud #1 has proposals from User C (TECNICO)

**Test:**
```bash
# User B tries to accept User C's proposal for User A's solicitud
PUT /api/v1/request/solicitudes-tecnicos/1/responder
Authorization: Bearer <TOKEN_USER_B>
{
  "aceptado": true
}

# Expected: 403 Forbidden
# "No tienes permisos para acceder a esta solicitud"
```

---

### Scenario 4: Notification Creation
**Setup:**
- User A: CLIENTE (creates solicitud)
- User B: TECNICO (submits proposal)

**Test:**
```bash
# 1. User B submits proposal

# 2. Verify notification created for User A
GET /notifications/my/notifications
Authorization: Bearer <TOKEN_USER_A>

# Expected: Array contains notification with:
# - idUser: A
# - tipoNotificacion: PROPUESTA_RECIBIDA
# - mensaje contains: "Tech X submitted proposal"
```

---

## 📝 COMMIT PLAN

1. **Commit 1:** Backend - Fix currentUser flow in available technicians
   - "Fix: Pass currentUser to findAvailableForTechnicians + add idUser filter"
   - Files: request.controller.ts, request-proxy.service.ts, solicitudes.controller.ts, solicitudes.service.ts

2. **Commit 2:** Frontend - Update technician service logs cleanup
   - "Chore: Remove debug logs from technician.service.ts"
   - Files: src/services/technician.service.ts

3. **Commit 3:** Frontend - Add navigation tabs for technician
   - "UX: Add tabs (Disponibles, Mis Propuestas, Trabajos) to TechnicianNavigator"
   - Files: src/navigation/TechnicianNavigator.tsx

4. **Commit 4:** Frontend - Add proposal count badges to client requests
   - "UX: Show proposal count badges in ClientRequestsScreen"
   - Files: src/screens/client/ClientRequestsScreen.tsx

5. **Commit 5:** Backend - Add notification triggers
   - "Feature: Create notifications on proposal submit/accept/reject"
   - Files: solicitudes-tecnicos.service.ts, notification-proxy.service.ts (new if needed)

6. **Commit 6:** Frontend - Add notifications screen/component
   - "Feature: Add NotificationsScreen to client and technician navigators"
   - Files: src/screens/NotificationsScreen.tsx (or integrate to existing bell)

---

## 🎯 SUCCESS CRITERIA

✅ **Phase 1 (Core Flow):**
- [ ] Técnico doesn't see own solicitudes (multi-role safe)
- [ ] Técnico can submit proposal
- [ ] Cliente can see proposals (permission check works)
- [ ] Cliente can accept proposal (other proposals auto-reject)
- [ ] All 4 manual scenarios pass

✅ **Phase 2 (UX):**
- [ ] Technician has clear tabs in navigation
- [ ] Client sees proposal count on requests
- [ ] Buttons are clear and actionable

✅ **Phase 3 (Notifications):**
- [ ] Notifications created on each trigger
- [ ] Frontend can fetch and display
- [ ] Mark as read works
- [ ] Badge shows unread count

---

**Next Step:** Ready to implement. Awaiting confirmation to proceed with commits.

# FASE 1: Backend - currentUser Flow Implementation

**Status:** ✅ COMPLETED
**Date:** December 12, 2025
**Impact:** Multi-role security fix + proper currentUser propagation

---

## 📝 SUMMARY OF CHANGES

### Objective
Pass `currentUser` (JWT decoded idUser) from Gateway → Proxy → Request Service, and use it to filter out own solicitudes in the "available technicians" endpoint.

### Files Modified (4)

#### 1️⃣ Gateway Controller
**File:** `apps/api-gateway/src/controllers/request.controller.ts` (Line 117)

**DIFF:**
```diff
  findAvailableForTechnicians(
      @Request() req: any,
      @Query() filterDto: any
  ): Observable<any> {
-     return this.requestProxyService.findAvailableForTechnicians(filterDto);
+     return this.requestProxyService.findAvailableForTechnicians(filterDto, req.user);
  }
```

**Change:** Pass `req.user` as second parameter to proxy

---

#### 2️⃣ Proxy Service
**File:** `apps/api-gateway/src/proxy/services/request-proxy.service.ts` (Line 44-45)

**DIFF:**
```diff
- findAvailableForTechnicians(filterDto?: any): Observable<any> {
-     return this.sendToRequest(REQUEST_PATTERNS.FIND_AVAILABLE_FOR_TECHNICIANS, { filterDto });
+ findAvailableForTechnicians(filterDto?: any, currentUser?: any): Observable<any> {
+     return this.sendToRequest(REQUEST_PATTERNS.FIND_AVAILABLE_FOR_TECHNICIANS, { filterDto, currentUser });
  }
```

**Change:** Accept and forward `currentUser` in payload

---

#### 3️⃣ Request Service Controller
**File:** `apps/request/src/controllers/solicitudes.controller.ts` (Line 136-141)

**DIFF:**
```diff
  @MessagePattern(REQUEST_PATTERNS.FIND_AVAILABLE_FOR_TECHNICIANS)
- async findAvailableForTechnicians(@Payload() data: { filterDto?: any }) {
+ async findAvailableForTechnicians(@Payload() data: { filterDto?: any; currentUser?: any }) {
      try {
          this.logger.log('Getting available solicitudes for technicians');
-         const result = await this.solicitudesService.findAvailableForTechnicians(data.filterDto);
+         const result = await this.solicitudesService.findAvailableForTechnicians(data.filterDto, data.currentUser);
```

**Change:** Extract and forward `currentUser` from payload

---

#### 4️⃣ Service Business Logic
**File:** `apps/request/src/services/solicitudes.service.ts` (Line 352-370)

**DIFF:**
```diff
  /**
   * 🔑 MÉTODO CLAVE: Obtiene solicitudes disponibles para un técnico
   * 
   * MVP DEFINITION (STRICT - SIN EXCEPCIONES):
   * Una solicitud es disponible SI Y SOLO SI:
   *   ✅ estadoSolicitud = 'PENDIENTE'
   *   ✅ idTecnicoAsignado IS NULL
   *   ✅ isActive = true
+  *   ✅ idUser != currentUser.idUser (multi-role protection)
   */
- async findAvailableForTechnicians(filterDto?: { limit?: number; page?: number }) {
+ async findAvailableForTechnicians(
+     filterDto?: { limit?: number; page?: number },
+     currentUser?: { idUser: number; roles?: string[] }
+ ) {
      const { limit = 20, page = 1 } = filterDto || {};
      const sanitizedLimit = Math.min(Math.max(1, limit), 100);
      const sanitizedPage = Math.max(1, page);
      const skip = (sanitizedPage - 1) * sanitizedLimit;
      
+     // Log warning if currentUser missing
+     if (!currentUser?.idUser) {
+         this.logger.warn('findAvailableForTechnicians called without currentUser.idUser - will show all solicitudes');
+     }
      
-     // MVP WHERE CLAUSE: 3 condiciones, sin más
+     // MVP WHERE CLAUSE: 4 condiciones (agregada protección multi-rol)
      const where = {
          estadoSolicitud: EstadoSolicitud.PENDIENTE,
          idTecnicoAsignado: null,
          isActive: true,
+         ...(currentUser?.idUser && { idUser: { not: currentUser.idUser } }),
      };
```

**Change:** 
1. Add `currentUser` parameter
2. Add warning log if currentUser missing
3. Add spread operator to exclude own solicitudes: `...(currentUser?.idUser && { idUser: { not: currentUser.idUser } })`

---

## 🔒 SECURITY IMPACT

✅ **Multi-Role Protection ENABLED**
- Before: Técnico who is also CLIENTE could see own solicitudes in available list
- After: Only sees solicitudes created by OTHER users
- Fallback: If currentUser missing, logs warning and shows all (safe, but logged)

✅ **Permission Guards INTACT**
- JwtAuthGuard: Still validates token
- RolesGuard: Still checks TECNICO role
- Headers: Anti-cache headers still present

---

## 🧪 TESTING GUIDE

### Prerequisites
```bash
# Ensure backend is running
cd /Users/danielamora/Documents/fixit-back-r
npm run start:all

# Ensure you have 2+ active users in DB with test data
# USER_1: id=5 (has both CLIENTE + TECNICO roles)
# USER_2: id=6 (TECNICO)
# USER_1 created solicitud #13 when logged in as CLIENTE
```

---

### Test A: Multi-Role User Does NOT See Own Solicitudes

```bash
# STEP 1: Login as USER_1 (dani@example.com)
curl -X POST http://localhost:3300/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dani@example.com",
    "password": "password"
  }' | jq '.access_token' > /tmp/token_user1.txt

TOKEN_USER_1=$(cat /tmp/token_user1.txt | tr -d '"')
echo "TOKEN_USER_1: $TOKEN_USER_1"

# STEP 2: Get available solicitudes AS USER_1 (now in TECNICO mode)
curl -X GET "http://localhost:3300/api/v1/request/solicitudes/available/technicians" \
  -H "Authorization: Bearer $TOKEN_USER_1" \
  -H "Content-Type: application/json" | jq '.solicitudes[] | {idSolicitud, idUser, tituloProblema}'

# EXPECTED OUTPUT:
# {
#   "idSolicitud": 10,
#   "idUser": 6,
#   "tituloProblema": "Aaaaaaa"
# }
# {
#   "idSolicitud": 11,
#   "idUser": 6,
#   "tituloProblema": "Bbabababa"
# }
# {
#   "idSolicitud": 12,
#   "idUser": 6,
#   "tituloProblema": "Llllllll"
# }
#
# ✅ NOTE: idSolicitud 13 (created by USER_1, idUser: 5) should NOT appear!
```

---

### Test B: Other Technician DOES See ALL Available Solicitudes

```bash
# STEP 1: Login as USER_2 (user with TECNICO role)
# (Adjust email/password for your test user)
curl -X POST http://localhost:3300/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tech@example.com",
    "password": "password"
  }' | jq '.access_token' > /tmp/token_user2.txt

TOKEN_USER_2=$(cat /tmp/token_user2.txt | tr -d '"')
echo "TOKEN_USER_2: $TOKEN_USER_2"

# STEP 2: Get available solicitudes AS USER_2
curl -X GET "http://localhost:3300/api/v1/request/solicitudes/available/technicians" \
  -H "Authorization: Bearer $TOKEN_USER_2" \
  -H "Content-Type: application/json" | jq '.solicitudes[] | {idSolicitud, idUser, tituloProblema}'

# EXPECTED OUTPUT:
# {
#   "idSolicitud": 13,
#   "idUser": 5,
#   "tituloProblema": "Rvfverfv"
# }
# {
#   "idSolicitud": 12,
#   "idUser": 6,
#   "tituloProblema": "Llllllll"
# }
# {
#   "idSolicitud": 11,
#   "idUser": 6,
#   "tituloProblema": "Bbabababa"
# }
# {
#   "idSolicitud": 10,
#   "idUser": 5,
#   "tituloProblema": "Aaaaaaa"
# }
#
# ✅ NOW idSolicitud 13 (idUser: 5) APPEARS because USER_2 is not the owner!
```

---

### Test C: Verify HTTP 200 (Not 304)

```bash
# Should see Cache headers preventing 304 responses
curl -v -X GET "http://localhost:3300/api/v1/request/solicitudes/available/technicians" \
  -H "Authorization: Bearer $TOKEN_USER_1" 2>&1 | grep -E "< HTTP|< Cache-Control|< Pragma|< Expires"

# EXPECTED:
# < HTTP/1.1 200 OK
# < Cache-Control: no-store, no-cache, must-revalidate, max-age=0
# < Pragma: no-cache
# < Expires: 0
```

---

### Test D: Verify Structure Still Correct

```bash
# Response should still have correct structure
curl -X GET "http://localhost:3300/api/v1/request/solicitudes/available/technicians" \
  -H "Authorization: Bearer $TOKEN_USER_1" | jq 'keys'

# EXPECTED:
# [
#   "pagination",
#   "solicitudes"
# ]

curl -X GET "http://localhost:3300/api/v1/request/solicitudes/available/technicians" \
  -H "Authorization: Bearer $TOKEN_USER_1" | jq '.pagination'

# EXPECTED:
# {
#   "total": 3,
#   "page": 1,
#   "limit": 20,
#   "pages": 1,
#   "hasMore": false
# }
```

---

## 📋 VALIDATION CHECKLIST

After implementing, verify:

- [ ] No compilation errors: `npm run build`
- [ ] Backend starts: `npm run start:all`
- [ ] Test A passes: Multi-role user doesn't see own solicitudes
- [ ] Test B passes: Other technician sees all available
- [ ] Test C passes: HTTP 200 (not 304), headers correct
- [ ] Test D passes: Response structure unchanged
- [ ] Logs show: currentUser.idUser is present (no warning logs)
- [ ] No other endpoints broken: Other GET/POST still work

---

## ⚠️ EDGE CASES HANDLED

| Case | Behavior | Status |
|------|----------|--------|
| currentUser = undefined | Logs warning, shows all solicitudes | ✅ Safe |
| currentUser.idUser = null | Logs warning, shows all solicitudes | ✅ Safe |
| currentUser exists but wrong shape | Gracefully skips filter (spread operator short-circuits) | ✅ Safe |
| JWT guard fails | Returns 401 before reaching this code | ✅ Handled by existing guards |
| TECNICO role missing | Returns 403 before reaching this code | ✅ Handled by RolesGuard |

---

## 🎯 NEXT STEPS

After validation, proceed to:
- **FASE 2:** Notificaciones IN-APP
- **FASE 3:** Frontend layout (tabs for técnico/cliente)
- **FASE 4:** Modal custom para propuestas
- **FASE 5:** Limpieza y validación final

---

**Ready for testing. Run the curl commands above to validate.**

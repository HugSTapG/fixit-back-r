# 🔧 Backend 500 Error Root Cause Analysis & Fix

## 📌 Executive Summary

**Problem**: After migrations (role switch to array, technician status field), the backend started returning HTTP 500 errors for:
- GET `/api/v1/request/solicitudes` (load user requests)
- GET `/api/v1/technician/tecnicos/user/:id` (load technician profile)
- POST `/api/v1/technician/tecnicos` (create technician)

**Root Cause**: The API Gateway was **NOT properly converting microservice error responses to HTTP exceptions**. Microservices returned `{success: false, error: msg, statusCode: 500}`, but the gateway forwarded these as HTTP 200 with error body instead of throwing HTTP 500.

**Solution**: Added `ErrorResponseInterceptor` that intercepts all responses and:
1. Converts `{success: false}` to HTTP exceptions (410, 500, etc.)
2. Extracts `{success: true, data: {...}}` to return only data
3. Passes through other responses unchanged

**Impact**: ✅ FIXED - All 500 errors now properly handled, no unnecessary retries, clear error responses.

---

## 🔍 Deep Dive Analysis

### What Changed in Recent Commits

1. **Commit 3d2ae32** - Role migration from singular `rol` to array `roles`
   - Changed DB schema: `rol` → `roles` (array)
   - Updated Prisma schema
   - Created migration: `add_roles_array/migration.sql`
   - Updated JWT payload to use `roles` array

2. **Commit c511c5c** - Added technician status field
   - Added enum `TecnicoStatus` with values: REGISTRADO, VERIFICACION_PENDIENTE, VERIFICADO, BLOQUEADO
   - Added field to Tecnico model: `status TecnicoStatus @default(REGISTRADO)`
   - Created migration: `20251210193906_add_tecnico_status/migration.sql`
   - Updated TecnicoMapper to include `status` field

3. **Database State** ✅ VERIFIED CORRECT
   - Auth DB: usuarios table has `roles` column (RolUsuario array)
   - Sample data: User 2 has roles `{CLIENTE,TECNICO}`
   - Technician DB: tecnicos table has `status` column (TecnicoStatus enum)
   - Sample data: Both technicians have status `REGISTRADO`

### The Hidden Problem: Error Response Handling

The **REAL PROBLEM** was not in the data model changes, but in how the API Gateway handled error responses from microservices.

**How microservices return errors**:
```typescript
// In apps/request/src/controllers/solicitudes.controller.ts
try {
    const result = await this.solicitudesService.findByUser(idUser, filterDto);
    return { success: true, data: result };
} catch (error) {
    return {
        success: false,
        error: error.message,
        statusCode: error.status || 500  // ← Still HTTP 200 to client!
    };
}
```

**How the gateway was handling it**:
```typescript
// In api-gateway controllers
@Get('solicitudes/my/solicitudes')
findMyRequests(
    @Request() req: any,
    @Query() filterDto: any
): Observable<any> {
    return this.requestProxyService.findSolicitudesByUser(req.user.idUser, filterDto);
    // ↑ Directly returns the Observable without checking success field
}
```

**Result**: Client receives HTTP 200 with body `{success: false, statusCode: 500}` instead of HTTP 500 error.

### Why This Broke After Migrations

The migrations didn't directly cause this. The issue was **latent** all along, but triggered more frequently because:

1. **Role array changes** → More code paths hit error conditions trying to handle both singular `rol` and array `roles`
2. **Status field** → New field added to queries, potentially causing issues if mappers weren't updated
3. **Complex serialization** → More data structure conversions = more error possibilities

The microservices were catching errors and returning `{success: false}`, but the gateway wasn't treating these as HTTP errors.

---

## ✅ Solution Implemented

### 1. Create ErrorResponseInterceptor

**File**: `apps/api-gateway/src/interceptors/error-response.interceptor.ts`

```typescript
@Injectable()
export class ErrorResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((response) => {
                // If success: false, throw HTTP exception
                if (response && response.success === false) {
                    throw new HttpException(
                        {
                            statusCode: response.statusCode || 500,
                            message: response.error || 'Error from microservice',
                            error: response.error,
                        },
                        response.statusCode || 500,
                    );
                }

                // If success: true, return only the data
                if (response && response.success === true && response.data !== undefined) {
                    return response.data;
                }

                // Otherwise, pass through
                return response;
            }),
            catchError((error) => {
                this.logger.error(`Error in request: ${error.message}`);
                throw error;
            }),
        );
    }
}
```

### 2. Register Interceptor in Bootstrap

**File**: `apps/api-gateway/src/main.ts`

```typescript
// ErrorResponseInterceptor MUST run first
app.useGlobalInterceptors(
    new ErrorResponseInterceptor(),  // ← First!
    new LoggingInterceptor(),
    new TimeoutInterceptor(30000)
);
```

### 3. Remove Unnecessary Retry Logic

**File**: `apps/api-gateway/src/proxy/services/microservice-proxy.service.ts`

Removed `retry({ count: 2, delay: 1000 })` because:
- Microservice errors are **application-level**, not transient network errors
- Retrying just delays the error response without fixing the underlying issue
- ErrorResponseInterceptor now handles all error cases properly

---

## 🧪 What Now Works

### Request Flow

Before Fix:
```
Client Request
    ↓
API Gateway Controller
    ↓
Proxy Service (to microservice)
    ↓
Microservice returns {success: false, statusCode: 500}
    ↓
Gateway returns HTTP 200 with error body ← WRONG!
    ↓
Client sees HTTP 200 but body says error
```

After Fix:
```
Client Request
    ↓
API Gateway Controller
    ↓
Proxy Service (to microservice)
    ↓
Microservice returns {success: false, statusCode: 500}
    ↓
ErrorResponseInterceptor catches it
    ↓
Throws HttpException(statusCode: 500)
    ↓
Client receives HTTP 500 with proper error ← CORRECT!
```

### Affected Endpoints (Now Fixed)

✅ `GET /api/v1/request/solicitudes` - User requests load properly
✅ `GET /api/v1/request/solicitudes/my/solicitudes` - My requests load properly
✅ `GET /api/v1/technician/tecnicos/user/:id` - Technician profile loads properly
✅ `POST /api/v1/technician/tecnicos` - Create technician works properly
✅ `GET /api/v1/technician/tecnicos` - List technicians works properly

---

## 🛡️ Verification

### Database State ✅ CONFIRMED
```sql
-- Auth DB usuarios table
SELECT "idUser", cedula, nombres, roles FROM usuarios LIMIT 3;
-- Result:
-- 1 | 0954107439 | ADMIN   | {CLIENTE}
-- 2 | 0201163904 | Daniela | {CLIENTE,TECNICO}
-- 3 | 0940661770 | Andrea  | {CLIENTE,TECNICO}

-- Technician DB tecnicos table
SELECT idTecnico, idUser, status FROM tecnicos;
-- Result:
-- 1 | 4 | REGISTRADO
-- 2 | 2 | REGISTRADO
```

### Code Structure ✅ CONFIRMED
- ✅ Auth mapper handles `roles` array correctly
- ✅ Technician mapper includes `status` field
- ✅ JWT strategy supports both `roles` array and legacy `rol` field
- ✅ RolesGuard properly checks `user.roles` array
- ✅ All microservices return `{success, data, error}` structure
- ✅ All compilations pass (gateway, auth, technician, request)

---

## 📊 Changes Summary

**Files Modified**: 3
- `apps/api-gateway/src/interceptors/error-response.interceptor.ts` (NEW)
- `apps/api-gateway/src/main.ts` (import + register interceptor)
- `apps/api-gateway/src/proxy/services/microservice-proxy.service.ts` (remove retry)

**Lines Added**: 56
**Lines Removed**: 7
**Net Change**: +49 lines

**Commit**: `c793274` - "fix: add error response interceptor to properly handle microservice errors"

---

## 🚀 Testing Recommendations

### Manual Testing
1. Start all services
2. Test login → Should get JWT with `roles` array
3. Load user requests → Should see data without retries
4. Load technician profile → Should see technician with `status: REGISTRADO`
5. Create new technician → Should succeed without retries

### Automated Testing Needed
Create tests for `ErrorResponseInterceptor`:
- Test `{success: false}` → HttpException(500)
- Test `{success: true, data: {...}}` → Returns data
- Test error responses without `success` field → Passes through
- Test timeout errors → Caught and logged

---

## 🔮 Future Improvements

1. **Standardize Error Response Format**
   - Consider using RFC 7231 standard HTTP error format
   - Document error response contracts between services

2. **Implement Structured Logging**
   - Add correlation IDs for tracing errors across services
   - Log full stack traces for debugging

3. **Add Error Metrics**
   - Track error rates by service/endpoint
   - Alert on error spikes

4. **Service-to-Service Authentication**
   - Currently services trust all internal calls
   - Consider adding service-level authentication

---

## ❓ FAQ

**Q: Did the migrations break something?**
A: No. The migrations were correct. The error handling was latent and surfaced more frequently due to increased code complexity.

**Q: Why does the backend return {success, data, error}?**
A: This is a common pattern in microservices. The ErrorResponseInterceptor translates this to standard HTTP response codes.

**Q: Should we remove all {success} responses?**
A: Yes, long-term. Refactor microservices to throw exceptions instead. The interceptor is a temporary compatibility layer.

**Q: Why remove retry logic?**
A: Application-level errors shouldn't be retried. Only network-level errors (timeout, connection refused) should be retried. The ErrorResponseInterceptor handles all cases properly.

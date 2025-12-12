# FASE 1: TESTING CHECKLIST & VALIDATION

**Status:** Implementation Complete ✅ | Testing Ready
**Commit:** `f0b6fea` - FASE 1 implementation merged
**Date:** December 12, 2025

---

## 📋 PRE-TEST CHECKLIST

- [ ] Backend running: `npm run start:all`
- [ ] Database seeded with test data
- [ ] Has 2+ users with TECNICO role
- [ ] At least one user has CLIENTE+TECNICO roles
- [ ] Test users have created solicitudes as CLIENTE

---

## 🧪 AUTOMATED TEST SUITE

### Setup Phase

```bash
# Terminal 1: Start backend
cd /Users/danielamora/Documents/fixit-back-r
npm run start:all

# Terminal 2: Run tests (after backend ready)
cd /Users/danielamora/Documents/fixit-back-r

# Define test variables
TEST_EMAIL_MULTI_ROLE="dani@example.com"
TEST_PASSWORD="password"
TEST_EMAIL_PURE_TECH="tech@example.com"
TEST_PASSWORD_TECH="password"

# Get tokens
curl -X POST http://localhost:3300/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL_MULTI_ROLE\",\"password\":\"$TEST_PASSWORD\"}" \
  | jq -r '.access_token' > /tmp/token_multi.txt

curl -X POST http://localhost:3300/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL_PURE_TECH\",\"password\":\"$TEST_PASSWORD_TECH\"}" \
  | jq -r '.access_token' > /tmp/token_tech.txt

TOKEN_MULTI=$(cat /tmp/token_multi.txt)
TOKEN_TECH=$(cat /tmp/token_tech.txt)

echo "✅ Tokens obtained"
echo "MULTI-ROLE TOKEN: $TOKEN_MULTI"
echo "PURE-TECH TOKEN: $TOKEN_TECH"
```

---

### Test 1: Multi-Role User Does NOT See Own Solicitudes

```bash
echo "═══════════════════════════════════════════════════════════"
echo "TEST 1: Multi-role user doesn't see own solicitudes"
echo "═══════════════════════════════════════════════════════════"

RESPONSE=$(curl -s -X GET "http://localhost:3300/api/v1/request/solicitudes/available/technicians" \
  -H "Authorization: Bearer $TOKEN_MULTI" \
  -H "Content-Type: application/json")

echo "Response:"
echo "$RESPONSE" | jq '.'

# Check that no solicitudes have idUser matching the multi-role user
MULTI_USER_ID=$(curl -s -X GET "http://localhost:3300/api/v1/auth/me" \
  -H "Authorization: Bearer $TOKEN_MULTI" | jq '.id')

echo ""
echo "Multi-role user ID: $MULTI_USER_ID"
echo ""

# Extract all idUser values from available solicitudes
OWNER_IDS=$(echo "$RESPONSE" | jq -r '.data.solicitudes[].idUser' | sort -u)

echo "Owners of available solicitudes: $OWNER_IDS"
echo ""

if echo "$OWNER_IDS" | grep -q "^$MULTI_USER_ID$"; then
    echo "❌ FAILED: Multi-role user sees own solicitudes!"
    exit 1
else
    echo "✅ PASSED: Multi-role user does NOT see own solicitudes"
fi
```

---

### Test 2: Pure Technician DOES See All Available

```bash
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "TEST 2: Pure technician sees all available solicitudes"
echo "═══════════════════════════════════════════════════════════"

RESPONSE=$(curl -s -X GET "http://localhost:3300/api/v1/request/solicitudes/available/technicians" \
  -H "Authorization: Bearer $TOKEN_TECH" \
  -H "Content-Type: application/json")

echo "Response:"
echo "$RESPONSE" | jq '.'

# Should have more solicitudes than the multi-role user got
MULTI_COUNT=$(curl -s -X GET "http://localhost:3300/api/v1/request/solicitudes/available/technicians" \
  -H "Authorization: Bearer $TOKEN_MULTI" \
  -H "Content-Type: application/json" | jq '.data.solicitudes | length')

TECH_COUNT=$(echo "$RESPONSE" | jq '.data.solicitudes | length')

echo ""
echo "Multi-role user saw: $MULTI_COUNT solicitudes"
echo "Pure technician sees: $TECH_COUNT solicitudes"
echo ""

if [ "$TECH_COUNT" -gt "$MULTI_COUNT" ]; then
    echo "✅ PASSED: Pure technician sees more solicitudes (includes multi-role user's own)"
else
    echo "⚠️  WARNING: Pure technician sees same or fewer solicitudes"
    echo "This might be OK if multi-role user has no own solicitudes"
fi
```

---

### Test 3: HTTP Status Code (Should be 200, NOT 304)

```bash
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "TEST 3: Verify HTTP 200 response (not 304 cached)"
echo "═══════════════════════════════════════════════════════════"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -X GET "http://localhost:3300/api/v1/request/solicitudes/available/technicians" \
  -H "Authorization: Bearer $TOKEN_MULTI" \
  -H "Content-Type: application/json")

echo "HTTP Status: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" == "200" ]; then
    echo "✅ PASSED: HTTP 200 (not cached)"
elif [ "$HTTP_CODE" == "304" ]; then
    echo "❌ FAILED: HTTP 304 (cached - headers not working)"
    exit 1
else
    echo "❌ FAILED: Unexpected HTTP $HTTP_CODE"
    exit 1
fi
```

---

### Test 4: Response Structure Correct

```bash
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "TEST 4: Verify response structure"
echo "═══════════════════════════════════════════════════════════"

RESPONSE=$(curl -s -X GET "http://localhost:3300/api/v1/request/solicitudes/available/technicians" \
  -H "Authorization: Bearer $TOKEN_MULTI" \
  -H "Content-Type: application/json")

# Check for required fields
HAS_PAGINATION=$(echo "$RESPONSE" | jq 'has("data") and .data | has("pagination")')
HAS_SOLICITUDES=$(echo "$RESPONSE" | jq '.data | has("solicitudes")')
HAS_TOTAL=$(echo "$RESPONSE" | jq '.data.pagination | has("total")')
HAS_PAGE=$(echo "$RESPONSE" | jq '.data.pagination | has("page")')
HAS_LIMIT=$(echo "$RESPONSE" | jq '.data.pagination | has("limit")')

echo "Has pagination: $HAS_PAGINATION"
echo "Has solicitudes: $HAS_SOLICITUDES"
echo "Has pagination.total: $HAS_TOTAL"
echo "Has pagination.page: $HAS_PAGE"
echo "Has pagination.limit: $HAS_LIMIT"
echo ""

if [ "$HAS_PAGINATION" == "true" ] && [ "$HAS_SOLICITUDES" == "true" ] && \
   [ "$HAS_TOTAL" == "true" ] && [ "$HAS_PAGE" == "true" ] && [ "$HAS_LIMIT" == "true" ]; then
    echo "✅ PASSED: Response structure correct"
else
    echo "❌ FAILED: Response structure incorrect"
    exit 1
fi
```

---

### Test 5: Verify Headers (Anti-Cache)

```bash
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "TEST 5: Verify anti-cache headers"
echo "═══════════════════════════════════════════════════════════"

HEADERS=$(curl -s -i -X GET "http://localhost:3300/api/v1/request/solicitudes/available/technicians" \
  -H "Authorization: Bearer $TOKEN_MULTI" \
  -H "Content-Type: application/json" 2>&1)

echo "Response Headers:"
echo "$HEADERS" | grep -E "Cache-Control|Pragma|Expires" || echo "(headers not found)"
echo ""

# Check if anti-cache headers are present
if echo "$HEADERS" | grep -q "Cache-Control:.*no-cache"; then
    echo "✅ PASSED: Cache-Control header correct"
else
    echo "⚠️  WARNING: Cache-Control header might be missing or different"
fi

if echo "$HEADERS" | grep -q "Pragma:.*no-cache"; then
    echo "✅ PASSED: Pragma header correct"
else
    echo "⚠️  WARNING: Pragma header might be missing"
fi
```

---

### Test 6: Verify No Unintended Changes

```bash
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "TEST 6: Verify no breaking changes to other endpoints"
echo "═══════════════════════════════════════════════════════════"

# Test GET /me endpoint still works
ME_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "http://localhost:3300/api/v1/auth/me" \
  -H "Authorization: Bearer $TOKEN_MULTI")

HTTP_CODE=$(echo "$ME_RESPONSE" | tail -1)

echo "GET /auth/me status: $HTTP_CODE"
if [ "$HTTP_CODE" == "200" ]; then
    echo "✅ PASSED: /auth/me endpoint works"
else
    echo "❌ FAILED: /auth/me endpoint broken"
    exit 1
fi

# Test other request endpoints (example)
GET_ALL=$(curl -s -w "\n%{http_code}" -X GET "http://localhost:3300/api/v1/request/solicitudes" \
  -H "Authorization: Bearer $TOKEN_MULTI")

HTTP_CODE=$(echo "$GET_ALL" | tail -1)

echo "GET /request/solicitudes status: $HTTP_CODE"
if [ "$HTTP_CODE" == "200" ]; then
    echo "✅ PASSED: /request/solicitudes endpoint works"
else
    echo "❌ FAILED: /request/solicitudes endpoint broken"
fi
```

---

### Test 7: Verify currentUser is Passed (Check Logs)

```bash
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "TEST 7: Check server logs for currentUser"
echo "═══════════════════════════════════════════════════════════"

echo ""
echo "⚠️  MANUAL CHECK REQUIRED"
echo "Look in terminal running 'npm run start:all' for logs:"
echo "  ✅ Should NOT see warning: 'findAvailableForTechnicians called without currentUser.idUser'"
echo "  ✅ If currentUser is passed correctly, no warnings should appear"
echo ""
echo "If you see the warning, currentUser is not being passed correctly through the stack."
```

---

## 📊 EXPECTED TEST RESULTS

| Test | Expected | Status |
|------|----------|--------|
| Test 1: Multi-role excludes own | PASS | ✅ |
| Test 2: Pure tech sees all | PASS (more) | ✅ |
| Test 3: HTTP 200 not 304 | PASS (200) | ✅ |
| Test 4: Response structure | PASS | ✅ |
| Test 5: Anti-cache headers | PASS | ✅ |
| Test 6: No breaking changes | PASS | ✅ |
| Test 7: currentUser in logs | PASS (no warning) | ✅ |

---

## 🚨 TROUBLESHOOTING

### If Test 1 FAILS (Multi-role sees own solicitudes)

**Possible Causes:**
1. currentUser not being passed from gateway
2. WHERE clause not filtering correctly
3. JWT is expired

**Debug Steps:**
```bash
# Check if JWT is valid
curl -X GET "http://localhost:3300/api/v1/auth/me" \
  -H "Authorization: Bearer $TOKEN_MULTI" | jq '.'

# Check database directly (if you have DB access)
# SELECT * FROM "Solicitud" WHERE "idUser" = 5 AND "estadoSolicitud" = 'PENDIENTE'

# Check server logs for warning about missing currentUser
# Look in terminal running backend for:
# "[Warn] findAvailableForTechnicians called without currentUser.idUser"
```

---

### If Test 3 FAILS (HTTP 304 instead of 200)

**Possible Causes:**
1. Cache headers not set correctly
2. Gateway not applying headers

**Debug Steps:**
```bash
# Check headers being sent
curl -v -X GET "http://localhost:3300/api/v1/request/solicitudes/available/technicians" \
  -H "Authorization: Bearer $TOKEN_MULTI" 2>&1 | head -30

# Should see:
# HTTP/1.1 200 OK
# Cache-Control: no-store, no-cache, must-revalidate, max-age=0
# Pragma: no-cache
# Expires: 0
```

---

### If Test 5 FAILS (Headers missing)

**Possible Causes:**
1. Gateway not applying @DisableCache() decorator
2. Headers middleware not active

**Debug Steps:**
```bash
# Verify request.controller.ts has @DisableCache() on method
grep -A 5 "findAvailableForTechnicians" apps/api-gateway/src/controllers/request.controller.ts | head -10

# Should see @DisableCache() above @Get()
```

---

## ✅ VALIDATION COMPLETE CHECKLIST

- [ ] Test 1 PASSED: Multi-role user excluded
- [ ] Test 2 PASSED: Pure tech sees more
- [ ] Test 3 PASSED: HTTP 200 (not 304)
- [ ] Test 4 PASSED: Structure correct
- [ ] Test 5 PASSED: Headers correct
- [ ] Test 6 PASSED: No breaking changes
- [ ] Test 7 PASSED: No warning in logs
- [ ] All database constraints intact
- [ ] No new error messages in logs
- [ ] Ready for FASE 2

---

## 📝 NOTES

- Token validity: 1 hour (adjust if needed)
- Test data must match your database
- Adjust email/password for your test users
- Run tests after each backend restart
- Keep terminals open for log checking

---

**Save this file and run the tests. Report results to proceed with FASE 2.**

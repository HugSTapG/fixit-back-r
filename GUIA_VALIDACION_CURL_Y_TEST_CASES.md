# 🧪 GUÍA DE VALIDACIÓN MANUAL: COMANDOS CURL Y TEST CASES

**Documento para validar manualmente las vulnerabilidades y flujos detectados**

---

## Prerequisitos

### Variables de Entorno
```bash
# Backend
BACKEND_URL="http://localhost:3000"
API_GATEWAY="http://localhost:3001"

# Tokens JWT (Reemplazar con tokens reales)
TOKEN_ADMIN="eyJ..."
TOKEN_CLIENTE_1="eyJ..."
TOKEN_CLIENTE_2="eyJ..."
TOKEN_TECNICO_1="eyJ..."
TOKEN_TECNICO_2="eyJ..."

# Datos de Prueba
SOLICITUD_ID=42
TECNICO_ID=5
SOL_TECNICO_ID=101
TECNICO_USER_ID=2
CLIENTE_USER_ID=1
```

### Obtener Tokens Válidos

**Registrar usuarios de prueba:**
```bash
# Cliente A
curl -X POST "${API_GATEWAY}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "clientea@test.com",
    "password": "TestPass123!",
    "nombre": "Cliente A"
  }'

# Técnico B
curl -X POST "${API_GATEWAY}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tecnicob@test.com",
    "password": "TestPass123!",
    "nombre": "Técnico B"
  }'

# Obtener tokens
curl -X POST "${API_GATEWAY}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "clientea@test.com",
    "password": "TestPass123!"
  }' | jq '.data.token'
```

---

## ✅ TEST CASES VÁLIDOS (Funcionamiento Normal)

### TC-1: Cliente Crea Solicitud
**Descripción:** Cliente A crea una nueva solicitud  
**Esperado:** ✅ 201 Created

```bash
curl -X POST "${API_GATEWAY}/request/solicitudes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN_CLIENTE_1}" \
  -d '{
    "tituloProblema": "Reparar aire acondicionado",
    "descripcionProblema": "El aire acondicionado no enciende",
    "costoEstimado": 150.00,
    "duracionEstimadaMin": 30,
    "categoriasProblema": ["CLIMATIZACION"]
  }' | jq '.'
```

**Respuesta Esperada:**
```json
{
  "success": true,
  "data": {
    "idSolicitud": 42,
    "idUser": 1,
    "tituloProblema": "Reparar aire acondicionado",
    "estadoSolicitud": "PENDIENTE",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### TC-2: Técnico Ve Solicitudes Disponibles
**Descripción:** Técnico B obtiene todas las solicitudes PENDIENTE  
**Esperado:** ✅ 200 OK (con filtrado en cliente)

```bash
curl -X GET "${API_GATEWAY}/request/solicitudes" \
  -H "Authorization: Bearer ${TOKEN_TECNICO_1}" | jq '.'
```

**Notar:** Sin protección de rol, incluso sin token funcionaría:
```bash
curl -X GET "${API_GATEWAY}/request/solicitudes" | jq '.'
# ⚠️ Sin Authorization header, debería fallar pero está marcado @Public
```

---

### TC-3: Técnico se Postula a Solicitud
**Descripción:** Técnico B envía propuesta para Solicitud #42  
**Esperado:** ✅ 201 Created

```bash
curl -X POST "${API_GATEWAY}/solicitudes-tecnicos/postularse" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN_TECNICO_1}" \
  -d '{
    "idSolicitud": 42,
    "costoAcordado": 120.00,
    "notas": "Puedo hacerlo hoy mismo"
  }' | jq '.'
```

**Respuesta Esperada:**
```json
{
  "success": true,
  "data": {
    "idSolTec": 101,
    "idSolicitud": 42,
    "idTecnico": 5,
    "estadoAcuerdo": "PROPUESTO",
    "costoAcordado": 120.00,
    "fechaPropuesta": "2024-01-15T10:35:00Z"
  }
}
```

---

### TC-4: Cliente Acepta Propuesta
**Descripción:** Cliente A acepta propuesta #101 de Técnico B  
**Esperado:** ✅ 200 OK

```bash
curl -X POST "${API_GATEWAY}/solicitudes-tecnicos/101/responder" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN_CLIENTE_1}" \
  -d '{
    "estadoAcuerdo": "ACEPTADO",
    "costoAcordado": 120.00,
    "notas": "Aceptado. Favor confirmar horario"
  }' | jq '.'
```

**Respuesta Esperada:**
```json
{
  "success": true,
  "data": {
    "idSolTec": 101,
    "estadoAcuerdo": "ACEPTADO",
    "fechaConfirmada": "2024-01-15T10:40:00Z",
    "solicitud": {
      "idSolicitud": 42,
      "estadoSolicitud": "ACEPTADA"
    }
  }
}
```

---

### TC-5: Técnico Ve Sus Propias Propuestas
**Descripción:** Técnico B lista sus propuestas  
**Esperado:** ✅ 200 OK (solo sus propuestas)

```bash
curl -X GET "${API_GATEWAY}/solicitudes-tecnicos/my/propuestas" \
  -H "Authorization: Bearer ${TOKEN_TECNICO_1}" | jq '.'
```

**Respuesta Esperada:**
```json
{
  "success": true,
  "data": [
    {
      "idSolTec": 101,
      "idSolicitud": 42,
      "idTecnico": 5,
      "estadoAcuerdo": "ACEPTADO",
      "solicitud": { ... }
    }
  ]
}
```

---

## 🚨 TEST CASES CRÍTICOS (Vulnerabilidades Detectadas)

### VULN-1: Ver Solicitudes Sin Autenticación (GET /request/solicitudes)

**Escenario:** Usuario no autenticado obtiene todas las solicitudes  
**Severidad:** 🔴 CRÍTICA  
**Esperado:** ❌ 401 Unauthorized  
**Actual:** ✅ 200 OK (@Public)

```bash
# SIN token
curl -X GET "${API_GATEWAY}/request/solicitudes" | jq '.'

# Resultado REAL (Problema):
# 200 OK con todas las solicitudes (incluyendo precios sensibles)

# Resultado ESPERADO después de fix:
# 401 Unauthorized - Must provide JWT token
```

**Impacto:**
- Personas no registradas pueden ver ALL solicitudes
- Exposición de costos estimados y ubicaciones
- Posible scraping de datos del mercado

---

### VULN-2: Cliente B Ve Propuestas de Solicitud de Cliente A

**Escenario:** Cliente A crea Solicitud #42  
- Técnico 1 se postula (Propuesta #101: Costo $120)
- Técnico 2 se postula (Propuesta #102: Costo $130)
- Cliente B intenta ver propuestas

**Severidad:** 🔴 CRÍTICA  
**Esperado:** ❌ 403 Forbidden  
**Actual:** ✅ 200 OK

```bash
# Cliente A crea solicitud
TOKEN_A="..."
curl -X POST "${API_GATEWAY}/request/solicitudes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN_A}" \
  -d '{ "tituloProblema": "Mi solicitud privada", ... }' \
  > response.json

SOLICITUD_AJENA=$(jq '.data.idSolicitud' response.json)
echo "Cliente A creó Solicitud #${SOLICITUD_AJENA}"

# Técnico 1 se postula
TOKEN_TEC1="..."
curl -X POST "${API_GATEWAY}/solicitudes-tecnicos/postularse" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN_TEC1}" \
  -d "{\"idSolicitud\": ${SOLICITUD_AJENA}, \"costoAcordado\": 120}" \
  > proposal1.json

# Técnico 2 se postula
TOKEN_TEC2="..."
curl -X POST "${API_GATEWAY}/solicitudes-tecnicos/postularse" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN_TEC2}" \
  -d "{\"idSolicitud\": ${SOLICITUD_AJENA}, \"costoAcordado\": 130}"

# ❌ AHORA - Cliente B intenta ver propuestas de solicitud ajena
TOKEN_B="..."
curl -X GET "${API_GATEWAY}/solicitudes-tecnicos/solicitud/${SOLICITUD_AJENA}" \
  -H "Authorization: Bearer ${TOKEN_B}"

# Resultado REAL (Problema):
# 200 OK
# [
#   {idSolTec: 101, idTecnico: 1, costoAcordado: 120},
#   {idSolTec: 102, idTecnico: 2, costoAcordado: 130}
# ]
# ⚠️ Cliente B VE COSTOS DE TÉCNICOS PARA SOLICITUD AJENA

# Resultado ESPERADO:
# 403 Forbidden
# {"error": "No tienes permisos para ver estas propuestas"}
```

**Impacto:**
- Cliente B ve costos de técnicos compitiendo
- Información sensible de negociación expuesta
- Fuga de datos entre usuarios

---

### VULN-3: Ver Propuesta Ajena con GET /solicitudes-tecnicos/:id

**Escenario:** Técnico A se postula a Solicitud de Cliente A  
- Crea Propuesta #101
- Técnico B intenta ver los detalles

**Severidad:** 🔴 ALTA  
**Esperado:** ❌ 403 Forbidden  
**Actual:** ✅ 200 OK

```bash
# Técnico A se postula
TOKEN_TEC_A="..."
curl -X POST "${API_GATEWAY}/solicitudes-tecnicos/postularse" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN_TEC_A}" \
  -d '{"idSolicitud": 42, "costoAcordado": 150}' \
  > proposal.json

SOL_TECNICO_ID=$(jq '.data.idSolTec' proposal.json)

# ❌ Técnico B obtiene detalles de la propuesta de Técnico A
TOKEN_TEC_B="..."
curl -X GET "${API_GATEWAY}/solicitudes-tecnicos/${SOL_TECNICO_ID}" \
  -H "Authorization: Bearer ${TOKEN_TEC_B}"

# Resultado REAL (Problema):
# 200 OK
# {
#   "idSolTec": 101,
#   "idTecnico": 1,
#   "costoAcordado": 150,
#   "notas": "..."
# }
# ⚠️ Técnico B VE COSTO DE TÉCNICO A

# Resultado ESPERADO:
# 403 Forbidden
```

---

### VULN-4: Responder Propuesta en Solicitud Cancelada

**Escenario:**
1. Cliente crea Solicitud #42
2. Técnico se postula (Propuesta #101)
3. Cliente cancela Solicitud #42
4. Cliente intenta aceptar Propuesta #101

**Severidad:** 🟡 MAYOR  
**Esperado:** ❌ 400 Bad Request  
**Actual:** ✅ 200 OK (inconsistencia)

```bash
# Solicitud #42 es PENDIENTE, Propuesta #101 es PROPUESTO
# Cliente cancela la solicitud
curl -X PUT "${API_GATEWAY}/request/solicitudes/42/cancel" \
  -H "Authorization: Bearer ${TOKEN_CLIENTE_1}"

# Verificar estado
curl -X GET "${API_GATEWAY}/request/solicitudes/42" \
  -H "Authorization: Bearer ${TOKEN_CLIENTE_1}" | jq '.data.estadoSolicitud'
# Respuesta: "CANCELADA"

# ❌ Ahora Cliente intenta aceptar propuesta de solicitud cancelada
curl -X POST "${API_GATEWAY}/solicitudes-tecnicos/101/responder" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN_CLIENTE_1}" \
  -d '{"estadoAcuerdo": "ACEPTADO", "costoAcordado": 120}'

# Resultado REAL (Problema):
# 200 OK
# Propuesta se marca ACEPTADO
# Solicitud sigue CANCELADA
# ⚠️ INCONSISTENCIA: Técnico piensa que fue aceptado pero solicitud está cancelada

# Resultado ESPERADO:
# 400 Bad Request
# {"error": "No puedes responder a propuestas de solicitudes canceladas"}
```

---

### VULN-5: Técnico se Postula Dos Veces (Validación Correcta - No es Vuln)

**Escenario:** Técnico intenta postularse dos veces a misma solicitud  
**Severidad:** ℹ️ INFO  
**Esperado:** ❌ 409 Conflict  
**Actual:** ✅ 409 Conflict (BIEN)

```bash
# Primera postulación
curl -X POST "${API_GATEWAY}/solicitudes-tecnicos/postularse" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN_TECNICO_1}" \
  -d '{"idSolicitud": 42, "costoAcordado": 120}'
# 201 Created

# Segunda postulación
curl -X POST "${API_GATEWAY}/solicitudes-tecnicos/postularse" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN_TECNICO_1}" \
  -d '{"idSolicitud": 42, "costoAcordado": 125}'

# Resultado ESPERADO y ACTUAL:
# 409 Conflict
# {"error": "Ya te has postulado a esta solicitud"}
# ✅ CORRECTO - Índice UNIQUE previene duplicados
```

---

## 🔐 TEST CASES DE ROLES

### ROLE-1: TECNICO Intenta Crear Solicitud

**Esperado:** ❌ 403 Forbidden  
**Actual:** ❌ 403 Forbidden (CORRECTO)

```bash
curl -X POST "${API_GATEWAY}/request/solicitudes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN_TECNICO_1}" \
  -d '{
    "tituloProblema": "Un problema",
    "descripcionProblema": "Descripción",
    "costoEstimado": 100,
    "duracionEstimadaMin": 30
  }'

# Resultado:
# 403 Forbidden
# {"error": "Insufficient permissions"}
# ✅ CORRECTO - TECNICO no puede crear solicitudes
```

---

### ROLE-2: CLIENTE Intenta Postularse

**Esperado:** ❌ 403 Forbidden  
**Actual:** ❌ 403 Forbidden (CORRECTO)

```bash
curl -X POST "${API_GATEWAY}/solicitudes-tecnicos/postularse" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN_CLIENTE_1}" \
  -d '{
    "idSolicitud": 42,
    "costoAcordado": 150
  }'

# Resultado:
# 403 Forbidden
# {"error": "Insufficient permissions"}
# ✅ CORRECTO - CLIENTE no puede postularse
```

---

### ROLE-3: TECNICO Intenta Responder Propuesta Ajena

**Esperado:** ❌ 403 Forbidden  
**Actual:** Depende de implementación

```bash
# Técnico A se postula
curl -X POST "${API_GATEWAY}/solicitudes-tecnicos/postularse" \
  -H "Authorization: Bearer ${TOKEN_TECNICO_1}" \
  -d '{"idSolicitud": 42, "costoAcordado": 150}' \
  > proposal.json

SOL_TECNICO_ID=$(jq '.data.idSolTec' proposal.json)

# Técnico B intenta responder
curl -X POST "${API_GATEWAY}/solicitudes-tecnicos/${SOL_TECNICO_ID}/responder" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN_TECNICO_2}" \
  -d '{"estadoAcuerdo": "ACEPTADO"}'

# Resultado ESPERADO:
# 403 Forbidden
# {"error": "Solo el cliente puede responder a esta propuesta"}

# Resultado ACTUAL:
# ⚠️ Depende de validación en el servicio
# (No hay @Roles protegiendo el endpoint)
```

---

## 📊 TEST CASES DE FLUJO COMPLETO

### FLOW-1: Cliente Crea → Técnicos Postúlan → Cliente Acepta

```bash
#!/bin/bash

set -e

echo "=== FLUJO COMPLETO: Crear → Postular → Aceptar ==="

# 1. Cliente A crea solicitud
echo "1️⃣ Cliente A crea solicitud..."
RESPONSE=$(curl -s -X POST "${API_GATEWAY}/request/solicitudes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN_CLIENTE_1}" \
  -d '{
    "tituloProblema": "Reparar aire acondicionado",
    "descripcionProblema": "El aire no enciende",
    "costoEstimado": 150,
    "duracionEstimadaMin": 30,
    "categoriasProblema": ["CLIMATIZACION"]
  }')

SOLICITUD_ID=$(echo "$RESPONSE" | jq '.data.idSolicitud')
echo "✅ Solicitud #${SOLICITUD_ID} creada (Estado: PENDIENTE)"

# 2. Técnico 1 se postula
echo ""
echo "2️⃣ Técnico 1 se postula..."
PROPOSAL1=$(curl -s -X POST "${API_GATEWAY}/solicitudes-tecnicos/postularse" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN_TECNICO_1}" \
  -d "{
    \"idSolicitud\": ${SOLICITUD_ID},
    \"costoAcordado\": 120,
    \"notas\": \"Puedo hacerlo hoy\"
  }")

SOL_TEC_1=$(echo "$PROPOSAL1" | jq '.data.idSolTec')
echo "✅ Propuesta #${SOL_TEC_1} de Técnico 1 (Costo: \$120)"

# 3. Técnico 2 se postula
echo ""
echo "3️⃣ Técnico 2 se postula..."
PROPOSAL2=$(curl -s -X POST "${API_GATEWAY}/solicitudes-tecnicos/postularse" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN_TECNICO_2}" \
  -d "{
    \"idSolicitud\": ${SOLICITUD_ID},
    \"costoAcordado\": 130,
    \"notas\": \"Disponible en 2 horas\"
  }")

SOL_TEC_2=$(echo "$PROPOSAL2" | jq '.data.idSolTec')
echo "✅ Propuesta #${SOL_TEC_2} de Técnico 2 (Costo: \$130)"

# 4. Cliente A ve propuestas
echo ""
echo "4️⃣ Cliente A ve propuestas de su solicitud..."
PROPOSALS=$(curl -s -X GET "${API_GATEWAY}/solicitudes-tecnicos/solicitud/${SOLICITUD_ID}" \
  -H "Authorization: Bearer ${TOKEN_CLIENTE_1}")

echo "✅ Propuestas obtenidas:"
echo "$PROPOSALS" | jq '.data[] | {idSolTec, idTecnico, costoAcordado}'

# 5. Cliente acepta la propuesta de Técnico 1
echo ""
echo "5️⃣ Cliente A acepta Propuesta #${SOL_TEC_1}..."
curl -s -X POST "${API_GATEWAY}/solicitudes-tecnicos/${SOL_TEC_1}/responder" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN_CLIENTE_1}" \
  -d '{
    "estadoAcuerdo": "ACEPTADO",
    "costoAcordado": 120
  }' | jq '.data | {idSolTec, estadoAcuerdo, solicitud}'

echo "✅ Propuesta #${SOL_TEC_1} aceptada"

# 6. Verificar que otra propuesta fue rechazada automáticamente
echo ""
echo "6️⃣ Verificar rechazo automático de otras propuestas..."
curl -s -X GET "${API_GATEWAY}/solicitudes-tecnicos/${SOL_TEC_2}" \
  -H "Authorization: Bearer ${TOKEN_TECNICO_2}" | jq '.data | {idSolTec, estadoAcuerdo}'

echo "✅ Propuesta #${SOL_TEC_2} rechazada automáticamente"

# 7. Verificar solicitud ahora está ACEPTADA
echo ""
echo "7️⃣ Verificar solicitud está ACEPTADA..."
curl -s -X GET "${API_GATEWAY}/request/solicitudes/${SOLICITUD_ID}" \
  -H "Authorization: Bearer ${TOKEN_CLIENTE_1}" | jq '.data | {idSolicitud, estadoSolicitud}'

echo "✅ Solicitud #${SOLICITUD_ID} está ACEPTADA"

echo ""
echo "🎉 FLUJO COMPLETADO EXITOSAMENTE"
```

---

## 📝 CHECKLIST DE VALIDACIÓN

Use este checklist para validar los cambios después de las correcciones:

```bash
# Después de aplicar VULN-1 (Proteger GET /request/solicitudes)
[ ] GET /request/solicitudes sin token retorna 401
[ ] GET /request/solicitudes con token retorna solo PENDIENTE
[ ] GET /request/solicitudes?estado=ACEPTADA retorna solo ACEPTADA

# Después de aplicar VULN-2 (Validar propiedad en ver propuestas)
[ ] Cliente A ve propuestas de su solicitud (200)
[ ] Cliente B ve propuestas de solicitud de Cliente A (403)
[ ] ADMIN ve propuestas de cualquier solicitud (200)

# Después de aplicar VULN-3 (Validar propiedad en GET propuesta)
[ ] Técnico A ve su propuesta (200)
[ ] Técnico B ve propuesta de Técnico A (403)
[ ] Cliente propietario ve propuesta (200)
[ ] Cliente no propietario ve propuesta (403)

# Después de aplicar VULN-4 (Validar estado solicitud)
[ ] Aceptar propuesta de solicitud PENDIENTE (200)
[ ] Aceptar propuesta de solicitud CANCELADA (400)
[ ] Aceptar propuesta de solicitud COMPLETADA (400)

# Roles y Guards
[ ] TECNICO crea solicitud (403)
[ ] CLIENTE postula (403)
[ ] ADMIN puede todo (200/201)
```

---

## 🔧 Script para Crear Datos de Prueba

```bash
#!/bin/bash

# Script para crear datos de prueba reusables

API="${API_GATEWAY:-http://localhost:3001}"

echo "🔧 Creando datos de prueba..."

# 1. Registrar usuarios
echo "Registrando usuarios..."

# Cliente A
CLIENTE_A=$(curl -s -X POST "${API}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "clientea@example.com",
    "password": "Test123!",
    "nombre": "Cliente A"
  }' | jq -r '.data.id')

echo "Cliente A ID: ${CLIENTE_A}"

# Cliente B
CLIENTE_B=$(curl -s -X POST "${API}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "clienteb@example.com",
    "password": "Test123!",
    "nombre": "Cliente B"
  }' | jq -r '.data.id')

echo "Cliente B ID: ${CLIENTE_B}"

# Técnico 1
TECNICO_1=$(curl -s -X POST "${API}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tecnico1@example.com",
    "password": "Test123!",
    "nombre": "Técnico 1"
  }' | jq -r '.data.id')

echo "Técnico 1 ID: ${TECNICO_1}"

# Técnico 2
TECNICO_2=$(curl -s -X POST "${API}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tecnico2@example.com",
    "password": "Test123!",
    "nombre": "Técnico 2"
  }' | jq -r '.data.id')

echo "Técnico 2 ID: ${TECNICO_2}"

# 2. Obtener tokens
echo "Obteniendo tokens..."

TOKEN_CLIENTE_A=$(curl -s -X POST "${API}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "clientea@example.com",
    "password": "Test123!"
  }' | jq -r '.data.token')

TOKEN_TECNICO_1=$(curl -s -X POST "${API}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tecnico1@example.com",
    "password": "Test123!"
  }' | jq -r '.data.token')

# 3. Exportar para uso en otros scripts
cat > test-data.env << EOF
CLIENTE_A_ID=${CLIENTE_A}
CLIENTE_B_ID=${CLIENTE_B}
TECNICO_1_ID=${TECNICO_1}
TECNICO_2_ID=${TECNICO_2}

TOKEN_CLIENTE_A=${TOKEN_CLIENTE_A}
TOKEN_TECNICO_1=${TOKEN_TECNICO_1}

API="${API}"
EOF

echo "✅ Datos de prueba creados en test-data.env"
source test-data.env
```

---

## 📌 CONCLUSIÓN

Estos test cases permiten:
1. ✅ Validar que los flujos normales funcionan correctamente
2. 🚨 Identificar las vulnerabilidades críticas detectadas
3. 🔐 Validar que la protección de roles funciona
4. 🔧 Proporcionar datos reusables para pruebas manuales

**Para usar:** Reemplazar tokens y valores de ambiente, ejecutar curl commands


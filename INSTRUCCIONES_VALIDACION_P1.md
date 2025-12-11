# 🚀 INSTRUCCIONES DE VALIDACIÓN P1 - PASO A PASO

**Creado:** 11 de Diciembre de 2025
**Objetivo:** Validar que la corrección de P1 funciona correctamente

---

## 📋 RESUMEN RÁPIDO

**Problema corregido:** Cliente no podía ver sus solicitudes en estados diferentes a PENDIENTE.

**Solución:** Default de estado ahora es condicional según el rol:
- **CLIENTE:** Sin default (ve TODAS)
- **TÉCNICO:** Default PENDIENTE (ve disponibles)
- **ADMIN:** Sin default (preparado para futuro)

---

## 🛠️ PASO 1: Iniciar el Servidor Backend

```bash
# Terminal 1: Iniciar servidor
cd /Users/danielamora/Documents/fixit-back-r
npm install
npm run start
```

**Resultado esperado:**
```
[Nest] 12345  - 12/11/2025, 5:30:00 PM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 12/11/2025, 5:30:05 PM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 12/11/2025, 5:30:10 PM     LOG [NestApplication] Nest application successfully started
```

**Verificar que esté corriendo:**
```bash
curl -s http://localhost:3001/health | jq '.'
# Respuesta: {"status":"ok"}
```

---

## 🔑 PASO 2: Obtener Tokens de Prueba

**En otra terminal**, registra usuarios de prueba:

### Crear Usuario CLIENTE

```bash
export API_GATEWAY="http://localhost:3001"

# Registrar cliente
CLIENTE_RESPONSE=$(curl -s -X POST "${API_GATEWAY}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@test.com",
    "password": "TestPass123!",
    "nombre": "Cliente Test",
    "rol": "CLIENTE"
  }')

# Extraer token
export TOKEN_CLIENTE=$(echo "$CLIENTE_RESPONSE" | jq -r '.data.access_token')

# Verificar
echo "TOKEN_CLIENTE: $TOKEN_CLIENTE"
```

### Crear Usuario TÉCNICO

```bash
# Registrar técnico
TECNICO_RESPONSE=$(curl -s -X POST "${API_GATEWAY}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tecnico@test.com",
    "password": "TestPass123!",
    "nombre": "Tecnico Test",
    "rol": "TECNICO"
  }')

# Extraer token
export TOKEN_TECNICO=$(echo "$TECNICO_RESPONSE" | jq -r '.data.access_token')

# Verificar
echo "TOKEN_TECNICO: $TOKEN_TECNICO"
```

**Resultado esperado:**
- Ambas variables con tokens JWT válidos
- Tokens empiezan con `eyJ` (base64 encoding)

---

## 🧪 PASO 3: Ejecutar Tests Manuales

### Opción A: Script Automatizado (Recomendado)

```bash
cd /Users/danielamora/Documents/fixit-back-r
./test-p1.sh
```

**Resultado esperado:**
```
╔════════════════════════════════════════════════════════════╗
║  🧪 VALIDACIÓN P1 - TESTS DE ROLES Y ESTADOS              ║
╚════════════════════════════════════════════════════════════╝

[PASS] API Gateway disponible en http://localhost:3001
[PASS] Tokens de prueba configurados
...
[PASS] TC-1: Cliente ve TODAS
[PASS] TC-2: Técnico ve PENDIENTE
[PASS] TC-3: Técnico respeta parámetro
[PASS] TC-4: Cliente respeta parámetro
[PASS] TC-5: Sin auth = 401

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 RESUMEN:
Passed: 5
Failed: 0

[PASS] ¡TODOS LOS TESTS PASARON! ✅
```

---

### Opción B: Tests Manuales (curl)

Si prefieres ejecutar tests manualmente uno a uno:

#### TC-1: Cliente VE TODAS (sin ?estado)

```bash
curl -s -X GET "${API_GATEWAY}/request/solicitudes" \
  -H "Authorization: Bearer ${TOKEN_CLIENTE}" \
  -H "Content-Type: application/json" | jq '.data | length'

# Esperado: Número > 0
# Debería incluir solicitudes en MÚLTIPLES estados
```

**Verificar estados:**
```bash
curl -s -X GET "${API_GATEWAY}/request/solicitudes" \
  -H "Authorization: Bearer ${TOKEN_CLIENTE}" \
  -H "Content-Type: application/json" | jq '.data[].estadoSolicitud' | sort | uniq

# Esperado: Múltiples estados
# PENDIENTE
# EN_PROGRESO
# COMPLETADA
# etc.
```

#### TC-2: Técnico VE SOLO PENDIENTE (sin ?estado)

```bash
curl -s -X GET "${API_GATEWAY}/request/solicitudes" \
  -H "Authorization: Bearer ${TOKEN_TECNICO}" \
  -H "Content-Type: application/json" | jq '.data | length'

# Esperado: Número >= 0

# Verificar que TODOS son PENDIENTE
curl -s -X GET "${API_GATEWAY}/request/solicitudes" \
  -H "Authorization: Bearer ${TOKEN_TECNICO}" \
  -H "Content-Type: application/json" | jq '[.data[] | select(.estadoSolicitud != "PENDIENTE")] | length'

# Esperado: 0 (no hay estados que NO sean PENDIENTE)
```

#### TC-3: Técnico CON ?estado=EN_PROGRESO

```bash
curl -s -X GET "${API_GATEWAY}/request/solicitudes?estado=EN_PROGRESO" \
  -H "Authorization: Bearer ${TOKEN_TECNICO}" \
  -H "Content-Type: application/json" | jq '.data[] | select(.estadoSolicitud != "EN_PROGRESO") | length'

# Esperado: 0 (todos deben ser EN_PROGRESO)
```

#### TC-4: Cliente CON ?estado=PENDIENTE

```bash
curl -s -X GET "${API_GATEWAY}/request/solicitudes?estado=PENDIENTE" \
  -H "Authorization: Bearer ${TOKEN_CLIENTE}" \
  -H "Content-Type: application/json" | jq '.data[] | select(.estadoSolicitud != "PENDIENTE") | length'

# Esperado: 0 (todos deben ser PENDIENTE)
```

#### TC-5: Sin Token = 401

```bash
curl -s -X GET "${API_GATEWAY}/request/solicitudes" \
  -H "Content-Type: application/json" | jq '.statusCode'

# Esperado: 401
```

---

## ✅ CHECKLIST DE VALIDACIÓN

Si ejecutaste los tests, marca lo siguiente:

- [ ] TC-1: Cliente ve TODAS sin parámetro ✅
- [ ] TC-2: Técnico ve PENDIENTE sin parámetro ✅
- [ ] TC-3: Técnico respeta ?estado=EN_PROGRESO ✅
- [ ] TC-4: Cliente respeta ?estado=PENDIENTE ✅
- [ ] TC-5: Sin autenticación = 401 ✅
- [ ] Logs del servidor NO muestran errores
- [ ] Response time < 500ms

---

## 🔍 TROUBLESHOOTING

### Error: "Cannot find module" al iniciar servidor

**Solución:**
```bash
cd /Users/danielamora/Documents/fixit-back-r
npm install
npm run build
npm run start
```

### Error: "API Gateway not responding"

**Solución:**
- Verifica que el servidor esté en la terminal 1
- Verifica que no hay error al iniciar
- Espera 5 segundos después de ver "Nest application successfully started"

### Error: "Unauthorized" en todos los tests

**Causa:** Tokens inválidos
**Solución:**
1. Verifica que registraste usuarios
2. Verifica que TOKEN_CLIENTE y TOKEN_TECNICO están exportados
3. Verifica que tokens son válidos:
   ```bash
   echo "$TOKEN_CLIENTE" | jq -R 'split(".") | .[1] | @base64d | fromjson'
   ```

### Error: Tests pasan pero datos son vacíos

**Causa:** Base de datos sin solicitudes de prueba
**Solución:** Crear solicitudes de prueba primero
```bash
# Como cliente, crear una solicitud
curl -X POST "${API_GATEWAY}/request/solicitudes" \
  -H "Authorization: Bearer ${TOKEN_CLIENTE}" \
  -H "Content-Type: application/json" \
  -d '{
    "tituloProblema": "Solicitud de prueba",
    "descripcionProblema": "Descripción",
    "presupuestoEstimado": 100,
    "idTipoServicio": 1,
    "codigoParroquia": "170150"
  }'
```

---

## 📊 INTERPRETACIÓN DE RESULTADOS

### Resultado EXITOSO ✅

```
[PASS] TC-1: Cliente ve TODAS
[PASS] TC-2: Técnico ve PENDIENTE
[PASS] TC-3: Técnico respeta parámetro
[PASS] TC-4: Cliente respeta parámetro
[PASS] TC-5: Sin auth = 401

Passed: 5
Failed: 0
```

**Significa:** P1 está correctamente implementado. Puedes proceder a P2.

### Resultado CON FALLOS ❌

Si algún test falla, analiza:

1. **TC-1 FALLA:** Cliente ve SOLO PENDIENTE
   - Problema: RolUsuario.CLIENTE no está siendo identificado
   - Verificación: Revisar que req.user.rol está siendo pasado correctamente

2. **TC-2 FALLA:** Técnico NO ve PENDIENTE por defecto
   - Problema: Condición `rol === RolUsuario.TECNICO` no funciona
   - Verificación: Revisar que RolUsuario está importado en solicitudes.service.ts

3. **TC-5 FALLA:** SIN TOKEN devuelve 200 OK
   - Problema: @UseGuards(JwtAuthGuard) no está presente
   - Verificación: Revisar que guard está en controller

---

## 📝 DOCUMENTACIÓN DE REFERENCIA

Si necesitas entender los cambios:

1. **P1_FINAL_REPORT.md** - Resumen ejecutivo completo
2. **CAMBIOS_P1_IMPLEMENTADOS.md** - Detalles técnicos
3. **ANALISIS_DIFF_P1_REVISION_REQUERIMIENTOS.md** - Análisis original

---

## 🎯 PRÓXIMOS PASOS (DESPUÉS DE VALIDACIÓN)

Una vez que todos los tests pasen:

1. ✅ Commit y push de cambios
2. ✅ Proceder a P2 (Validar propuestas por usuario)
3. ✅ Proceder a P3 (Rol array vs singular)
4. ✅ Proceder a P4 (Remover filtrado cliente)
5. ✅ Proceder a P5 (Validación de estado)

---

**Versión:** 1.0
**Estado:** Listo para ejecutar
**Contacto:** Si hay problemas, revisar los documentos de referencia o los logs del servidor.

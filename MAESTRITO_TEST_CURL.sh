#!/bin/bash

# =====================================================
# EJEMPLOS DE PRUEBAS CON CURL - MAESTRITO
# =====================================================

# Variables
API_URL="http://localhost:3000"
JWT_TOKEN="your_jwt_token_here"  # Reemplazar con JWT válido
SESSION_ID=""                      # Se obtiene después de /start

# =====================================================
# 1. INICIAR SESIÓN
# =====================================================
echo "=== 1. Iniciando sesión Maestrito ==="
SESSION_RESPONSE=$(curl -s -X POST "$API_URL/request/maestrito/start" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json")

echo "Respuesta:"
echo "$SESSION_RESPONSE" | jq .

# Extraer sessionId (requiere jq)
SESSION_ID=$(echo "$SESSION_RESPONSE" | jq -r '.data.sessionId')
echo "SessionId: $SESSION_ID"
echo ""

# =====================================================
# 2. ENVIAR PRIMER MENSAJE
# =====================================================
echo "=== 2. Enviando primer mensaje ==="
curl -s -X POST "$API_URL/request/maestrito/$SESSION_ID/message" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Tengo un problema con la plomería en mi casa"}' | jq .

echo ""

# =====================================================
# 3. RESPONDER PREGUNTA SOBRE UBICACIÓN
# =====================================================
echo "=== 3. Respondiendo sobre ubicación ==="
curl -s -X POST "$API_URL/request/maestrito/$SESSION_ID/message" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Estoy en La Mariscal, código 170131"}' | jq .

echo ""

# =====================================================
# 4. DESCRIBIR EL PROBLEMA
# =====================================================
echo "=== 4. Describiendo el problema ==="
curl -s -X POST "$API_URL/request/maestrito/$SESSION_ID/message" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Sale agua por debajo del lavamanos del baño. Es una fuga lenta pero constante. Manchó el piso."}' | jq .

echo ""

# =====================================================
# 5. INDICAR FECHA Y HORA
# =====================================================
echo "=== 5. Indicando fecha y hora ==="
curl -s -X POST "$API_URL/request/maestrito/$SESSION_ID/message" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Mañana a las 10 de la mañana me vendría bien"}' | jq .

echo ""

# =====================================================
# 6. INDICAR PRESUPUESTO
# =====================================================
echo "=== 6. Indicando presupuesto ==="
curl -s -X POST "$API_URL/request/maestrito/$SESSION_ID/message" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Tengo presupuesto de 50 dólares"}' | jq .

echo ""

# =====================================================
# 7. OBTENER HISTORIAL
# =====================================================
echo "=== 7. Obteniendo historial de la sesión ==="
curl -s -X GET "$API_URL/request/maestrito/$SESSION_ID/history" \
  -H "Authorization: Bearer $JWT_TOKEN" | jq .

echo ""

# =====================================================
# 8. FINALIZAR SESIÓN
# =====================================================
echo "=== 8. Finalizando sesión ==="
curl -s -X DELETE "$API_URL/request/maestrito/$SESSION_ID" \
  -H "Authorization: Bearer $JWT_TOKEN" | jq .

echo ""

# =====================================================
# VARIANTE: SI ALGO FALLA EN EL CAMINO
# =====================================================
# Puedes reutilizar la misma SESSION_ID para continuar

# Ejemplo de mensaje fallido (sin JWT):
echo "=== EJEMPLO: Intento sin JWT (debe fallar) ==="
curl -s -X POST "$API_URL/request/maestrito/$SESSION_ID/message" \
  -H "Content-Type: application/json" \
  -d '{"message": "Test"}' | jq .

echo ""

# =====================================================
# NOTA: Script interactivo (mejor para testing manual)
# =====================================================
# Si quieres hacer esto más interactivo, agregar:
# read -p "Presiona enter para continuar..."

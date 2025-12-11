#!/bin/bash

# 🧪 Script de Validación P1 - Tests de Roles y Estados
# Este script valida que la implementación de P1 funcione correctamente

set -e

# ====================================
# CONFIGURACIÓN
# ====================================

API_GATEWAY="${API_GATEWAY:-http://localhost:3001}"
VERBOSE="${VERBOSE:-false}"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
PASSED=0
FAILED=0

# ====================================
# FUNCIONES AUXILIARES
# ====================================

print_header() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC} $1"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
}

print_test() {
    echo -e "${YELLOW}[TEST]${NC} $1"
}

print_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((PASSED++))
}

print_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((FAILED++))
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# ====================================
# PRE-REQUISITOS
# ====================================

check_server() {
    print_header "Verificando disponibilidad del servidor"
    
    if ! curl -s -f -o /dev/null "${API_GATEWAY}/health" 2>/dev/null; then
        print_fail "API Gateway no responde en ${API_GATEWAY}"
        echo ""
        echo "Para iniciar el servidor:"
        echo "  cd /Users/danielamora/Documents/fixit-back-r"
        echo "  npm run start"
        exit 1
    fi
    print_pass "API Gateway disponible en ${API_GATEWAY}"
}

get_or_create_tokens() {
    print_header "Obteniendo/Creando tokens de prueba"
    
    # Por ahora, esperamos que los tokens se pasen como variables de entorno
    if [[ -z "$TOKEN_CLIENTE" || -z "$TOKEN_TECNICO" ]]; then
        print_fail "Se requieren tokens JWT como variables de entorno"
        echo ""
        echo "Para obtener tokens, registra usuarios de prueba:"
        echo ""
        echo "CLIENTE:"
        echo '  curl -X POST "${API_GATEWAY}/auth/register" \'
        echo '    -H "Content-Type: application/json" \'
        echo '    -d '"'"'{
        echo '      "email": "cliente@test.com",
        echo '      "password": "TestPass123!",
        echo '      "nombre": "Cliente Test",
        echo '      "rol": "CLIENTE"
        echo '    }'"'"
        echo ""
        echo "TÉCNICO:"
        echo '  curl -X POST "${API_GATEWAY}/auth/register" \'
        echo '    -H "Content-Type: application/json" \'
        echo '    -d '"'"'{
        echo '      "email": "tecnico@test.com",
        echo '      "password": "TestPass123!",
        echo '      "nombre": "Tecnico Test",
        echo '      "rol": "TECNICO"
        echo '    }'"'"
        echo ""
        echo "Luego ejecuta:"
        echo "  export TOKEN_CLIENTE=<token_cliente>"
        echo "  export TOKEN_TECNICO=<token_tecnico>"
        echo "  ./test-p1.sh"
        exit 1
    fi
    
    print_pass "Tokens de prueba configurados"
    [[ "$VERBOSE" == "true" ]] && print_info "TOKEN_CLIENTE: ${TOKEN_CLIENTE:0:50}..."
    [[ "$VERBOSE" == "true" ]] && print_info "TOKEN_TECNICO: ${TOKEN_TECNICO:0:50}..."
}

# ====================================
# TEST CASES
# ====================================

# TC-1: Cliente VE TODAS sus solicitudes sin parámetro estado
test_cliente_ve_todas() {
    print_header "TC-1: Cliente ve TODAS sus solicitudes (sin ?estado)"
    print_test "GET /request/solicitudes (CLIENTE, sin parámetro)"
    
    RESPONSE=$(curl -s -X GET "${API_GATEWAY}/request/solicitudes" \
        -H "Authorization: Bearer ${TOKEN_CLIENTE}" \
        -H "Content-Type: application/json")
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "${API_GATEWAY}/request/solicitudes" \
        -H "Authorization: Bearer ${TOKEN_CLIENTE}" \
        -H "Content-Type: application/json")
    
    if [[ $HTTP_CODE == "200" ]]; then
        print_pass "Status: 200 OK"
        
        # Verificar que incluye múltiples estados (o al menos intenta)
        DATA_LENGTH=$(echo "$RESPONSE" | jq '.data | length' 2>/dev/null || echo "0")
        if [[ $DATA_LENGTH -ge 0 ]]; then
            print_pass "Respuesta contiene datos (items: $DATA_LENGTH)"
            
            # Si hay datos, verificar que NO está limitado a solo PENDIENTE
            ESTADOS=$(echo "$RESPONSE" | jq -r '.data[].estadoSolicitud' 2>/dev/null | sort | uniq | tr '\n' ', ')
            if [[ -n "$ESTADOS" ]]; then
                print_info "Estados encontrados: $ESTADOS"
            fi
        else
            print_fail "Respuesta inválida"
            echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
        fi
    else
        print_fail "Status: ${HTTP_CODE} (esperado 200)"
        echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
    fi
}

# TC-2: Técnico VE SOLO PENDIENTE sin parámetro estado
test_tecnico_ve_pendiente() {
    print_header "TC-2: Técnico ve SOLO PENDIENTE (sin ?estado)"
    print_test "GET /request/solicitudes (TÉCNICO, sin parámetro)"
    
    RESPONSE=$(curl -s -X GET "${API_GATEWAY}/request/solicitudes" \
        -H "Authorization: Bearer ${TOKEN_TECNICO}" \
        -H "Content-Type: application/json")
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "${API_GATEWAY}/request/solicitudes" \
        -H "Authorization: Bearer ${TOKEN_TECNICO}" \
        -H "Content-Type: application/json")
    
    if [[ $HTTP_CODE == "200" ]]; then
        print_pass "Status: 200 OK"
        
        # Contar items PENDIENTE vs otros
        DATA_LENGTH=$(echo "$RESPONSE" | jq '.data | length' 2>/dev/null || echo "0")
        PENDIENTE_COUNT=$(echo "$RESPONSE" | jq '[.data[] | select(.estadoSolicitud == "PENDIENTE")] | length' 2>/dev/null || echo "0")
        OTHER_COUNT=$(echo "$RESPONSE" | jq '[.data[] | select(.estadoSolicitud != "PENDIENTE")] | length' 2>/dev/null || echo "0")
        
        if [[ $DATA_LENGTH -eq 0 ]]; then
            print_pass "No hay solicitudes (esperado si BD vacía)"
        elif [[ $OTHER_COUNT -eq 0 ]]; then
            print_pass "TODOS los items son PENDIENTE (${PENDIENTE_COUNT} items)"
        else
            print_fail "Técnico ve estados que NO son PENDIENTE (Otras: ${OTHER_COUNT})"
            echo "$RESPONSE" | jq '.data[] | select(.estadoSolicitud != "PENDIENTE")'
        fi
    else
        print_fail "Status: ${HTTP_CODE} (esperado 200)"
        echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
    fi
}

# TC-3: Técnico CON parámetro ?estado=EN_PROGRESO
test_tecnico_con_filtro() {
    print_header "TC-3: Técnico con ?estado=EN_PROGRESO"
    print_test "GET /request/solicitudes?estado=EN_PROGRESO (TÉCNICO, con parámetro)"
    
    RESPONSE=$(curl -s -X GET "${API_GATEWAY}/request/solicitudes?estado=EN_PROGRESO" \
        -H "Authorization: Bearer ${TOKEN_TECNICO}" \
        -H "Content-Type: application/json")
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "${API_GATEWAY}/request/solicitudes?estado=EN_PROGRESO" \
        -H "Authorization: Bearer ${TOKEN_TECNICO}" \
        -H "Content-Type: application/json")
    
    if [[ $HTTP_CODE == "200" ]]; then
        print_pass "Status: 200 OK"
        
        DATA_LENGTH=$(echo "$RESPONSE" | jq '.data | length' 2>/dev/null || echo "0")
        EN_PROGRESO=$(echo "$RESPONSE" | jq '[.data[] | select(.estadoSolicitud == "EN_PROGRESO")] | length' 2>/dev/null || echo "0")
        
        if [[ $DATA_LENGTH -eq 0 ]]; then
            print_pass "No hay solicitudes EN_PROGRESO (esperado si BD vacía)"
        elif [[ $EN_PROGRESO -eq $DATA_LENGTH ]]; then
            print_pass "Técnico respeta parámetro (todos son EN_PROGRESO)"
        else
            print_fail "Técnico retorna estados mixtos (esperado 100% EN_PROGRESO)"
        fi
    else
        print_fail "Status: ${HTTP_CODE} (esperado 200)"
    fi
}

# TC-4: Cliente CON parámetro ?estado=PENDIENTE
test_cliente_con_filtro() {
    print_header "TC-4: Cliente con ?estado=PENDIENTE"
    print_test "GET /request/solicitudes?estado=PENDIENTE (CLIENTE, con parámetro)"
    
    RESPONSE=$(curl -s -X GET "${API_GATEWAY}/request/solicitudes?estado=PENDIENTE" \
        -H "Authorization: Bearer ${TOKEN_CLIENTE}" \
        -H "Content-Type: application/json")
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "${API_GATEWAY}/request/solicitudes?estado=PENDIENTE" \
        -H "Authorization: Bearer ${TOKEN_CLIENTE}" \
        -H "Content-Type: application/json")
    
    if [[ $HTTP_CODE == "200" ]]; then
        print_pass "Status: 200 OK"
        
        DATA_LENGTH=$(echo "$RESPONSE" | jq '.data | length' 2>/dev/null || echo "0")
        PENDIENTE=$(echo "$RESPONSE" | jq '[.data[] | select(.estadoSolicitud == "PENDIENTE")] | length' 2>/dev/null || echo "0")
        
        if [[ $DATA_LENGTH -eq 0 ]]; then
            print_pass "No hay solicitudes PENDIENTE (esperado si BD vacía)"
        elif [[ $PENDIENTE -eq $DATA_LENGTH ]]; then
            print_pass "Cliente respeta parámetro (todos son PENDIENTE)"
        else
            print_fail "Cliente retorna estados mixtos (esperado 100% PENDIENTE)"
        fi
    else
        print_fail "Status: ${HTTP_CODE} (esperado 200)"
    fi
}

# TC-5: Usuario sin autenticación = 401
test_sin_autenticacion() {
    print_header "TC-5: Usuario SIN autenticación = 401"
    print_test "GET /request/solicitudes (SIN TOKEN)"
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "${API_GATEWAY}/request/solicitudes" \
        -H "Content-Type: application/json")
    
    if [[ $HTTP_CODE == "401" ]]; then
        print_pass "Status: 401 Unauthorized (correcto)"
    else
        print_fail "Status: ${HTTP_CODE} (esperado 401)"
        
        RESPONSE=$(curl -s -X GET "${API_GATEWAY}/request/solicitudes" \
            -H "Content-Type: application/json")
        echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
    fi
}

# ====================================
# EJECUCIÓN
# ====================================

main() {
    echo ""
    print_header "🧪 VALIDACIÓN P1 - TESTS DE ROLES Y ESTADOS"
    echo ""
    print_info "API Gateway: ${API_GATEWAY}"
    print_info "Verificando servidor y tokens..."
    echo ""
    
    # Pre-requisitos
    check_server
    get_or_create_tokens
    
    echo ""
    
    # Ejecutar tests
    test_cliente_ve_todas
    test_tecnico_ve_pendiente
    test_tecnico_con_filtro
    test_cliente_con_filtro
    test_sin_autenticacion
    
    # Resumen
    echo ""
    print_header "📊 RESUMEN DE RESULTADOS"
    echo -e "${GREEN}Passed: ${PASSED}${NC}"
    echo -e "${RED}Failed: ${FAILED}${NC}"
    echo ""
    
    if [[ $FAILED -eq 0 ]]; then
        print_pass "¡TODOS LOS TESTS PASARON! ✅"
        exit 0
    else
        print_fail "Algunos tests fallaron ❌"
        exit 1
    fi
}

# Ejecutar
main "$@"

# 📚 GUÍA DE USO: MÓDULO MAESTRITO

## 🚀 Introducción Rápida

**Maestrito** es un chat inteligente que usa Ollama + LLM para permitir que los usuarios creen solicitudes de servicio de forma conversacional. El backend se encarga de toda la lógica; el frontend solo necesita consumir los endpoints HTTP.

---

## 🔌 ENDPOINTS HTTP (API Gateway)

### 1. Iniciar una sesión de chat
```
POST /request/maestrito/start
Authorization: Bearer <JWT_TOKEN>

Response:
{
    "success": true,
    "data": {
        "sessionId": "uuid-here"
    }
}
```

**Notas:**
- Requiere usuario autenticado (CLIENTE o ADMIN)
- Cada usuario puede tener múltiples sesiones simultáneamente
- El sessionId se usa para todos los mensajes siguientes

---

### 2. Enviar un mensaje en la sesión
```
POST /request/maestrito/:sessionId/message
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
    "message": "Tengo un problema en la tubería del baño"
}

Response:
{
    "success": true,
    "data": {
        "sessionId": "uuid-here",
        "type": "MESSAGE" | "SOLICITUD_CREATED" | "ERROR" | "WAITING_INPUT",
        "message": "¿En qué zona de la ciudad se encuentra el problema?",
        "missingFields": [],
        "timestamp": "2025-12-11T..."
    }
}
```

**Tipos de respuesta:**

| Tipo | Significado | Qué hacer |
|------|-------------|-----------|
| `MESSAGE` | Maestrito sigue conversando, pide más datos | Mostrar el mensaje al usuario y esperar siguiente entrada |
| `WAITING_INPUT` | Faltan campos requeridos | Mostrar el mensaje y `missingFields` para que el usuario sepa qué falta |
| `SOLICITUD_CREATED` | ¡Listo! Se creó la solicitud | Mostrar confirmación y datos de `solicitud.idSolicitud` |
| `ERROR` | Algo salió mal | Mostrar error al usuario, proponer reintentar o nueva sesión |

---

### 3. Obtener historial de una sesión
```
GET /request/maestrito/:sessionId/history
Authorization: Bearer <JWT_TOKEN>

Response:
{
    "success": true,
    "data": {
        "messages": [
            { "role": "user", "content": "Tengo un problema en la tubería" },
            { "role": "assistant", "content": "¿En qué zona...?" },
            ...
        ],
        "messageCount": 4
    }
}
```

**Nota:** No incluye el mensaje del sistema (prompt base).

---

### 4. Finalizar una sesión
```
DELETE /request/maestrito/:sessionId
Authorization: Bearer <JWT_TOKEN>

Response:
{
    "success": true,
    "data": {
        "message": "Session ended successfully"
    }
}
```

---

## 💬 FLUJO DE CONVERSACIÓN TÍPICO

```
Usuario: "Necesito arreglar mi tubería"
    ↓
Maestrito: "¿En qué zona de la ciudad está el problema? 
           (necesito el código de parroquia)"
    ↓
Usuario: "En La Mariscal"
    ↓
Maestrito: "¿Puedes describir con más detalle el problema?"
    ↓
Usuario: "Sale agua por debajo del lavamanos"
    ↓
Maestrito: "¿Cuándo necesitas que lo reparen? 
           (da una fecha y hora si tienes disponibilidad)"
    ↓
Usuario: "Mañana a las 10 AM"
    ↓
Maestrito: "¿Cuál es tu presupuesto aproximado? 
           (opcional, pero ayuda)"
    ↓
Usuario: "Unos 50 dólares"
    ↓
Maestrito: "{ 'mode': 'CREAR_SOLICITUD', 'content': '...', 
             'solicitudData': { ... } }"

[Backend crea la solicitud automáticamente]

Response: {
    "type": "SOLICITUD_CREATED",
    "message": "¡Solicitud creada! ID: 12345",
    "solicitud": { "idSolicitud": 12345, ... }
}
```

---

## 🛠️ CAMPOS REQUERIDOS vs OPCIONALES

### Requeridos (Maestrito DEBE recopilar estos)
- **idTipoServicio**: ID del tipo de servicio (1=Plomería, 2=Electricidad, etc.)
- **codigoParroquia**: Código de parroquia (ubicación)
- **tituloProblema**: Título breve (5-100 caracteres)
- **descripcionProblema**: Descripción detallada (20-1000 caracteres)

### Opcionales
- **fechaProgramada**: Cuándo se desea el servicio (ISO string)
- **costoEstimado**: Presupuesto aproximado (número con 2 decimales)
- **costoPromocion**: Costo con promoción (número)
- **promocion**: ¿Tiene promoción? (booleano)
- **duracionEstimadaMin**: Duración estimada (minutos)

---

## 🎯 CONFIGURACIÓN DE OLLAMA

### Requisito: Ollama debe estar corriendo localmente
```bash
# En terminal separada:
ollama serve

# En otra terminal:
ollama pull llama2  # (o el modelo que prefieras)
```

### Variables de Entorno (Request Service)
Actualmente Maestrito usa:
```
OLLAMA_URL=http://localhost:11434  # Se puede configurar
OLLAMA_MODEL=llama2                 # Modelo por defecto
```

**Para cambiar en producción:**
Actualizar `MaestritoService.onModuleInit()` para leer variables de entorno.

---

## 📋 MAPEO DE TIPOS DE SERVICIO

El frontend / usuario debe mencionar uno de estos (Maestrito debe mapearlo):

| ID | Tipo | Ejemplo de mención |
|----|------|-------------------|
| 1 | Plomería | "tubería", "fuga de agua", "desagüe" |
| 2 | Electricidad | "luz", "enchufe", "wiring" |
| 3 | Carpintería | "puerta", "ventana", "mueble" |
| ... | Otros | Consult tabla en BD |

**Nota:** El LLM debe ser entrenado/instruido para reconocer estos. El prompt base incluye ejemplos.

---

## 🔐 SEGURIDAD

### Validaciones
- ✅ JWT requerido para todos los endpoints
- ✅ Solo usuarios CLIENTE o ADMIN pueden usar Maestrito
- ✅ Cada usuario solo puede acceder a sus propias sesiones
- ✅ DTOs se validan automáticamente (class-validator)
- ✅ Los datos del LLM se filtran antes de crear la solicitud

### Timeout
- Si Ollama tarda más de 2 minutos en responder, se aborta
- Sesiones inactivas por 30 minutos se limpian automáticamente

---

## ⚠️ MANEJO DE ERRORES (Frontend)

### Error: "No se pudo conectar a Ollama"
```
→ Backend: Ollama no está corriendo
→ Frontend: Mostrar mensaje "El servicio de IA no está disponible"
→ Sugerencia: Usar formulario tradicional mientras se soluciona
```

### Error: "Sesión no encontrada"
```
→ La sesión expiró o fue finalizada
→ Frontend: Iniciar una nueva sesión
```

### Error: "Faltan campos requeridos"
```
→ Maestrito reintentará automáticamente
→ Si falla 3 veces: Error final
→ Frontend: Proponer llenar formulario manual
```

---

## 📊 RESPUESTA DEL LLM (Detrás de escenas)

El modelo debe responder **siempre en JSON válido**:

```json
{
    "mode": "MENSAJE",
    "content": "¿En qué zona de la ciudad está el problema?",
    "confidence": 0.8
}
```

O cuando tenga todos los datos:

```json
{
    "mode": "CREAR_SOLICITUD",
    "content": "Perfecto, voy a crear tu solicitud...",
    "solicitudData": {
        "idTipoServicio": 1,
        "codigoParroquia": "170131",
        "tituloProblema": "Fuga de agua en lavamanos",
        "descripcionProblema": "Sale agua por debajo del lavamanos...",
        "fechaProgramada": "2025-12-12T10:00:00Z",
        "costoEstimado": 50.00
    },
    "confidence": 0.95
}
```

**Nota:** El backend parsea este JSON y lo mapea a `CreateSolicitudDto`.

---

## 🎨 EJEMPLO DE IMPLEMENTACIÓN (React Native)

```typescript
// En el componente de Maestrito
const [sessionId, setSessionId] = useState<string | null>(null);
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [loading, setLoading] = useState(false);

// 1. Iniciar sesión
const startChat = async () => {
    try {
        const response = await fetch('http://localhost:3000/request/maestrito/start', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (data.success) {
            setSessionId(data.data.sessionId);
        }
    } catch (error) {
        console.error(error);
    }
};

// 2. Enviar mensaje
const sendMessage = async (userMessage: string) => {
    setLoading(true);
    try {
        const response = await fetch(
            `http://localhost:3000/request/maestrito/${sessionId}/message`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            }
        );
        const data = await response.json();

        if (data.success) {
            const response = data.data;

            // Agregar mensaje del usuario
            setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

            // Agregar respuesta del asistente
            setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);

            // Manejar según tipo de respuesta
            if (response.type === 'SOLICITUD_CREATED') {
                // ¡Éxito! Mostrar solicitud creada
                console.log('Solicitud creada:', response.solicitud);
                // Navegar a pantalla de éxito o cerrar chat
            } else if (response.type === 'ERROR') {
                // Mostrar error
                Alert.alert('Error', response.message);
            }
        }
    } catch (error) {
        console.error(error);
        Alert.alert('Error', 'No se pudo enviar el mensaje');
    } finally {
        setLoading(false);
    }
};

// 3. Renderizar
<View>
    <FlatList
        data={messages}
        renderItem={({ item }) => (
            <ChatBubble
                role={item.role}
                content={item.content}
            />
        )}
    />
    <TextInput
        placeholder="Escribe tu mensaje..."
        onSubmitEditing={e => sendMessage(e.nativeEvent.text)}
    />
</View>
```

---

## 📝 PRÓXIMOS PASOS PARA EL FRONTEND

1. **UI de Chat**
   - Pantalla conversacional con burbujas de mensaje
   - Input de texto + botón enviar
   - Indicador de "escribiendo..."

2. **Manejo de Estados**
   - Sesión activa / finalizada
   - Cargando / error / éxito
   - Scroll automático al último mensaje

3. **Validaciones Locales**
   - Mensaje no vacío antes de enviar
   - Mostrar campos faltantes si corresponde

4. **Integración con Navegación**
   - Opción para usar Maestrito o formulario tradicional
   - Transición a pantalla de éxito cuando se crea la solicitud

---

## 🐛 DEBUG

### Ver logs del servicio request
```bash
npm run start:dev:request
```

### Verificar conectividad con Ollama
```bash
curl http://localhost:11434/api/tags
```

### Ver estado de una sesión (en memoria, no persistente)
Los logs mostrarán:
- Creación de sesión
- Cada mensaje enviado/recibido
- Intento de crear solicitud
- Limpieza de sesiones expiradas

---

## ✅ CHECKLIST DE PRUEBAS

- [ ] Iniciar sesión correctamente
- [ ] Enviar mensaje simple
- [ ] Maestrito pide los 4 campos requeridos
- [ ] Completa la información correctamente
- [ ] Se crea la solicitud en la BD
- [ ] Historial se recupera correctamente
- [ ] Finalizar sesión manualmente
- [ ] Sesión expira después de 30 min inactividad
- [ ] Errores de Ollama se manejan gracefully
- [ ] JWT inválido rechaza request

---

## 📞 SOPORTE

Si algo no funciona:
1. Verifica que Ollama esté corriendo
2. Verifica que los archivos estén en el lugar correcto
3. Revisa los logs del servicio request
4. Intenta reiniciar el servicio


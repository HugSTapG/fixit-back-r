# 🎯 DIAGNÓSTICO E IMPLEMENTACIÓN: MÓDULO MAESTRITO

## 📋 RESUMEN EJECUTIVO

Se ha analizado la arquitectura actual del backend FIXIT y se ha confirmado que la implementación del módulo **Maestrito** (chat inteligente con Ollama) es **completamente viable** dentro de la estructura existente.

---

## 1. 🔍 DIAGNÓSTICO DE VIABILIDAD

### ✅ Confirmaciones Positivas

#### 1.1 Ubicación de la Lógica de Crear Solicitud
- **Ubicación:** `apps/request/src/services/solicitudes.service.ts` → método `create()`
- **DTO:** `apps/request/src/dto/solicitud.dto.ts` → clase `CreateSolicitudDto`
- **Controlador:** `apps/request/src/controllers/solicitudes.controller.ts` → patrón `REQUEST_PATTERNS.CREATE_SOLICITUD`
- **Característica:** Ya es accesible vía microservicio (RPC con TCP/NestJS) ✨

#### 1.2 Patrón de Comunicación Entre Microservicios
- Se utiliza `ClientProxy` inyectado en servicios para llamar a otros microservicios
- Patrón confirmado en `apps/payment/src/services/transacciones.service.ts`:
  ```typescript
  const response = await firstValueFrom(
    this.requestClient.send(REQUEST_PATTERNS.CREATE_SOLICITUD, { createSolicitudDto, idUser })
  );
  ```
- Este patrón será **exactamente** el que use Maestrito para invocar la creación

#### 1.3 Validaciones en CreateSolicitudDto
- **Campos requeridos:** `idTipoServicio`, `codigoParroquia`, `tituloProblema`, `descripcionProblema`
- **Campos opcionales:** `costoEstimado`, `costoPromocion`, `promocion`, `fechaProgramada`, `duracionEstimadaMin`
- **Validaciones:** Decoradores `class-validator` (no son un problema, Maestrito generará datos válidos)
- **ℹ️ Nota:** `Transform` decorators para parsing automático de tipos (floats, etc.) funcionarán bien

#### 1.4 Autenticación y Contexto de Usuario
- El controlador `REQUEST_CONTROLLER.create()` espera: `{ createSolicitudDto, idUser }`
- Maestrito recibirá el `idUser` del JWT (desde el frontend)
- **No hay bloqueante:** El usuario autenticado se propaga correctamente

---

## 2. 🏗️ ESTRUCTURA ACTUAL DEL BACKEND

### Microservicios Disponibles
```
fixit-back-r/
├── apps/
│   ├── api-gateway/        ← Punto de entrada HTTP
│   ├── auth/               ← Autenticación
│   ├── geo/                ← Geolocalización
│   ├── notification/       ← Notificaciones
│   ├── payment/            ← Pagos
│   ├── request/            ← 🎯 AQUÍ VA MAESTRITO
│   └── technician/         ← Técnicos
├── libs/
│   ├── events/             ← Patrones de comunicación (REQUEST_PATTERNS)
│   └── shared/             ← Tipos y constantes globales
```

### Flujo Actual de Crear Solicitud (por formulario)
```
Frontend (React Native)
    ↓ POST /request/solicitudes
API Gateway (RequestController)
    ↓ proxy.createSolicitud()
Request Service (SolicitudesService.create)
    ↓ Valida DTO + crea en BD
Response ← Solicitud creada
```

### Flujo Nuevo de Crear Solicitud (por Maestrito)
```
Frontend (React Native)
    ↓ POST /request/maestrito/start (inicia sesión)
    ↓ POST /request/maestrito/:sessionId/message (envía mensaje)
API Gateway 
    ↓ MaestritoController
Request Service (MaestritoService)
    ↓ Obtiene contexto de sesión
    ↓ Llama a OllamaClient.chat()
    ↓ Interpreta respuesta del LLM
    ↓ Si modo: "CREAR_SOLICITUD", llama al mismo
    ↓   REQUEST_PATTERNS.CREATE_SOLICITUD que usa el formulario
Response ← Mensaje o solicitud creada
```

---

## 3. 📦 ARCHIVOS A CREAR/MODIFICAR

### A. CREAR (Nuevos Archivos)

#### 3.1 `apps/request/src/maestrito/maestrito.module.ts`
- Módulo que encapsula Maestrito
- Exporta servicios y controlador

#### 3.2 `apps/request/src/maestrito/maestrito.controller.ts`
- Controlador con dos endpoints:
  - `POST @MessagePattern(MAESTRITO_PATTERNS.START_SESSION)`
  - `POST @MessagePattern(MAESTRITO_PATTERNS.SEND_MESSAGE)`

#### 3.3 `apps/request/src/maestrito/maestrito.service.ts`
- Orquesta la conversación
- Mantiene historial en memoria (sesiones en Map<sessionId, ChatSession>)
- Llama a OllamaClient
- Interpreta JSON de respuesta
- Invoca CREATE_SOLICITUD cuando corresponda

#### 3.4 `apps/request/src/maestrito/ollama-client.ts`
- Cliente HTTP para Ollama
- Implementa `chat(model, messages): Promise<string>`
- Usa `axios` o `node-fetch`

#### 3.5 `libs/events/src/patterns/maestrito.patterns.ts`
- Define nuevos patrones:
  - `MAESTRITO_PATTERNS.START_SESSION`
  - `MAESTRITO_PATTERNS.SEND_MESSAGE`

#### 3.6 `apps/request/src/maestrito/types/chat-session.types.ts`
- Tipo `ChatSession`
- Tipo `ChatMessage`
- Tipo `LLMResponse` (parseable a JSON)

### B. MODIFICAR (Archivos Existentes)

#### 3.7 `apps/request/src/request.module.ts`
- Importar y registrar `MaestritoModule`

#### 3.8 `libs/events/src/index.ts`
- Exportar `MAESTRITO_PATTERNS`

#### 3.9 `apps/api-gateway/src/api.module.ts`
- (Opcional) Crear cliente TCP para request service si no existe

#### 3.10 `apps/api-gateway/src/controllers/request.controller.ts`
- Agregar endpoints REST que deleguen a Maestrito:
  - `POST /maestrito/start`
  - `POST /maestrito/:sessionId/message`

#### 3.11 `apps/api-gateway/src/proxy/services/request-proxy.service.ts`
- Agregar métodos proxy:
  - `startMaestritoSession()`
  - `sendMaestritoMessage()`

---

## 4. ⚙️ PLAN DE IMPLEMENTACIÓN

### FASE 1: Crear Patrones de Eventos (10 min)

**Archivo:** `libs/events/src/patterns/maestrito.patterns.ts`

```typescript
export const MAESTRITO_PATTERNS = {
    START_SESSION: 'maestrito.session.start',
    SEND_MESSAGE: 'maestrito.message.send',
};
```

**Actualizar:** `libs/events/src/index.ts` → exportar MAESTRITO_PATTERNS

---

### FASE 2: Crear Cliente OllamaClient (15 min)

**Archivo:** `apps/request/src/maestrito/ollama-client.ts`

- Clase con método `chat(model: string, messages: ChatMessage[]): Promise<string>`
- Usa HTTP POST a `http://localhost:11434/api/chat`
- Manejo de errores básico
- Logger

---

### FASE 3: Crear Tipos TypeScript (10 min)

**Archivo:** `apps/request/src/maestrito/types/chat-session.types.ts`

```typescript
export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface ChatSession {
    sessionId: string;
    userId: number;
    createdAt: Date;
    messages: ChatMessage[];
    isActive: boolean;
}

export interface LLMResponse {
    mode: 'MENSAJE' | 'CREAR_SOLICITUD';
    content: string;
    solicitudData?: any; // Parcial o completo CreateSolicitudDto
}
```

---

### FASE 4: Crear MaestritoService (45 min)

**Archivo:** `apps/request/src/maestrito/maestrito.service.ts`

**Responsabilidades:**
1. Gestionar mapa de sesiones en memoria
2. Construir array de mensajes para Ollama (con prompt base)
3. Llamar a `OllamaClient.chat()`
4. Parsear respuesta JSON del modelo
5. Si modo `CREAR_SOLICITUD`, mapear datos a `CreateSolicitudDto`
6. Invocar `REQUEST_PATTERNS.CREATE_SOLICITUD` usando `ClientProxy`
7. Retornar respuesta clara (error / mensaje / solicitud creada)

**Métodos principales:**
- `startSession(userId: number): { sessionId: string }`
- `sendMessage(sessionId: string, userMessage: string): Promise<ChatResponse>`
- `private buildMessagesForOllama(session: ChatSession): ChatMessage[]`
- `private parseOllamaResponse(text: string): LLMResponse`
- `private createSolicitudViaRPC(data, idUser): Promise<any>`

---

### FASE 5: Crear MaestritoController (15 min)

**Archivo:** `apps/request/src/maestrito/maestrito.controller.ts`

```typescript
@Controller()
export class MaestritoController {
    @MessagePattern(MAESTRITO_PATTERNS.START_SESSION)
    startSession(@Payload() data: { idUser: number }) { }

    @MessagePattern(MAESTRITO_PATTERNS.SEND_MESSAGE)
    sendMessage(@Payload() data: { sessionId: string; message: string; idUser: number }) { }
}
```

---

### FASE 6: Crear MaestritoModule (5 min)

**Archivo:** `apps/request/src/maestrito/maestrito.module.ts`

```typescript
@Module({
    providers: [MaestritoService, OllamaClient],
    controllers: [MaestritoController],
    exports: [MaestritoService],
})
export class MaestritoModule { }
```

---

### FASE 7: Integrar en RequestModule (5 min)

**Modificar:** `apps/request/src/request.module.ts`

- Importar `MaestritoModule`

---

### FASE 8: Exponer en API Gateway (30 min)

**Crear/Modificar:**
- `apps/api-gateway/src/controllers/request.controller.ts`
  - Agregar dos endpoints REST `@Post` para `/maestrito/start` y `/maestrito/:sessionId/message`
- `apps/api-gateway/src/proxy/services/request-proxy.service.ts`
  - Agregar métodos que deleguen al servicio Request

---

## 5. 🔗 INTEGRACIÓN CON CREAR SOLICITUD

### Punto de Integración Clave

Dentro de `MaestritoService.sendMessage()`, cuando el LLM responda con `modo: "CREAR_SOLICITUD"`:

```typescript
if (parsedResponse.mode === 'CREAR_SOLICITUD') {
    // Mapear datos del LLM a CreateSolicitudDto
    const createDto = this.mapToCreateSolicitudDto(parsedResponse.solicitudData);
    
    // Llamar al mismo patrón que usa el formulario
    const response = await firstValueFrom(
        this.requestClient.send(REQUEST_PATTERNS.CREATE_SOLICITUD, {
            createSolicitudDto: createDto,
            idUser: session.userId
        })
    );

    if (!response.success) {
        throw new BadRequestException(response.error);
    }

    return {
        mode: 'SOLICITUD_CREADA',
        solicitud: response.data
    };
}
```

### Por qué funciona
- ✅ Reutiliza exactamente la misma validación del DTO
- ✅ Usa el mismo `SolicitudesService.create()` 
- ✅ Mantiene la lógica de negocio centralizada
- ✅ No hay duplicación de código
- ✅ Los cambios futuros en el formulario aplican automáticamente al chat

---

## 6. 📊 VALIDACIONES Y CONSIDERACIONES

### Validaciones Automáticas del DTO

Los decoradores de `class-validator` en `CreateSolicitudDto` se ejecutarán cuando NestJS reciba el payload:
- ✅ `@IsInt()`, `@Min()`, `@Length()`, etc. validarán automáticamente
- ✅ `@Transform()` parseará strings a números/booleanos
- ⚠️ **Maestrito debe generar datos que pasen estas validaciones**, o fallar claramente

**Estrategia:** El prompt del LLM debe instruir al modelo a retornar datos válidos, con ejemplos JSON.

### Campos Faltantes

Si el LLM no genera todos los campos requeridos:
- `idTipoServicio`, `codigoParroquia`, `tituloProblema`, `descripcionProblema` → **OBLIGATORIOS**
- Maestrito puede preguntar más hasta obtenerlos todos
- O retornar error claro: "Necesito más información para crear la solicitud"

---

## 7. 💾 ALMACENAMIENTO DE SESIONES (MVP)

### Opción Seleccionada: En Memoria (Map)

```typescript
private sessions = new Map<string, ChatSession>();
```

**Ventajas para MVP:**
- ✅ Simple, sin dependencias de BD o cache
- ✅ Rápido
- ✅ Suficiente para pruebas

**Limitaciones:**
- ⚠️ Las sesiones se pierden si el servicio se reinicia
- ⚠️ No escalable a múltiples instancias

**Evolución Futura:**
- Redis para sesiones distribuidas
- PostgreSQL para historial de chats

---

## 8. 📡 LLAMADAS A OLLAMA

### Configuración MVP

```typescript
const ollamaUrl = 'http://localhost:11434/api/chat';

// POST http://localhost:11434/api/chat
{
    "model": "llama2",  // O el modelo disponible
    "messages": [
        { "role": "system", "content": "Eres Maestrito..." },
        { "role": "user", "content": "Necesito arreglar mi tubería" },
        { "role": "assistant", "content": "..." },
        { "role": "user", "content": "En 3 días a las 10 AM" }
    ],
    "stream": false
}

// Response
{
    "model": "llama2",
    "created_at": "...",
    "message": {
        "role": "assistant",
        "content": "{ \"mode\": \"MENSAJE\", \"content\": \"¿En qué zona exactamente?\" }"
    },
    "done": true
}
```

**Formato esperado de Maestrito:**
- Siempre retorna `{ "mode": "...", "content": "...", "solicitudData": {...} }`
- Esto es JSON, Maestrito lo parsea y actúa

---

## 9. 🚀 PRÓXIMOS PASOS (POST-MVP)

1. **Soporte de Imágenes**
   - Extensión de OllamaClient para vision models
   - Base64 encoding en mensajes

2. **Persistencia de Chat**
   - Nueva tabla `maestrito_chats` en BD
   - Guardar historial completo

3. **Streaming**
   - WebSockets o Server-Sent Events
   - Respuesta en tiempo real del LLM

4. **Análisis de Confianza**
   - Score de confianza del LLM para cada campo
   - Confirmación del usuario antes de crear

5. **Modelos Alternativos**
   - Soporte para mistral, neural-chat, etc.
   - Selección dinámica de modelo

---

## 10. ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] FASE 1: Crear patrones de eventos
- [ ] FASE 2: Crear OllamaClient
- [ ] FASE 3: Crear tipos TypeScript
- [ ] FASE 4: Crear MaestritoService
- [ ] FASE 5: Crear MaestritoController
- [ ] FASE 6: Crear MaestritoModule
- [ ] FASE 7: Integrar en RequestModule
- [ ] FASE 8: Exponer en API Gateway
- [ ] Pruebas manuales con Ollama local
- [ ] Documentación de prompt base
- [ ] Entrega al equipo de frontend

---

## 📝 CONCLUSIÓN

**Viabilidad:** 100% ✅

El módulo Maestrito se puede implementar de forma **limpia, escalable y sin romper la lógica existente**. La arquitectura de microservicios de FIXIT está lista para soportarlo.

**Tiempo estimado:** 3-4 horas de desarrollo (sin UI en frontend).

**Riesgo:** Bajo. No hay cambios en servicios existentes, solo adiciones.


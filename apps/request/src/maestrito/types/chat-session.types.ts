/**
 * Tipos para el módulo Maestrito
 * Definen la estructura de sesiones de chat y respuestas del LLM
 */

import { ChatMessage } from '../ollama-client';

/**
 * Sesión activa de chat con el usuario
 */
export interface ChatSession {
    /**
     * ID único de la sesión
     */
    sessionId: string;

    /**
     * ID del usuario propietario de la sesión
     */
    userId: number;

    /**
     * Timestamp de creación
     */
    createdAt: Date;

    /**
     * Última interacción
     */
    lastActivityAt: Date;

    /**
     * Historial de mensajes en la conversación
     */
    messages: ChatMessage[];

    /**
     * Si la sesión sigue activa
     */
    isActive: boolean;

    /**
     * Datos parcialmente recopilados del LLM
     * Se usa para validar que tenemos todos los campos necesarios
     */
    partialSolicitudData: Partial<CreateSolicitudData>;

    /**
     * Contador de intentos fallidos para crear solicitud
     */
    failedAttempts: number;
}

/**
 * Estructura que retorna el LLM parseable a JSON
 */
export interface LLMJSONResponse {
    /**
     * Modo de operación: mensaje normal o crear solicitud
     */
    mode: 'MENSAJE' | 'CREAR_SOLICITUD';

    /**
     * Mensaje a mostrar al usuario
     */
    content: string;

    /**
     * Datos para crear solicitud (solo si mode === 'CREAR_SOLICITUD')
     */
    solicitudData?: Partial<CreateSolicitudData>;

    /**
     * Campo de confianza: qué tan seguro está el LLM de los datos
     */
    confidence?: number;
}

/**
 * Datos de creación de solicitud que el LLM puede generar
 * Corresponde a CreateSolicitudDto del servicio request
 */
export interface CreateSolicitudData {
    /**
     * ID del tipo de servicio (REQUERIDO)
     */
    idTipoServicio: number;

    /**
     * Código de parroquia donde se realiza el servicio (REQUERIDO)
     */
    codigoParroquia: string;

    /**
     * Título del problema (REQUERIDO)
     */
    tituloProblema: string;

    /**
     * Descripción detallada del problema (REQUERIDO)
     */
    descripcionProblema: string;

    /**
     * Costo estimado (OPCIONAL)
     */
    costoEstimado?: number;

    /**
     * Costo de promoción (OPCIONAL)
     */
    costoPromocion?: number;

    /**
     * Si tiene promoción (OPCIONAL)
     */
    promocion?: boolean;

    /**
     * Fecha programada para el servicio (OPCIONAL, formato ISO)
     */
    fechaProgramada?: string;

    /**
     * Duración estimada en minutos (OPCIONAL)
     */
    duracionEstimadaMin?: number;
}

/**
 * Respuesta a enviar al cliente del chat
 */
export interface MaestritoResponse {
    /**
     * ID de la sesión
     */
    sessionId: string;

    /**
     * Tipo de respuesta
     */
    type: 'MESSAGE' | 'SOLICITUD_CREATED' | 'ERROR' | 'WAITING_INPUT';

    /**
     * Mensaje para mostrar al usuario
     */
    message: string;

    /**
     * Datos de la solicitud creada (si type === 'SOLICITUD_CREATED')
     */
    solicitud?: any;

    /**
     * Campos faltantes si necesitamos más info del usuario
     */
    missingFields?: string[];

    /**
     * Timestamp de la respuesta
     */
    timestamp: Date;
}

/**
 * Prompt base para Maestrito
 * CRÍTICO: El modelo DEBE responder SOLO con JSON válido, sin extras
 */
export const MAESTRITO_SYSTEM_PROMPT = `Eres Maestrito, un asistente inteligente para crear solicitudes de servicio técnico.

=== INSTRUCCIONES CRÍTICAS ===
NUNCA agregues texto, markdown, código fences (backticks), comentarios o explicaciones.
RESPONDE SIEMPRE y EXCLUSIVAMENTE con JSON VÁLIDO.
Si no puedes responder en JSON, repite el último JSON válido.

=== TABLA DE TIPOS DE SERVICIO ===
Mapea la mención del usuario a idTipoServicio usando esta tabla:

ID 1 = Plomería (tubería, agua, desagüe, lavamanos, ducha, fuga, llave)
ID 2 = Electricidad (luz, enchufe, cable, interruptor, corriente, falla eléctrica)
ID 3 = Carpintería (puerta, ventana, mueble, madera, armario, reparación)
ID 4 = Aire Acondicionado (frío, aire, clima, enfriador, ventilación)
ID 5 = Cerrajería (llave, cerradura, candado, acceso)
ID 6 = Vidriería (vidrio, cristal, espejo, ventana)

Si el usuario menciona otro servicio no listado, PREGUNTA qué ID debe usarse.

=== CAMPOS REQUERIDOS (OBLIGATORIO RECOPILAR) ===
1. idTipoServicio (INTEGER, 1-6): ID del tipo de servicio (consultar tabla)
2. codigoParroquia (STRING, formato exacto): Código parroquia en formato "XXXXXX" (ej: "170131")
3. tituloProblema (STRING, 5-100 caracteres): Título breve del problema
4. descripcionProblema (STRING, 20-1000 caracteres): Descripción detallada

=== CAMPOS OPCIONALES ===
- fechaProgramada (ISO string): Cuándo quiere el servicio (ej: "2025-12-12T10:00:00Z")
- costoEstimado (NUMBER, 2 decimales): Presupuesto aproximado (ej: 50.00)
- costoPromocion (NUMBER): Costo con promoción
- promocion (BOOLEAN): ¿Tiene promoción?
- duracionEstimadaMin (INTEGER): Duración en minutos

=== CONVERSACIÓN ===
- Sé amable, empático y natural
- Haz preguntas una a la vez
- Pide clarificación si no entiendes
- Valida que los datos sean coherentes

=== FORMATO JSON OBLIGATORIO ===
Responde SIEMPRE con este JSON exacto (sin markdown, sin triple backticks):

PARA MENSAJES NORMALES:
{"mode": "MENSAJE", "content": "Tu pregunta o comentario aquí", "confidence": 0.7}

PARA CREAR SOLICITUD (cuando tengas TODOS los campos):
{"mode": "CREAR_SOLICITUD", "content": "Resumen", "solicitudData": {"idTipoServicio": 1, "codigoParroquia": "170131", "tituloProblema": "Fuga en lavamanos", "descripcionProblema": "Sale agua por debajo del lavamanos", "fechaProgramada": "2025-12-12T10:00:00Z", "costoEstimado": 50.00}, "confidence": 0.95}

=== REGLAS DE CREACIÓN ===
- Solo responde mode: "CREAR_SOLICITUD" cuando tengas TODOS los 4 campos requeridos
- confidence debe ser >= 0.85 para crear
- Si falta algo, responde mode: "MENSAJE" pidiendo lo faltante
- Si el usuario da datos inválidos, pide corrección

=== RESPUESTA A ERRORES ===
Si el usuario dice algo incoherente:
{"mode": "MENSAJE", "content": "No entiendo. Por favor repite o aclara tu respuesta.", "confidence": 0.5}

COMIENZA SALUDANDO AL USUARIO Y PREGUNTANDO QUÉ SERVICIO NECESITA.`;

/**
 * Campos requeridos para crear solicitud
 */
export const REQUIRED_FIELDS: (keyof CreateSolicitudData)[] = [
    'idTipoServicio',
    'codigoParroquia',
    'tituloProblema',
    'descripcionProblema',
];

/**
 * Campos opcionales
 */
export const OPTIONAL_FIELDS: (keyof CreateSolicitudData)[] = [
    'costoEstimado',
    'costoPromocion',
    'promocion',
    'fechaProgramada',
    'duracionEstimadaMin',
];

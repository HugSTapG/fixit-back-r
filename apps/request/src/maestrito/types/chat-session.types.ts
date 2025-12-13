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

    /**
     * Indica si estamos esperando la confirmación explícita del usuario
     */
    awaitingConfirmation: boolean;

    /**
     * Datos listos para crear la solicitud una vez confirmados
     */
    pendingSolicitudData: CreateSolicitudData | null;

    /**
     * Último resumen enviado al usuario previo a la confirmación
     */
    lastSummaryMessage?: string | null;

    /**
     * Paso actual del flujo conversacional
     */
    pendingField: MaestritoField;

    /**
     * Campos completados en el flujo
     */
    completedFields: MaestritoField[];

    /**
     * Campos opcionales que el usuario decidió omitir
     */
    skippedOptionalFields: MaestritoField[];

    /**
     * Indica si la última respuesta del usuario expresó duda o falta de información
     */
    lastUserWasUncertain: boolean;
}

export type MaestritoField =
    | 'SERVICE_TYPE'
    | 'PROBLEM_DESCRIPTION'
    | 'LOCATION'
    | 'DATE'
    | 'CONFIRMATION';

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
export const MAESTRITO_SYSTEM_PROMPT = `Eres Maestrito, un asistente conversacional que guía a personas para crear solicitudes de servicio técnico paso a paso.

=== INSTRUCCIONES CRÍTICAS ===
NUNCA agregues texto, markdown, código fences (backticks), comentarios o explicaciones.
RESPONDE SIEMPRE y EXCLUSIVAMENTE con JSON VÁLIDO.
RESPONDE SIEMPRE en español neutro, cordial, cercano y profesional.
Si no puedes responder en JSON, repite el último JSON válido.
Nunca muestres a la persona usuaria campos internos como mode, confidence o metadata.

=== TABLA DE TIPOS DE SERVICIO (USA SOLO ESTOS VALORES REALES) ===
ID 1 = Plomería (tubería, agua, desagüe, lavamanos, ducha, fuga, llave)
ID 2 = Electricidad (luz, enchufe, cable, interruptor, corriente, falla eléctrica)
ID 3 = Carpintería (puerta, ventana, mueble, madera, armario, reparación)
ID 4 = Aire Acondicionado (frío, aire, clima, enfriador, ventilación)
ID 5 = Cerrajería (llave, cerradura, candado, acceso)
ID 6 = Vidriería (vidrio, cristal, espejo, ventana)
Si hay duda entre varias opciones, ofrece hasta 3 alternativas numeradas para que la persona elija.

=== CAMPOS REQUERIDOS ===
1. idTipoServicio (INTEGER, 1-6)
2. codigoParroquia (STRING exacto, formato "XXXXXX")
3. tituloProblema (STRING, 5-100 caracteres)
4. descripcionProblema (STRING, 20-1000 caracteres)

=== CAMPOS OPCIONALES ===
- fechaProgramada (ISO string opcional)
- costoEstimado, costoPromocion, promocion, duracionEstimadaMin

=== FLUJO DEL WIZARD (OBLIGATORIO) ===
Sigue SIEMPRE este orden. Cada mensaje debe enfocarse en un solo punto:
1. Tipo de servicio ➜ identifica o propone opciones numéricas reales.
2. Descripción del problema ➜ resume en lenguaje sencillo, genera automáticamente un título corto.
3. Ubicación ➜ intenta inferir parroquia/cantón a partir de barrios; si no es posible, ofrece hasta 3 parroquias válidas para elegir por número.
4. Fecha estimada ➜ pregunta si desea agendar fecha; permite continuar si responde "no", "no sé" o similar.
5. Confirmación final ➜ presenta resumen, incluye una recomendación preventiva y solicita confirmación clara.
No regreses a un paso anterior salvo que la persona pida explícitamente cambiar un dato.

=== MANEJO DE RESPUESTAS INCOMPLETAS ===
Si la persona responde "no sé", "eso es todo", "no tengo más detalles" u otra duda:
- Agradece la información disponible.
- Completa el campo con la mejor interpretación posible (ej: descripcion genérica "El usuario no tiene más detalles").
- Avanza al siguiente campo sin repetir la misma pregunta.

=== UBICACIÓN ===
- Intenta inferir códigos de parroquia conocidos a partir de nombres de barrios o cantones (ej: "Tarqui", "Alborada", "Quitumbe").
- Si no puedes inferirlo, ofrece hasta 3 opciones numéricas reales y pide elegir el número correspondiente.
- Nunca inventes códigos ni pidas direcciones exactas.

=== FORMATO JSON OBLIGATORIO ===
Responde SIEMPRE con este JSON exacto (sin markdown ni triple backticks):

PARA MENSAJES NORMALES:
{"mode": "MENSAJE", "content": "Texto natural en español", "confidence": 0.7}

PARA CREAR SOLICITUD (cuando tengas TODOS los campos y confirmación):
{"mode": "CREAR_SOLICITUD", "content": "Resumen en lenguaje humano", "solicitudData": {"idTipoServicio": 1, "codigoParroquia": "170131", "tituloProblema": "Fuga en lavamanos", "descripcionProblema": "Sale agua por debajo del lavamanos", "fechaProgramada": "2025-12-12T10:00:00Z"}, "confidence": 0.95}

=== REGLAS DE CREACIÓN ===
- Solo responde mode "CREAR_SOLICITUD" cuando todos los campos requeridos están completos y la persona confirmó con un "sí" claro.
- Antes de crear, incluye SIEMPRE una recomendación breve y útil (ej: "Mientras llega el técnico, cierra la llave de paso").
- Repite el resumen con viñetas legibles y pregunta "¿Deseas publicar esta solicitud?".
- Espera confirmación afirmativa explícita ("sí", "confirmo", "publicar").
- confidence debe ser >= 0.85 para crear.
- Si falta algo, responde mode "MENSAJE" solicitando solo el dato pendiente.
- Si la persona pide corregir un campo, actualiza datos y vuelve a confirmar.

=== RESPUESTA A ERRORES ===
Si el usuario dice algo incoherente:
{"mode": "MENSAJE", "content": "No entiendo bien. ¿Puedes aclararlo con otras palabras?", "confidence": 0.5}

COMIENZA SALUDANDO Y preguntando de forma breve qué está ocurriendo para poder ayudar.`;

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

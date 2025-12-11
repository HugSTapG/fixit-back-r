/**
 * Patrones de eventos para el módulo Maestrito
 * Chat inteligente con LLM para crear solicitudes de servicio
 */

export const MAESTRITO_PATTERNS = {
    // Sesiones de chat
    START_SESSION: 'maestrito.session.start',
    SEND_MESSAGE: 'maestrito.message.send',
    END_SESSION: 'maestrito.session.end',
    GET_SESSION_HISTORY: 'maestrito.session.history',
};

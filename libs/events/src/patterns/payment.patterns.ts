/**
 * Patrones de comunicación para el microservicio de pagos
 */
export const PAYMENT_PATTERNS = {
    // Transacciones CRUD
    GET_ALL_TRANSACCIONES: 'payment.transacciones.findAll',
    GET_TRANSACCION: 'payment.transacciones.findOne',
    CREATE_TRANSACCION: 'payment.transacciones.create',
    UPDATE_TRANSACCION: 'payment.transacciones.update',

    // Procesamiento de pagos
    PROCESAR_PAGO: 'payment.transacciones.procesarPago',
    CONFIRMAR_PAGO: 'payment.transacciones.confirmarPago',
    MARCAR_FALLIDO: 'payment.transacciones.marcarFallido',

    // Consultas específicas
    GET_BY_SOLICITUD: 'payment.transacciones.findBySolicitud',
    GET_BY_USER: 'payment.transacciones.findByUser',

    // Estadísticas
    GET_STATS: 'payment.transacciones.getStats',
    GET_STATS_BY_METODO: 'payment.transacciones.getStatsByMetodo',
    GET_USER_STATS: 'payment.transacciones.getUserStats',
    GET_USER_STATS_BY_METODO: 'payment.transacciones.getUserStatsByMetodo',
} as const;

export enum RolUsuario {
    ADMIN = 'ADMIN',
    TECNICO = 'TECNICO',
    CLIENTE = 'CLIENTE',
}

export enum TipoNotificacion {
    SOLICITUD_NUEVA = 'SOLICITUD_NUEVA',
    SOLICITUD_ACEPTADA = 'SOLICITUD_ACEPTADA',
    SOLICITUD_COMPLETADA = 'SOLICITUD_COMPLETADA',
    CALIFICACION_RECIBIDA = 'CALIFICACION_RECIBIDA',
    RECORDATORIO = 'RECORDATORIO',
}

export enum EstatusCertificacion {
    PENDIENTE = 'PENDIENTE',
    VERIFICADA = 'VERIFICADA',
    RECHAZADA = 'RECHAZADA',
    VENCIDA = 'VENCIDA',
}

export enum SubServicio {
    INSTALACION = 'INSTALACION',
    REPARACION = 'REPARACION',
    MANTENIMIENTO = 'MANTENIMIENTO',
    DESINSTALACION = 'DESINSTALACION',
    REVISION = 'REVISION',
    OTRO = 'OTRO',
}

export enum EstadoSolicitud {
    PENDIENTE = 'PENDIENTE',
    ACEPTADA = 'ACEPTADA',
    CANCELADA = 'CANCELADA',
    COMPLETADA = 'COMPLETADA',
}

export enum EstadoAceptacion {
    PROPUESTO = 'PROPUESTO',
    ACEPTADO = 'ACEPTADO',
    RECHAZADO = 'RECHAZADO',
}

export enum PuntajeCalificacion {
    EXCELENTE = 'EXCELENTE',
    BUENO = 'BUENO',
    REGULAR = 'REGULAR',
    MALO = 'MALO',
    TERRIBLE = 'TERRIBLE',
}

export enum MetodoPago {
    EFECTIVO = 'EFECTIVO',
    TRANSFERENCIA = 'TRANSFERENCIA',
    TARJETA = 'TARJETA',
    OTRO = 'OTRO',
}

export enum EstadoPago {
    PENDIENTE = 'PENDIENTE',
    PAGADO = 'PAGADO',
    FALLIDO = 'FALLIDO',
}

/**
 * Patrones de eventos para microservicios (RabbitMQ)
 */
export const NOTIFICATION_PATTERNS = {
    CREATE_NOTIFICACION: 'notificacion.create',
    UPDATE_NOTIFICACION: 'notificacion.update',
    GET_NOTIFICACIONES: 'notificacion.getByUser',
    MARK_SEEN: 'notificacion.markSeen',
} as const;

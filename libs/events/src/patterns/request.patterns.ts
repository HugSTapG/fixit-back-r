export const REQUEST_PATTERNS = {
    // Solicitudes
    FIND_ALL_SOLICITUDES: 'request.solicitudes.findAll',
    FIND_SOLICITUD_BY_ID: 'request.solicitudes.findOne',
    CREATE_SOLICITUD: 'request.solicitudes.create',
    UPDATE_SOLICITUD: 'request.solicitudes.update',
    CANCEL_SOLICITUD: 'request.solicitudes.cancel',
    DELETE_SOLICITUD: 'request.solicitudes.delete',
    FIND_SOLICITUDES_BY_USER: 'request.solicitudes.findByUser',
    GET_SOLICITUDES_STATS: 'request.solicitudes.getStats',

    // Solicitudes-Tecnicos
    FIND_ALL_SOLICITUDES_TECNICOS: 'request.solicitudesTecnicos.findAll',
    FIND_SOLICITUD_TECNICO_BY_ID: 'request.solicitudesTecnicos.findOne',
    POSTULARSE_SOLICITUD: 'request.solicitudesTecnicos.postularse',
    RESPONDER_SOLICITUD: 'request.solicitudesTecnicos.responder',
    FIND_SOLICITUDES_BY_SOLICITUD: 'request.solicitudesTecnicos.findBySolicitud',
    FIND_SOLICITUDES_BY_TECNICO: 'request.solicitudesTecnicos.findByTecnico',
    UPDATE_SOLICITUD_TECNICO: 'request.solicitudesTecnicos.update',
    CANCEL_SOLICITUD_TECNICO: 'request.solicitudesTecnicos.cancel',
    GET_STATS_BY_TECNICO: 'request.solicitudesTecnicos.getStatsByTecnico',

    // Transacciones
    CREATE_TRANSACCION: 'request.transacciones.create',
    UPDATE_TRANSACCION: 'request.transacciones.update',
    FIND_TRANSACCIONES_BY_SOLICITUD: 'request.transacciones.findBySolicitud',
    PROCESAR_PAGO: 'request.transacciones.procesarPago',
};

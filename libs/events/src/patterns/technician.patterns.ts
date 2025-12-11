export const TECHNICIAN_PATTERNS = {
    // Técnicos
    FIND_TECHNICIAN_BY_ID: 'technician.tecnico.findById',
    FIND_TECHNICIAN_BY_USER_ID: 'technician.tecnico.findByUserId',
    FIND_ALL_TECHNICIANS: 'technician.tecnico.findAll',
    CREATE_TECHNICIAN: 'technician.tecnico.create',
    UPDATE_TECHNICIAN: 'technician.tecnico.update',
    DEACTIVATE_TECHNICIAN: 'technician.tecnico.deactivate',
    FIND_TECHNICIANS_BY_PARROQUIA: 'technician.tecnico.findByParroquia',
    FIND_TECHNICIANS_BY_TIPO_SERVICIO: 'technician.tecnico.findByTipoServicio',
    GET_TOP_RATED_TECHNICIANS: 'technician.tecnico.getTopRated',
    FIND_AVAILABLE_FOR_REQUEST: 'technician.tecnico.findAvailableForRequest',
    GET_TECHNICIAN_STATS: 'technician.tecnico.getStats',

    // Certificaciones
    FIND_ALL_CERTIFICACIONES: 'technician.certificacion.findAll',
    FIND_CERTIFICACION_BY_ID: 'technician.certificacion.findById',
    CREATE_CERTIFICACION: 'technician.certificacion.create',
    UPDATE_CERTIFICACION: 'technician.certificacion.update',
    DELETE_CERTIFICACION: 'technician.certificacion.delete',

    // Técnico-Certificaciones
    FIND_ALL_TECNICO_CERTIFICACIONES: 'technician.tecnicoCertificacion.findAll',
    FIND_TECNICO_CERTIFICACION_BY_ID: 'technician.tecnicoCertificacion.findById',
    CREATE_TECNICO_CERTIFICACION: 'technician.tecnicoCertificacion.create',
    UPDATE_TECNICO_CERTIFICACION: 'technician.tecnicoCertificacion.update',
    DELETE_TECNICO_CERTIFICACION: 'technician.tecnicoCertificacion.delete',
    VERIFY_TECNICO_CERTIFICACION: 'technician.tecnicoCertificacion.verify',
    REJECT_TECNICO_CERTIFICACION: 'technician.tecnicoCertificacion.reject',
    FIND_CERTIFICACIONES_BY_TECNICO: 'technician.tecnicoCertificacion.findByTecnico',
    FIND_TECNICOS_BY_CERTIFICACION: 'technician.tecnicoCertificacion.findByCertificacion', // AGREGADO
    FIND_PENDING_CERTIFICACIONES: 'technician.tecnicoCertificacion.findPending',
    FIND_VERIFIED_CERTIFICACIONES: 'technician.tecnicoCertificacion.findVerified', // AGREGADO
    FIND_EXPIRING_CERTIFICACIONES: 'technician.tecnicoCertificacion.findExpiring',
    MARK_EXPIRED_CERTIFICACIONES: 'technician.tecnicoCertificacion.markExpired',
    GET_CERTIFICACION_STATS: 'technician.tecnicoCertificacion.getStats',
    GET_CERTIFICACION_STATS_BY_TECNICO: 'technician.tecnicoCertificacion.getStatsByTecnico', // AGREGADO
    RENOVAR_CERTIFICACION: 'technician.tecnicoCertificacion.renovar', // AGREGADO

    // Técnico-Parroquias
    FIND_ALL_TECNICO_PARROQUIAS: 'technician.tecnicoParroquia.findAll',
    CREATE_TECNICO_PARROQUIA: 'technician.tecnicoParroquia.create',
    DELETE_TECNICO_PARROQUIA: 'technician.tecnicoParroquia.delete',
    FIND_PARROQUIAS_BY_TECNICO: 'technician.tecnicoParroquia.findByTecnico',
    FIND_TECNICOS_BY_PARROQUIA: 'technician.tecnicoParroquia.findByParroquia',

    // Tipos de Servicios
    FIND_ALL_TIPOS_SERVICIOS: 'technician.tipoServicio.findAll',
    FIND_TIPO_SERVICIO_BY_ID: 'technician.tipoServicio.findById',
    CREATE_TIPO_SERVICIO: 'technician.tipoServicio.create',
    UPDATE_TIPO_SERVICIO: 'technician.tipoServicio.update',
    DELETE_TIPO_SERVICIO: 'technician.tipoServicio.delete',
    GET_TIPO_SERVICIO_STATS: 'technician.tipoServicio.getStats',

    // Técnico-Servicios
    FIND_ALL_TECNICO_SERVICIOS: 'technician.tecnicoServicio.findAll',
    CREATE_TECNICO_SERVICIO: 'technician.tecnicoServicio.create',
    DELETE_TECNICO_SERVICIO: 'technician.tecnicoServicio.delete',
    FIND_SERVICIOS_BY_TECNICO: 'technician.tecnicoServicio.findByTecnico',
    FIND_TECNICOS_BY_SERVICIO: 'technician.tecnicoServicio.findByTipoServicio',

    // Calificaciones
    CREATE_CALIFICACION: 'technician.calificacion.create',
    UPDATE_CALIFICACION: 'technician.calificacion.update',
    FIND_CALIFICACIONES_BY_TECNICO: 'technician.calificacion.findByTecnico',
    UPDATE_PROMEDIO_CALIFICACIONES: 'technician.calificacion.updatePromedio',
} as const;

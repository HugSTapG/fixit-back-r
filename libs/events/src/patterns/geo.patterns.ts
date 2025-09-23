export const GEO_PATTERNS = {
    // Provincias
    GET_PROVINCIAS: 'geo.provincias.findAll',
    GET_PROVINCIA: 'geo.provincias.findOne',
    CREATE_PROVINCIA: 'geo.provincias.create',
    UPDATE_PROVINCIA: 'geo.provincias.update',
    DELETE_PROVINCIA: 'geo.provincias.delete',

    // Cantones
    GET_CANTONES: 'geo.cantones.findAll',
    GET_CANTON: 'geo.cantones.findOne',
    GET_CANTONES_BY_PROVINCIA: 'geo.cantones.findByProvincia',
    CREATE_CANTON: 'geo.cantones.create',
    UPDATE_CANTON: 'geo.cantones.update',
    DELETE_CANTON: 'geo.cantones.delete',

    // Parroquias
    GET_PARROQUIAS: 'geo.parroquias.findAll',
    GET_PARROQUIA: 'geo.parroquias.findOne',
    GET_PARROQUIAS_BY_CANTON: 'geo.parroquias.findByCanton',
    CREATE_PARROQUIA: 'geo.parroquias.create',
    UPDATE_PARROQUIA: 'geo.parroquias.update',
    DELETE_PARROQUIA: 'geo.parroquias.delete',

    // Ubicaciones
    GET_UBICACIONES: 'geo.ubicaciones.findAll',
    GET_UBICACION: 'geo.ubicaciones.findOne',
    GET_UBICACIONES_BY_PARROQUIA: 'geo.ubicaciones.findByParroquia',
    CREATE_UBICACION: 'geo.ubicaciones.create',
    UPDATE_UBICACION: 'geo.ubicaciones.update',
    DELETE_UBICACION: 'geo.ubicaciones.delete',
} as const;

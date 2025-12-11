export interface Certificacion {
    idCertificacion: number;
    nombreCertificacion: string;
    entidadCertificacion: string;
    descripcionCertificacion?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CertificacionWithTecnicos extends Certificacion {
    tecnicosCertificaciones?: any[];
    _count?: {
        tecnicosCertificaciones: number;
    };
}

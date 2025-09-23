export interface Tecnico {
    idTecnico: number;
    idUser: number;
    totalCalificaciones: number;
    promedioCalificaciones?: number;
    isActive: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: number;
    updatedBy?: number;
}

export interface TecnicoWithDetails extends Tecnico {
    usuario?: {
        nombres: string;
        apellidos: string;
        email: string;
        telefono?: string;
        ubicacion?: any;
    };
    certificaciones?: any[];
    parroquias?: any[];
    servicios?: any[];
    calificaciones?: any[];
    _count?: {
        solicitudesTecnico: number;
        calificaciones: number;
    };
}

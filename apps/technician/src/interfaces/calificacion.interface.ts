import { PuntajeCalificacion } from '@app/shared';

export interface Calificacion {
    idCalificacion: number;
    idSolicitud: number;
    idTecnico: number;
    puntaje: PuntajeCalificacion;
    comentario?: string;
    fechaCalificacion: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CalificacionWithDetails extends Calificacion {
    tecnico?: {
        usuario?: {
            nombres: string;
            apellidos: string;
        };
    };
    solicitud?: {
        tituloProblema: string;
    };
}
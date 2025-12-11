import { Calificacion as PrismaCalificacion } from '../prismaClientTechnician/generated';
import { Calificacion } from '../interfaces/calificacion.interface';
import { PuntajeCalificacion } from '@app/shared';

export class CalificacionMapper {
    static toInterface(prismaCalificacion: PrismaCalificacion): Calificacion {
        return {
            idCalificacion: prismaCalificacion.idCalificacion,
            idSolicitud: prismaCalificacion.idSolicitud,
            idTecnico: prismaCalificacion.idTecnico,
            puntaje: prismaCalificacion.puntaje as PuntajeCalificacion,
            comentario: prismaCalificacion.comentario || undefined,
            fechaCalificacion: prismaCalificacion.fechaCalificacion,
            createdAt: prismaCalificacion.createdAt,
            updatedAt: prismaCalificacion.updatedAt,
        };
    }

    static toPrismaCreateData(data: any) {
        return {
            idSolicitud: data.idSolicitud,
            idTecnico: data.idTecnico,
            puntaje: data.puntaje,
            comentario: data.comentario || null,
        };
    }

    static toPrismaUpdateData(data: any) {
        const updateData: any = {};

        if (data.puntaje !== undefined) {
            updateData.puntaje = data.puntaje;
        }

        if (data.comentario !== undefined) {
            updateData.comentario = data.comentario;
        }

        return updateData;
    }
}

import { Tecnico as PrismaTecnico } from '../prismaClientTechnician/generated';
import { Tecnico } from '../interfaces/tecnico.interface';

export class TecnicoMapper {
    static toInterface(prismaTecnico: PrismaTecnico): Tecnico {
        return {
            idTecnico: prismaTecnico.idTecnico,
            idUser: prismaTecnico.idUser,
            totalCalificaciones: prismaTecnico.totalCalificaciones,
            promedioCalificaciones: prismaTecnico.promedioCalificaciones ? Number(prismaTecnico.promedioCalificaciones) : undefined,
            isActive: prismaTecnico.isActive,
            deletedAt: prismaTecnico.deletedAt || undefined,
            createdAt: prismaTecnico.createdAt,
            updatedAt: prismaTecnico.updatedAt,
            createdBy: prismaTecnico.createdBy || undefined,
            updatedBy: prismaTecnico.updatedBy || undefined,
        };
    }

    static toPrismaCreateData(data: any) {
        return {
            idUser: data.idUser,
            isActive: data.isActive !== undefined ? data.isActive : true,
            createdBy: data.createdBy || null,
        };
    }

    static toPrismaUpdateData(data: any) {
        const updateData: any = {};

        if (data.totalCalificaciones !== undefined) {
            updateData.totalCalificaciones = data.totalCalificaciones;
        }

        if (data.promedioCalificaciones !== undefined) {
            updateData.promedioCalificaciones = data.promedioCalificaciones;
        }

        if (data.isActive !== undefined) {
            updateData.isActive = data.isActive;
        }

        if (data.deletedAt !== undefined) {
            updateData.deletedAt = data.deletedAt;
        }

        if (data.updatedBy !== undefined) {
            updateData.updatedBy = data.updatedBy;
        }

        return updateData;
    }
}

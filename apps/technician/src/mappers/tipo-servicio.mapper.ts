import { TipoServicio as PrismaTipoServicio } from '../prismaClientTechnician/generated';
import { TipoServicio } from '../interfaces/tipo-servicio.interface';
import { SubServicio } from '@app/shared';

export class TipoServicioMapper {
    static toInterface(prismaTipoServicio: PrismaTipoServicio): TipoServicio {
        return {
            idTipoServicio: prismaTipoServicio.idTipoServicio,
            nombreServicio: prismaTipoServicio.nombreServicio,
            descripcionServicio: prismaTipoServicio.descripcionServicio,
            subServicio: prismaTipoServicio.subServicio as SubServicio,
            createdAt: prismaTipoServicio.createdAt,
            updatedAt: prismaTipoServicio.updatedAt,
        };
    }

    static toPrismaCreateData(data: any) {
        return {
            nombreServicio: data.nombreServicio,
            descripcionServicio: data.descripcionServicio,
            subServicio: data.subServicio,
        };
    }

    static toPrismaUpdateData(data: any) {
        const updateData: any = {};

        if (data.nombreServicio !== undefined) {
            updateData.nombreServicio = data.nombreServicio;
        }

        if (data.descripcionServicio !== undefined) {
            updateData.descripcionServicio = data.descripcionServicio;
        }

        if (data.subServicio !== undefined) {
            updateData.subServicio = data.subServicio;
        }

        return updateData;
    }
}

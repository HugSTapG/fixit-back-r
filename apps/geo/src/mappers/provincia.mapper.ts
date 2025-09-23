import { Provincia as PrismaProvincia } from '../prismaClientGeo/generated';
import { Provincia } from '../interfaces/provincia.interface';

export class ProvinciaMapper {
    static toInterface(prismaProvincia: PrismaProvincia & { cantones?: any[], _count?: any }): Provincia {
        return {
            codigoProvincia: prismaProvincia.codigoProvincia,
            nombreProvincia: prismaProvincia.nombreProvincia,
            createdAt: prismaProvincia.createdAt,
            updatedAt: prismaProvincia.updatedAt,
            cantones: prismaProvincia.cantones || undefined,
            _count: prismaProvincia._count || undefined,
        };
    }

    static toPrismaCreateData(data: any) {
        return {
            codigoProvincia: data.codigoProvincia,
            nombreProvincia: data.nombreProvincia,
        };
    }

    static toPrismaUpdateData(data: any) {
        const updateData: any = {};

        if (data.nombreProvincia !== undefined) {
            updateData.nombreProvincia = data.nombreProvincia;
        }

        return updateData;
    }
}

import { Canton as PrismaCanton } from '../prismaClientGeo/generated';
import { Canton } from '../interfaces/canton.interface';

export class CantonMapper {
    static toInterface(prismaCanton: PrismaCanton & { provincia?: any, parroquias?: any[], _count?: any }): Canton {
        return {
            codigoCanton: prismaCanton.codigoCanton,
            codigoProvincia: prismaCanton.codigoProvincia,
            nombreCanton: prismaCanton.nombreCanton,
            createdAt: prismaCanton.createdAt,
            updatedAt: prismaCanton.updatedAt,
            provincia: prismaCanton.provincia || undefined,
            parroquias: prismaCanton.parroquias || undefined,
            _count: prismaCanton._count || undefined,
        };
    }

    static toPrismaCreateData(data: any) {
        return {
            codigoCanton: data.codigoCanton,
            codigoProvincia: data.codigoProvincia,
            nombreCanton: data.nombreCanton,
        };
    }

    static toPrismaUpdateData(data: any) {
        const updateData: any = {};

        if (data.codigoProvincia !== undefined) {
            updateData.codigoProvincia = data.codigoProvincia;
        }

        if (data.nombreCanton !== undefined) {
            updateData.nombreCanton = data.nombreCanton;
        }

        return updateData;
    }
}

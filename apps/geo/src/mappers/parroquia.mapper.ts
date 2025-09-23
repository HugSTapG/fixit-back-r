import { Parroquia as PrismaParroquia } from '../prismaClientGeo/generated';
import { Parroquia } from '../interfaces/parroquia.interface';

export class ParroquiaMapper {
    static toInterface(prismaParroquia: PrismaParroquia & { canton?: any, ubicaciones?: any[], _count?: any }): Parroquia {
        return {
            codigoParroquia: prismaParroquia.codigoParroquia,
            codigoCanton: prismaParroquia.codigoCanton,
            nombreParroquia: prismaParroquia.nombreParroquia,
            createdAt: prismaParroquia.createdAt,
            updatedAt: prismaParroquia.updatedAt,
            canton: prismaParroquia.canton || undefined,
            ubicaciones: prismaParroquia.ubicaciones || undefined,
            _count: prismaParroquia._count || undefined,
        };
    }

    static toPrismaCreateData(data: any) {
        return {
            codigoParroquia: data.codigoParroquia,
            codigoCanton: data.codigoCanton,
            nombreParroquia: data.nombreParroquia,
        };
    }

    static toPrismaUpdateData(data: any) {
        const updateData: any = {};
        
        if (data.codigoCanton !== undefined) {
            updateData.codigoCanton = data.codigoCanton;
        }
        
        if (data.nombreParroquia !== undefined) {
            updateData.nombreParroquia = data.nombreParroquia;
        }

        return updateData;
    }
}
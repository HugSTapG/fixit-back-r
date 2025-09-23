import { Ubicacion as PrismaUbicacion } from '../prismaClientGeo/generated';
import { Ubicacion, UbicacionGeometry } from '../interfaces/ubicacion.interface';

export class UbicacionMapper {
    static toInterface(prismaUbicacion: PrismaUbicacion & { parroquia?: any, ubicacion?: any, distanceMeters?: number }): Ubicacion {
        return {
            idUbicacion: prismaUbicacion.idUbicacion,
            codigoParroquia: prismaUbicacion.codigoParroquia,
            nombreUbicacion: prismaUbicacion.nombreUbicacion,
            descripcionUbicacion: prismaUbicacion.descripcionUbicacion,
            ubicacion: prismaUbicacion.ubicacion || undefined,
            createdAt: prismaUbicacion.createdAt,
            updatedAt: prismaUbicacion.updatedAt,
            parroquia: prismaUbicacion.parroquia || undefined,
            distanceMeters: prismaUbicacion.distanceMeters || undefined,
        };
    }

    static toPrismaCreateData(data: any) {
        return {
            codigoParroquia: data.codigoParroquia,
            nombreUbicacion: data.nombreUbicacion,
            descripcionUbicacion: data.descripcionUbicacion,
        };
    }

    static toPrismaUpdateData(data: any) {
        const updateData: any = {};

        if (data.codigoParroquia !== undefined) {
            updateData.codigoParroquia = data.codigoParroquia;
        }

        if (data.nombreUbicacion !== undefined) {
            updateData.nombreUbicacion = data.nombreUbicacion;
        }

        if (data.descripcionUbicacion !== undefined) {
            updateData.descripcionUbicacion = data.descripcionUbicacion;
        }

        return updateData;
    }

    static coordinatesToGeometry(coordinates: [number, number]): UbicacionGeometry {
        return {
            type: 'Point',
            coordinates
        };
    }
}

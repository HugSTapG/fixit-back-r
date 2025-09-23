import { Certificacion as PrismaCertificacion } from '../prismaClientTechnician/generated';
import { Certificacion } from '../interfaces/certificacion.interface';

export class CertificacionMapper {
    static toInterface(prismaCertificacion: PrismaCertificacion): Certificacion {
        return {
            idCertificacion: prismaCertificacion.idCertificacion,
            nombreCertificacion: prismaCertificacion.nombreCertificacion,
            entidadCertificacion: prismaCertificacion.entidadCertificacion,
            descripcionCertificacion: prismaCertificacion.descripcionCertificacion || undefined,
            createdAt: prismaCertificacion.createdAt,
            updatedAt: prismaCertificacion.updatedAt,
        };
    }

    static toPrismaCreateData(data: any) {
        return {
            nombreCertificacion: data.nombreCertificacion,
            entidadCertificacion: data.entidadCertificacion,
            descripcionCertificacion: data.descripcionCertificacion || null,
        };
    }

    static toPrismaUpdateData(data: any) {
        const updateData: any = {};

        if (data.nombreCertificacion !== undefined) {
            updateData.nombreCertificacion = data.nombreCertificacion;
        }

        if (data.entidadCertificacion !== undefined) {
            updateData.entidadCertificacion = data.entidadCertificacion;
        }

        if (data.descripcionCertificacion !== undefined) {
            updateData.descripcionCertificacion = data.descripcionCertificacion;
        }

        return updateData;
    }
}

import { SesionUsuario as PrismaSesion } from '../prismaClientAuth/generated';
import { SesionUsuario } from '../interfaces/sesion.interface';

export class SesionMapper {
    static toInterface(prismaSesion: PrismaSesion): SesionUsuario {
        return {
            idSesion: prismaSesion.idSesion,
            idUser: prismaSesion.idUser,
            token: prismaSesion.token,
            accessToken: prismaSesion.accessToken || undefined,
            refreshToken: prismaSesion.refreshToken || undefined,
            fechaCreacion: prismaSesion.fechaCreacion,
            fechaExpiracion: prismaSesion.fechaExpiracion,
            expiresAt: prismaSesion.expiresAt || undefined,
            refreshExpiresAt: prismaSesion.refreshExpiresAt || undefined,
            activa: prismaSesion.activa,
            isActive: prismaSesion.isActive,
            ipAddress: prismaSesion.ipAddress || undefined,
            userAgent: prismaSesion.userAgent || undefined,
        };
    }

    static toPrismaCreateData(data: any) {
        return {
            idUser: data.idUser,
            token: data.token || data.accessToken, // Si no hay token, usar accessToken
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            fechaCreacion: data.fechaCreacion || new Date(),
            fechaExpiracion: data.fechaExpiracion || data.expiresAt,
            expiresAt: data.expiresAt,
            refreshExpiresAt: data.refreshExpiresAt,
            activa: data.activa !== undefined ? data.activa : true,
            isActive: data.isActive !== undefined ? data.isActive : true,
            ipAddress: data.ipAddress || null,
            userAgent: data.userAgent || null,
        };
    }
}

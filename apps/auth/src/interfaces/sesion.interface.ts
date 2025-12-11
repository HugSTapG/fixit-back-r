export interface SesionUsuario {
    idSesion: number;
    idUser: number;
    token: string;
    accessToken?: string;
    refreshToken?: string;
    fechaCreacion: Date;
    fechaExpiracion: Date;
    expiresAt?: Date;
    refreshExpiresAt?: Date;
    activa: boolean;
    isActive: boolean;
    ipAddress?: string;
    userAgent?: string;
}

export interface CreateSesionData {
    idUser: number;
    token: string;
    accessToken: string;
    refreshToken: string;
    fechaExpiracion: Date;
    expiresAt: Date;
    refreshExpiresAt: Date;
    isActive: boolean;
    activa: boolean;
    ipAddress?: string;
    userAgent?: string;
}

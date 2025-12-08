import { RolUsuario } from '@app/shared';

export class AuthResponseDto {
    access_token: string;
    refresh_token: string;
    user: {
        idUser: number;
        cedula: string;
        nombres: string;
        apellidos: string;
        email: string;
        rol: RolUsuario;
        createdAt: string;
    };
}

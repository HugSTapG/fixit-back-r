import { Usuario as PrismaUsuario } from '../prismaClientAuth/generated';
import { Usuario, UsuarioSinPassword } from '../interfaces/usuario.interface';
import { RolUsuario } from '@app/shared';

export class UsuarioMapper {
    static toInterface(prismaUsuario: PrismaUsuario): Usuario {
        return {
            idUser: prismaUsuario.idUser,
            cedula: prismaUsuario.cedula,
            nombres: prismaUsuario.nombres,
            apellidos: prismaUsuario.apellidos,
            email: prismaUsuario.email,
            password: prismaUsuario.password,
            passwordHash: prismaUsuario.passwordHash || undefined,
            telefono: prismaUsuario.telefono || undefined,
            direccion: prismaUsuario.direccion || undefined,
            fechaNacimiento: prismaUsuario.fechaNacimiento || undefined,
            rol: prismaUsuario.rol as RolUsuario,
            emailVerificado: prismaUsuario.emailVerificado,
            activo: prismaUsuario.activo,
            isActive: prismaUsuario.isActive,
            deletedAt: prismaUsuario.deletedAt || undefined,
            createdAt: prismaUsuario.createdAt,
            updatedAt: prismaUsuario.updatedAt,
        };
    }

    static toInterfaceSinPassword(prismaUsuario: PrismaUsuario): UsuarioSinPassword {
        const usuario = this.toInterface(prismaUsuario);
        const { password, passwordHash, ...usuarioSinPassword } = usuario;
        return usuarioSinPassword;
    }

    static toPrismaCreateData(data: any) {
        return {
            cedula: data.cedula,
            nombres: data.nombres,
            apellidos: data.apellidos,
            email: data.email,
            password: data.password || '', // Campo requerido por Prisma
            passwordHash: data.passwordHash,
            telefono: data.telefono || null,
            rol: data.rol,
            isActive: data.isActive !== undefined ? data.isActive : true,
            activo: data.activo !== undefined ? data.activo : true,
            emailVerificado: data.emailVerificado !== undefined ? data.emailVerificado : false,
        };
    }
}

import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { KafkaService } from '@app/events';
import { CreateUsuarioDto, UpdateUsuarioDto, SwitchRoleDto } from '../dto';
import { UsuarioSinPassword } from '../interfaces';
import { UsuarioMapper } from '../mappers';
import { RolUsuario } from '@app/shared';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
    constructor(
        private readonly database: DatabaseService,
        private readonly kafkaService: KafkaService,
    ) { }

    async findById(idUser: number): Promise<UsuarioSinPassword | null> {
        const user = await this.database.usuario.findUnique({
            where: {
                idUser,
                isActive: true,
            },
        });

        if (!user) return null;

        return UsuarioMapper.toInterfaceSinPassword(user);
    }

    async findByCedula(cedula: string): Promise<UsuarioSinPassword | null> {
        const user = await this.database.usuario.findUnique({
            where: {
                cedula,
                isActive: true,
            },
        });

        if (!user) return null;

        return UsuarioMapper.toInterfaceSinPassword(user);
    }

    async findByEmail(email: string): Promise<UsuarioSinPassword | null> {
        const user = await this.database.usuario.findUnique({
            where: {
                email,
                isActive: true,
            },
        });

        if (!user) return null;

        return UsuarioMapper.toInterfaceSinPassword(user);
    }

    async create(createUsuarioDto: CreateUsuarioDto): Promise<UsuarioSinPassword> {
        // Verificar si el usuario ya existe
        const validacionCedula = this.validarCedulaEcuatoriana(createUsuarioDto.cedula);
        if (!validacionCedula.esValida) {
            throw new BadRequestException(validacionCedula.mensaje);
        }
        const existingUserByCedula = await this.database.usuario.findUnique({
            where: { cedula: createUsuarioDto.cedula },
        });

        if (existingUserByCedula) {
            throw new ConflictException('Ya existe un usuario con esta cédula');
        }

        const existingUserByEmail = await this.database.usuario.findUnique({
            where: { email: createUsuarioDto.email },
        });

        if (existingUserByEmail) {
            throw new ConflictException('Ya existe un usuario con este email');
        }

        // Hash del password
        const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 12);

        // Crear usuario usando el mapper
        const createData = UsuarioMapper.toPrismaCreateData({
            ...createUsuarioDto,
            passwordHash: hashedPassword,
        });

        const user = await this.database.usuario.create({
            data: createData,
        });

        // Emitir evento
        await this.kafkaService.publishEvent('user.created', {
            userId: user.idUser,
            email: user.email,
            rol: user.rol,
            cedula: user.cedula,
        });

        return UsuarioMapper.toInterfaceSinPassword(user);
    }

    async update(idUser: number, updateUsuarioDto: UpdateUsuarioDto): Promise<UsuarioSinPassword> {
        // Verificar que el usuario existe
        const existingUser = await this.database.usuario.findUnique({
            where: { idUser, isActive: true },
        });

        if (!existingUser) {
            throw new NotFoundException('Usuario no encontrado');
        }

        // Verificar email único si se actualiza
        if (updateUsuarioDto.email) {
            const userWithEmail = await this.database.usuario.findUnique({
                where: { email: updateUsuarioDto.email },
            });

            if (userWithEmail && userWithEmail.idUser !== idUser) {
                throw new ConflictException('Ya existe un usuario con este email');
            }
        }

        // Preparar datos de actualización
        const updateData: any = {};
        if (updateUsuarioDto.nombres) updateData.nombres = updateUsuarioDto.nombres;
        if (updateUsuarioDto.apellidos) updateData.apellidos = updateUsuarioDto.apellidos;
        if (updateUsuarioDto.email) updateData.email = updateUsuarioDto.email;
        if (updateUsuarioDto.telefono !== undefined) updateData.telefono = updateUsuarioDto.telefono;

        const updatedUser = await this.database.usuario.update({
            where: { idUser },
            data: updateData,
        });

        // Emitir evento
        await this.kafkaService.publishEvent('user.updated', {
            userId: idUser,
            changes: updateUsuarioDto,
        });

        return UsuarioMapper.toInterfaceSinPassword(updatedUser);
    }

    async validatePassword(email: string, password: string): Promise<UsuarioSinPassword | null> {
        const user = await this.database.usuario.findUnique({
            where: { email, isActive: true },
        });

        if (!user) {
            return null;
        }

        // Usar passwordHash para validar, fallback a password si no hay hash
        const passwordToCheck = user.passwordHash || user.password;

        if (!passwordToCheck) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, passwordToCheck);

        if (!isPasswordValid) {
            return null;
        }

        return UsuarioMapper.toInterfaceSinPassword(user);
    }

    async findAll(): Promise<UsuarioSinPassword[]> {
        const users = await this.database.usuario.findMany({
            where: { isActive: true },
            select: {
                idUser: true,
                cedula: true,
                nombres: true,
                apellidos: true,
                email: true,
                telefono: true,
                direccion: true,
                fechaNacimiento: true,
                rol: true,
                emailVerificado: true,
                activo: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
            },
        });

        return users.map(user => ({
            idUser: user.idUser,
            cedula: user.cedula,
            nombres: user.nombres,
            apellidos: user.apellidos,
            email: user.email,
            telefono: user.telefono || undefined,
            direccion: user.direccion || undefined,
            fechaNacimiento: user.fechaNacimiento || undefined,
            rol: user.rol as RolUsuario,
            emailVerificado: user.emailVerificado,
            activo: user.activo,
            isActive: user.isActive,
            deletedAt: user.deletedAt || undefined,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
    }

    async verifyEmail(idUser: number): Promise<UsuarioSinPassword> {
        const updatedUser = await this.database.usuario.update({
            where: { idUser },
            data: { emailVerificado: true },
        });

        return UsuarioMapper.toInterfaceSinPassword(updatedUser);
    }

    async deactivate(idUser: number): Promise<UsuarioSinPassword> {
        const updatedUser = await this.database.usuario.update({
            where: { idUser },
            data: {
                isActive: false,
                activo: false,
                deletedAt: new Date(),
            },
        });

        // Emitir evento
        await this.kafkaService.publishEvent('user.deactivated', {
            userId: idUser,
            deactivatedBy: idUser,
        });

        return UsuarioMapper.toInterfaceSinPassword(updatedUser);
    }

    async switchRole(userId: number, switchRoleDto: SwitchRoleDto): Promise<UsuarioSinPassword> {
        const existingUser = await this.database.usuario.findUnique({
            where: { idUser: userId },
        });

        if (!existingUser) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const updatedUser = await this.database.usuario.update({
            where: { idUser: userId },
            data: { rol: switchRoleDto.nuevoRol },
        });

        // Emitir evento
        await this.kafkaService.publishEvent('user.role_switched', {
            userId,
            oldRole: existingUser.rol,
            newRole: switchRoleDto.nuevoRol,
        });

        return UsuarioMapper.toInterfaceSinPassword(updatedUser);
    }

    private validarCedulaEcuatoriana(cedula: string): { esValida: boolean; mensaje: string } {
        // Verificar que tenga 10 dígitos
        if (!/^\d{10}$/.test(cedula)) {
            return { esValida: false, mensaje: 'Cédula debe tener exactamente 10 dígitos' };
        }

        const digitos = cedula.split('').map(Number);
        const provincia = parseInt(cedula.substring(0, 2));

        // Verificar código de provincia (01-24)
        if (provincia < 1 || provincia > 24) {
            return { esValida: false, mensaje: 'Código de provincia inválido' };
        }

        // Algoritmo de verificación módulo 10
        const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        let suma = 0;

        for (let i = 0; i < 9; i++) {
            let resultado = digitos[i] * coeficientes[i];
            if (resultado >= 10) {
                resultado = Math.floor(resultado / 10) + (resultado % 10);
            }
            suma += resultado;
        }

        const digitoVerificador = digitos[9];
        const residuo = suma % 10;
        const digitoCalculado = residuo === 0 ? 0 : 10 - residuo;

        const esValida = digitoVerificador === digitoCalculado;
        return {
            esValida,
            mensaje: esValida ? 'Cédula válida' : 'Cédula inválida'
        };
    }
}

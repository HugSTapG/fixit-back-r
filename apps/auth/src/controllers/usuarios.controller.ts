import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsuariosService } from '../services/usuarios.service';
import { CreateUsuarioDto, UpdateUsuarioDto, SwitchRoleDto } from '../dto';
import { AUTH_PATTERNS } from '@app/events';

@Controller()
export class UsuariosController {
    private readonly logger = new Logger(UsuariosController.name);

    constructor(private readonly usuariosService: UsuariosService) { }

    @MessagePattern(AUTH_PATTERNS.FIND_USER_BY_ID)
    async findById(@Payload() data: { id: number }) {
        try {
            this.logger.log(`Finding user by ID: ${data.id}`);
            const user = await this.usuariosService.findById(data.id);

            if (!user) {
                return {
                    success: false,
                    error: 'Usuario no encontrado',
                    statusCode: 404
                };
            }

            return { success: true, data: user };
        } catch (error) {
            this.logger.error(`Error finding user by ID: ${data.id}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(AUTH_PATTERNS.FIND_USER_BY_CEDULA)
    async findByCedula(@Payload() data: { cedula: string }) {
        try {
            this.logger.log(`Finding user by cedula: ${data.cedula}`);
            const user = await this.usuariosService.findByCedula(data.cedula);

            if (!user) {
                return {
                    success: false,
                    error: 'Usuario no encontrado',
                    statusCode: 404
                };
            }

            return { success: true, data: user };
        } catch (error) {
            this.logger.error(`Error finding user by cedula: ${data.cedula}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(AUTH_PATTERNS.FIND_USER_BY_EMAIL)
    async findByEmail(@Payload() data: { email: string }) {
        try {
            this.logger.log(`Finding user by email: ${data.email}`);
            const user = await this.usuariosService.findByEmail(data.email);

            if (!user) {
                return {
                    success: false,
                    error: 'Usuario no encontrado',
                    statusCode: 404
                };
            }

            return { success: true, data: user };
        } catch (error) {
            this.logger.error(`Error finding user by email: ${data.email}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(AUTH_PATTERNS.CREATE_USER)
    async create(@Payload() createUsuarioDto: CreateUsuarioDto) {
        try {
            this.logger.log(`Creating user with email: ${createUsuarioDto.email}`);
            const user = await this.usuariosService.create(createUsuarioDto);
            return { success: true, data: user };
        } catch (error) {
            this.logger.error(`Error creating user: ${createUsuarioDto.email}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(AUTH_PATTERNS.UPDATE_USER)
    async update(@Payload() data: { id: number } & UpdateUsuarioDto) {
        try {
            const { id, ...updateData } = data;
            this.logger.log(`Updating user: ${id}`);
            const user = await this.usuariosService.update(id, updateData);
            return { success: true, data: user };
        } catch (error) {
            this.logger.error(`Error updating user: ${data.id}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(AUTH_PATTERNS.FIND_ALL_USERS)
    async findAll() {
        try {
            this.logger.log('Finding all users');
            const users = await this.usuariosService.findAll();
            return { success: true, data: users };
        } catch (error) {
            this.logger.error('Error finding all users', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(AUTH_PATTERNS.VERIFY_EMAIL)
    async verifyEmail(@Payload() data: { id: number }) {
        try {
            this.logger.log(`Verifying email for user: ${data.id}`);
            const user = await this.usuariosService.verifyEmail(data.id);
            return { success: true, data: user };
        } catch (error) {
            this.logger.error(`Error verifying email for user: ${data.id}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(AUTH_PATTERNS.DEACTIVATE_USER)
    async deactivate(@Payload() data: { id: number }) {
        try {
            this.logger.log(`Deactivating user: ${data.id}`);
            const user = await this.usuariosService.deactivate(data.id);
            return { success: true, data: user };
        } catch (error) {
            this.logger.error(`Error deactivating user: ${data.id}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(AUTH_PATTERNS.SWITCH_ROLE)
    async switchRole(@Payload() data: { userId: number } & SwitchRoleDto) {
        try {
            const { userId, ...switchRoleData } = data;
            this.logger.log(`Switching role for user: ${userId}`);
            const user = await this.usuariosService.switchRole(userId, switchRoleData);
            return { success: true, data: user };
        } catch (error) {
            this.logger.error(`Error switching role for user: ${data.userId}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }
}

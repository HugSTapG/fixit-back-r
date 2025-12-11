import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
    Logger,
    Inject
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { DatabaseService } from '../database/database.service';
import {
    CreateTokenNotificacionDto,
    UpdateTokenNotificacionDto
} from '../dto/index';
import { RolUsuario } from '@app/shared';
import { AUTH_PATTERNS } from '@app/events';

/**
 * Servicio para la gestión de tokens de notificaciones push en microservicio
 */
@Injectable()
export class TokensNotificacionesService {
    private readonly logger = new Logger(TokensNotificacionesService.name);

    constructor(
        private readonly prisma: DatabaseService,
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    ) { }

    /**
     * Verifica si un usuario existe en el microservicio Auth
     */
    private async getUserFromAuthService(idUser: number) {
        try {
            this.logger.log(`Verifying user ${idUser} with Auth service`);

            const response = await firstValueFrom(
                this.authClient.send(AUTH_PATTERNS.FIND_USER_BY_ID, { id: idUser })
            );

            if (!response.success) {
                throw new NotFoundException(`Usuario con ID ${idUser} no encontrado`);
            }

            return response.data;
        } catch (error) {
            this.logger.error(`Error communicating with Auth service for user ${idUser}`, error);

            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new BadRequestException('Error al verificar el usuario');
        }
    }

    /**
     * Obtiene todos los tokens de notificación (solo admin)
     */
    async findAll() {
        this.logger.log('Finding all notification tokens');

        try {
            return this.prisma.tokenNotificacion.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } catch (error) {
            this.logger.error('Error finding all notification tokens', error.stack);
            throw new BadRequestException('Error al obtener los tokens de notificación');
        }
    }

    /**
     * Busca un token por ID
     */
    async findOne(idTokenNotificacion: number) {
        this.logger.log(`Finding notification token: ${idTokenNotificacion}`);

        try {
            const token = await this.prisma.tokenNotificacion.findUnique({
                where: { idTokenNotificacion }
            });

            if (!token) {
                throw new NotFoundException(`Token con ID ${idTokenNotificacion} no encontrado`);
            }

            return token;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error finding notification token ${idTokenNotificacion}`, error.stack);
            throw new BadRequestException('Error al obtener el token de notificación');
        }
    }

    /**
     * Registra un nuevo token de notificación
     */
    async create(
        createTokenDto: CreateTokenNotificacionDto,
        idUser: number
    ) {
        this.logger.log(`Creating notification token for user: ${idUser}`);

        const { tokenDispositivo, plataforma, expiresAt, estadoDispositivo = true } = createTokenDto;

        try {
            // Verificar que el usuario existe en Auth Service
            await this.getUserFromAuthService(idUser);

            // Verificar si ya existe este token para este usuario
            const tokenExistente = await this.prisma.tokenNotificacion.findUnique({
                where: {
                    idUser_tokenDispositivo: {
                        idUser,
                        tokenDispositivo
                    }
                }
            });

            if (tokenExistente) {
                // Si existe, actualizamos la fecha de expiración y estado
                this.logger.log(`Updating existing token for user: ${idUser}`);

                return this.prisma.tokenNotificacion.update({
                    where: { idTokenNotificacion: tokenExistente.idTokenNotificacion },
                    data: {
                        plataforma,
                        estadoDispositivo,
                        expiresAt: new Date(expiresAt)
                    }
                });
            }

            // Crear nuevo token
            const token = await this.prisma.tokenNotificacion.create({
                data: {
                    idUser,
                    tokenDispositivo,
                    plataforma,
                    estadoDispositivo,
                    expiresAt: new Date(expiresAt)
                }
            });

            this.logger.log(`Notification token created successfully: ${token.idTokenNotificacion}`);

            return token;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`Error creating notification token for user ${idUser}`, error.stack);
            throw new BadRequestException('Error al crear el token de notificación');
        }
    }

    /**
     * Actualiza un token existente
     */
    async update(
        idTokenNotificacion: number,
        updateTokenDto: UpdateTokenNotificacionDto,
        currentUser: { idUser: number; rol: string }
    ) {
        this.logger.log(`Updating notification token: ${idTokenNotificacion}`);

        try {
            const token = await this.findOne(idTokenNotificacion);

            // Solo el propietario o admin pueden actualizar
            if (currentUser.rol !== RolUsuario.ADMIN && token.idUser !== currentUser.idUser) {
                throw new ForbiddenException('No tienes permisos para actualizar este token');
            }

            const { expiresAt, ...restData } = updateTokenDto;
            const updateData: any = { ...restData };

            if (expiresAt) {
                updateData.expiresAt = new Date(expiresAt);
            }

            const tokenActualizado = await this.prisma.tokenNotificacion.update({
                where: { idTokenNotificacion },
                data: updateData
            });

            this.logger.log(`Notification token updated successfully: ${idTokenNotificacion}`);

            return tokenActualizado;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                throw error;
            }
            this.logger.error(`Error updating notification token ${idTokenNotificacion}`, error.stack);
            throw new BadRequestException('Error al actualizar el token de notificación');
        }
    }

    /**
     * Elimina un token de notificación
     */
    async remove(
        idTokenNotificacion: number,
        currentUser: { idUser: number; rol: string }
    ) {
        this.logger.log(`Removing notification token: ${idTokenNotificacion}`);

        try {
            const token = await this.findOne(idTokenNotificacion);

            // Solo el propietario o admin pueden eliminar
            if (currentUser.rol !== RolUsuario.ADMIN && token.idUser !== currentUser.idUser) {
                throw new ForbiddenException('No tienes permisos para eliminar este token');
            }

            const removedToken = await this.prisma.tokenNotificacion.delete({
                where: { idTokenNotificacion }
            });

            this.logger.log(`Notification token removed successfully: ${idTokenNotificacion}`);

            return removedToken;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                throw error;
            }
            this.logger.error(`Error removing notification token ${idTokenNotificacion}`, error.stack);
            throw new BadRequestException('Error al eliminar el token de notificación');
        }
    }

    /**
     * Obtiene tokens activos de un usuario
     */
    async findActiveTokensByUser(idUser: number) {
        this.logger.log(`Finding active tokens for user: ${idUser}`);

        try {
            // Verificar que el usuario existe
            await this.getUserFromAuthService(idUser);

            return this.prisma.tokenNotificacion.findMany({
                where: {
                    idUser,
                    estadoDispositivo: true,
                    expiresAt: {
                        gt: new Date()
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error finding active tokens for user ${idUser}`, error.stack);
            throw new BadRequestException('Error al obtener los tokens activos del usuario');
        }
    }

    /**
     * Desactiva un token específico
     */
    async deactivateToken(
        tokenDispositivo: string,
        idUser: number
    ) {
        this.logger.log(`Deactivating token for user: ${idUser}`);

        try {
            // Verificar que el usuario existe
            await this.getUserFromAuthService(idUser);

            const token = await this.prisma.tokenNotificacion.findUnique({
                where: {
                    idUser_tokenDispositivo: {
                        idUser,
                        tokenDispositivo
                    }
                }
            });

            if (!token) {
                throw new NotFoundException('Token no encontrado');
            }

            const deactivatedToken = await this.prisma.tokenNotificacion.update({
                where: { idTokenNotificacion: token.idTokenNotificacion },
                data: { estadoDispositivo: false }
            });

            this.logger.log(`Token deactivated successfully for user: ${idUser}`);

            return deactivatedToken;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error deactivating token for user ${idUser}`, error.stack);
            throw new BadRequestException('Error al desactivar el token');
        }
    }

    /**
     * Limpia tokens expirados
     */
    async cleanupExpiredTokens() {
        this.logger.log('Cleaning up expired tokens');

        try {
            const result = await this.prisma.tokenNotificacion.deleteMany({
                where: {
                    expiresAt: {
                        lt: new Date()
                    }
                }
            });

            this.logger.log(`${result.count} expired tokens cleaned up`);

            return {
                message: `${result.count} tokens expirados eliminados`,
                count: result.count
            };
        } catch (error) {
            this.logger.error('Error cleaning up expired tokens', error.stack);
            throw new BadRequestException('Error al limpiar tokens expirados');
        }
    }

    /**
     * Obtiene estadísticas de tokens
     */
    async getStats() {
        this.logger.log('Getting token statistics');

        try {
            const [
                total,
                activos,
                expirados,
                porPlataforma
            ] = await Promise.all([
                this.prisma.tokenNotificacion.count(),
                this.prisma.tokenNotificacion.count({
                    where: {
                        estadoDispositivo: true,
                        expiresAt: { gt: new Date() }
                    }
                }),
                this.prisma.tokenNotificacion.count({
                    where: {
                        OR: [
                            { estadoDispositivo: false },
                            { expiresAt: { lt: new Date() } }
                        ]
                    }
                }),
                this.prisma.tokenNotificacion.groupBy({
                    by: ['plataforma'],
                    _count: { plataforma: true }
                })
            ]);

            const distribucionPlataformas = porPlataforma.reduce((acc, item) => {
                acc[item.plataforma] = item._count.plataforma;
                return acc;
            }, {} as Record<string, number>);

            return {
                total,
                activos,
                expirados,
                porcentajeActivos: total > 0 ? Number(((activos / total) * 100).toFixed(2)) : 0,
                distribucionPlataformas
            };
        } catch (error) {
            this.logger.error('Error getting token statistics', error.stack);
            throw new BadRequestException('Error al obtener las estadísticas de tokens');
        }
    }
}

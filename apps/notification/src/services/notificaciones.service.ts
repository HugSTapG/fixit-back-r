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
    CreateNotificacionDto,
    UpdateNotificacionDto,
    NotificacionFilterDto
} from '../dto/index';
import { RolUsuario, TipoNotificacion } from '@app/shared';
import { AUTH_PATTERNS } from '@app/events';

/**
 * Servicio para la gestión de notificaciones en microservicio
 */
@Injectable()
export class NotificacionesService {
    private readonly logger = new Logger(NotificacionesService.name);

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
     * Obtiene todas las notificaciones con filtros opcionales
     */
    async findAll(filterDto?: NotificacionFilterDto, currentUser?: { idUser: number; rol: string }) {
        this.logger.log('Finding all notificaciones with filters');

        const {
            tipoNotificacion,
            estadoLectura,
            idUser,
            limit = 20,
            page = 1
        } = filterDto || {};

        const where: any = {};

        // Solo admin puede ver notificaciones de otros usuarios
        if (idUser && currentUser?.rol === RolUsuario.ADMIN) {
            where.idUser = idUser;
        } else if (currentUser) {
            where.idUser = currentUser.idUser;
        }

        // Aplicar filtros
        if (tipoNotificacion) {
            where.tipoNotificacion = tipoNotificacion;
        }

        if (estadoLectura !== undefined) {
            where.estadoLectura = estadoLectura;
        }

        const skip = (page - 1) * limit;

        try {
            const [notificaciones, total] = await Promise.all([
                this.prisma.notificacion.findMany({
                    where,
                    orderBy: {
                        fechaEnvio: 'desc'
                    },
                    take: limit,
                    skip
                }),
                this.prisma.notificacion.count({ where })
            ]);

            return {
                notificaciones,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            this.logger.error('Error finding all notificaciones', error.stack);
            throw new BadRequestException('Error al obtener las notificaciones');
        }
    }

    /**
     * Busca una notificación por su ID
     */
    async findOne(idNotificacion: number, currentUser: { idUser: number; rol: string }) {
        this.logger.log(`Finding notificacion: ${idNotificacion}`);

        try {
            const notificacion = await this.prisma.notificacion.findUnique({
                where: { idNotificacion }
            });

            if (!notificacion) {
                throw new NotFoundException(`Notificación con ID ${idNotificacion} no encontrada`);
            }

            // Verificar permisos - solo el propietario o admin pueden ver la notificación
            if (currentUser.rol !== RolUsuario.ADMIN && notificacion.idUser !== currentUser.idUser) {
                throw new ForbiddenException('No tienes permisos para ver esta notificación');
            }

            return notificacion;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                throw error;
            }
            this.logger.error(`Error finding notificacion ${idNotificacion}`, error.stack);
            throw new BadRequestException('Error al obtener la notificación');
        }
    }

    /**
     * Crea una nueva notificación
     */
    async create(createNotificacionDto: CreateNotificacionDto) {
        this.logger.log(`Creating notificacion for user: ${createNotificacionDto.idUser}`);

        const { idUser, ...notificationData } = createNotificacionDto;

        try {
            // Verificar que el usuario existe en Auth Service
            await this.getUserFromAuthService(idUser);

            const notificacion = await this.prisma.notificacion.create({
                data: {
                    idUser,
                    ...notificationData
                }
            });

            this.logger.log(`Notificacion created successfully: ${notificacion.idNotificacion}`);

            return notificacion;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`Error creating notificacion for user ${idUser}`, error.stack);
            throw new BadRequestException('Error al crear la notificación');
        }
    }

    /**
     * Crea notificación automática para eventos del sistema
     */
    async createSystemNotification(
        idUser: number,
        tipoNotificacion: TipoNotificacion,
        titulo: string,
        mensaje: string
    ) {
        this.logger.log(`Creating system notification for user: ${idUser}, type: ${tipoNotificacion}`);

        return this.create({
            idUser,
            titulo,
            mensaje,
            tipoNotificacion
        });
    }

    /**
     * Actualiza una notificación existente
     */
    async update(
        idNotificacion: number,
        updateNotificacionDto: UpdateNotificacionDto,
        currentUser: { idUser: number; rol: string }
    ) {
        this.logger.log(`Updating notificacion: ${idNotificacion}`);

        try {
            const notificacion = await this.findOne(idNotificacion, currentUser);

            // Solo el propietario o admin pueden actualizar
            if (currentUser.rol !== RolUsuario.ADMIN && notificacion.idUser !== currentUser.idUser) {
                throw new ForbiddenException('No tienes permisos para actualizar esta notificación');
            }

            const notificacionActualizada = await this.prisma.notificacion.update({
                where: { idNotificacion },
                data: updateNotificacionDto
            });

            this.logger.log(`Notificacion updated successfully: ${idNotificacion}`);

            return notificacionActualizada;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                throw error;
            }
            this.logger.error(`Error updating notificacion ${idNotificacion}`, error.stack);
            throw new BadRequestException('Error al actualizar la notificación');
        }
    }

    /**
 * Marca una notificación como leída
 */
    async marcarComoLeida(
        idNotificacion: number,
        currentUser: { idUser: number; rol: string }
    ) {
        this.logger.log(`Marking notificacion as read: ${idNotificacion}`);

        try {
            // Just validate permissions, don't store the result
            await this.findOne(idNotificacion, currentUser);

            const notificacionActualizada = await this.prisma.notificacion.update({
                where: { idNotificacion },
                data: { estadoLectura: true }
            });

            this.logger.log(`Notificacion marked as read: ${idNotificacion}`);

            return notificacionActualizada;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                throw error;
            }
            this.logger.error(`Error marking notificacion as read ${idNotificacion}`, error.stack);
            throw new BadRequestException('Error al marcar la notificación como leída');
        }
    }

    /**
     * Marca todas las notificaciones de un usuario como leídas
     */
    async marcarTodasComoLeidas(currentUser: { idUser: number; rol: string }) {
        this.logger.log(`Marking all notifications as read for user: ${currentUser.idUser}`);

        try {
            const result = await this.prisma.notificacion.updateMany({
                where: {
                    idUser: currentUser.idUser,
                    estadoLectura: false
                },
                data: { estadoLectura: true }
            });

            this.logger.log(`${result.count} notifications marked as read for user: ${currentUser.idUser}`);

            return {
                message: `${result.count} notificaciones marcadas como leídas`,
                count: result.count
            };
        } catch (error) {
            this.logger.error(`Error marking all notifications as read for user ${currentUser.idUser}`, error.stack);
            throw new BadRequestException('Error al marcar todas las notificaciones como leídas');
        }
    }

    /**
     * Elimina una notificación
     */
    async remove(
        idNotificacion: number,
        currentUser: { idUser: number; rol: string }
    ) {
        this.logger.log(`Removing notificacion: ${idNotificacion}`);

        try {
            const notificacion = await this.findOne(idNotificacion, currentUser);

            // Solo el propietario o admin pueden eliminar
            if (currentUser.rol !== RolUsuario.ADMIN && notificacion.idUser !== currentUser.idUser) {
                throw new ForbiddenException('No tienes permisos para eliminar esta notificación');
            }

            const removedNotificacion = await this.prisma.notificacion.delete({
                where: { idNotificacion }
            });

            this.logger.log(`Notificacion removed successfully: ${idNotificacion}`);

            return removedNotificacion;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                throw error;
            }
            this.logger.error(`Error removing notificacion ${idNotificacion}`, error.stack);
            throw new BadRequestException('Error al eliminar la notificación');
        }
    }

    /**
     * Obtiene notificaciones del usuario actual
     */
    async findByUser(idUser: number, filterDto?: NotificacionFilterDto) {
        this.logger.log(`Finding notifications for user: ${idUser}`);

        try {
            // Verificar que el usuario existe
            await this.getUserFromAuthService(idUser);

            return this.findAll({
                ...filterDto,
                idUser
            }, { idUser, rol: RolUsuario.CLIENTE });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error finding notifications for user ${idUser}`, error.stack);
            throw new BadRequestException('Error al obtener las notificaciones del usuario');
        }
    }

    /**
     * Obtiene contador de notificaciones no leídas
     */
    async getUnreadCount(idUser: number): Promise<number> {
        this.logger.log(`Getting unread count for user: ${idUser}`);

        try {
            // Verificar que el usuario existe
            await this.getUserFromAuthService(idUser);

            const count = await this.prisma.notificacion.count({
                where: {
                    idUser,
                    estadoLectura: false
                }
            });

            return count;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error getting unread count for user ${idUser}`, error.stack);
            throw new BadRequestException('Error al obtener el contador de notificaciones no leídas');
        }
    }

    /**
     * Obtiene estadísticas de notificaciones
     */
    async getStats(idUser?: number) {
        const logMessage = idUser ? `Getting notification stats for user: ${idUser}` : 'Getting notification stats';
        this.logger.log(logMessage);

        try {
            const where: any = {};
            if (idUser) {
                // Verificar que el usuario existe
                await this.getUserFromAuthService(idUser);
                where.idUser = idUser;
            }

            const [
                total,
                leidas,
                noLeidas,
                porTipo
            ] = await Promise.all([
                this.prisma.notificacion.count({ where }),
                this.prisma.notificacion.count({
                    where: { ...where, estadoLectura: true }
                }),
                this.prisma.notificacion.count({
                    where: { ...where, estadoLectura: false }
                }),
                this.prisma.notificacion.groupBy({
                    by: ['tipoNotificacion'],
                    where,
                    _count: { tipoNotificacion: true }
                })
            ]);

            const distribucionTipos = porTipo.reduce((acc, item) => {
                acc[item.tipoNotificacion] = item._count.tipoNotificacion;
                return acc;
            }, {} as Record<string, number>);

            return {
                total,
                leidas,
                noLeidas,
                porcentajeLectura: total > 0 ? Number(((leidas / total) * 100).toFixed(2)) : 0,
                distribucionTipos
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error('Error getting notification stats', error.stack);
            throw new BadRequestException('Error al obtener las estadísticas de notificaciones');
        }
    }

    /**
     * Elimina notificaciones antiguas (cleanup)
     */
    async cleanupOldNotifications(diasAntiguedad: number = 90) {
        this.logger.log(`Cleaning up notifications older than ${diasAntiguedad} days`);

        try {
            const fechaLimite = new Date();
            fechaLimite.setDate(fechaLimite.getDate() - diasAntiguedad);

            const result = await this.prisma.notificacion.deleteMany({
                where: {
                    fechaEnvio: {
                        lt: fechaLimite
                    },
                    estadoLectura: true
                }
            });

            this.logger.log(`${result.count} old notifications cleaned up`);

            return {
                message: `${result.count} notificaciones antiguas eliminadas`,
                count: result.count
            };
        } catch (error) {
            this.logger.error('Error cleaning up old notifications', error.stack);
            throw new BadRequestException('Error al limpiar notificaciones antiguas');
        }
    }
}

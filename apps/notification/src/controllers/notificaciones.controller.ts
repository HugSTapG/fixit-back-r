import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificacionesService } from '../services/notificaciones.service';
import {
    CreateNotificacionDto,
    UpdateNotificacionDto,
    NotificacionFilterDto
} from '../dto/index';
import { NOTIFICATION_PATTERNS } from '@app/events';
import { TipoNotificacion } from '@app/shared';

/**
 * Controlador para la gestión de notificaciones en microservicio
 */
@Controller()
export class NotificacionesController {
    private readonly logger = new Logger(NotificacionesController.name);

    constructor(private readonly notificacionesService: NotificacionesService) { }

    /**
     * Obtiene todas las notificaciones con filtros
     */
    @MessagePattern(NOTIFICATION_PATTERNS.FIND_ALL_NOTIFICACIONES)
    async findAll(@Payload() data: {
        filterDto?: NotificacionFilterDto;
        currentUser?: { idUser: number; rol: string }
    }) {
        try {
            const { filterDto, currentUser } = data;
            this.logger.log('Finding all notificaciones');
            const result = await this.notificacionesService.findAll(filterDto, currentUser);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error('Error finding all notificaciones', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Busca una notificación por ID
     */
    @MessagePattern(NOTIFICATION_PATTERNS.FIND_NOTIFICACION_BY_ID)
    async findOne(@Payload() data: {
        idNotificacion: number;
        currentUser: { idUser: number; rol: string }
    }) {
        try {
            const { idNotificacion, currentUser } = data;
            this.logger.log(`Finding notificacion: ${idNotificacion}`);
            const notificacion = await this.notificacionesService.findOne(idNotificacion, currentUser);
            return { success: true, data: notificacion };
        } catch (error) {
            this.logger.error(`Error finding notificacion: ${data.idNotificacion}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Crea una nueva notificación
     */
    @MessagePattern(NOTIFICATION_PATTERNS.CREATE_NOTIFICACION)
    async create(@Payload() data: {
        createNotificacionDto: CreateNotificacionDto
    }) {
        try {
            const { createNotificacionDto } = data;
            this.logger.log(`Creating notificacion for user: ${createNotificacionDto.idUser}`);
            const notificacion = await this.notificacionesService.create(createNotificacionDto);
            return { success: true, data: notificacion };
        } catch (error) {
            this.logger.error(`Error creating notificacion for user: ${data.createNotificacionDto.idUser}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Crea notificación del sistema
     */
    @MessagePattern(NOTIFICATION_PATTERNS.CREATE_SYSTEM_NOTIFICATION)
    async createSystemNotification(@Payload() data: {
        idUser: number;
        tipoNotificacion: TipoNotificacion;
        titulo: string;
        mensaje: string;
    }) {
        try {
            const { idUser, tipoNotificacion, titulo, mensaje } = data;
            this.logger.log(`Creating system notification for user: ${idUser}, type: ${tipoNotificacion}`);
            const notificacion = await this.notificacionesService.createSystemNotification(
                idUser,
                tipoNotificacion,
                titulo,
                mensaje
            );
            return { success: true, data: notificacion };
        } catch (error) {
            this.logger.error(`Error creating system notification for user: ${data.idUser}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Actualiza una notificación
     */
    @MessagePattern(NOTIFICATION_PATTERNS.UPDATE_NOTIFICACION)
    async update(@Payload() data: {
        idNotificacion: number;
        updateNotificacionDto: UpdateNotificacionDto;
        currentUser: { idUser: number; rol: string }
    }) {
        try {
            const { idNotificacion, updateNotificacionDto, currentUser } = data;
            this.logger.log(`Updating notificacion: ${idNotificacion}`);
            const notificacion = await this.notificacionesService.update(idNotificacion, updateNotificacionDto, currentUser);
            return { success: true, data: notificacion };
        } catch (error) {
            this.logger.error(`Error updating notificacion: ${data.idNotificacion}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Marca una notificación como leída
     */
    @MessagePattern(NOTIFICATION_PATTERNS.MARCAR_COMO_LEIDA)
    async marcarComoLeida(@Payload() data: {
        idNotificacion: number;
        currentUser: { idUser: number; rol: string }
    }) {
        try {
            const { idNotificacion, currentUser } = data;
            this.logger.log(`Marking notificacion as read: ${idNotificacion}`);
            const notificacion = await this.notificacionesService.marcarComoLeida(idNotificacion, currentUser);
            return { success: true, data: notificacion };
        } catch (error) {
            this.logger.error(`Error marking notificacion as read: ${data.idNotificacion}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Marca todas las notificaciones como leídas
     */
    @MessagePattern(NOTIFICATION_PATTERNS.MARCAR_TODAS_LEIDAS)
    async marcarTodasComoLeidas(@Payload() data: {
        currentUser: { idUser: number; rol: string }
    }) {
        try {
            const { currentUser } = data;
            this.logger.log(`Marking all notifications as read for user: ${currentUser.idUser}`);
            const result = await this.notificacionesService.marcarTodasComoLeidas(currentUser);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error marking all notifications as read for user: ${data.currentUser.idUser}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Elimina una notificación
     */
    @MessagePattern(NOTIFICATION_PATTERNS.DELETE_NOTIFICACION)
    async remove(@Payload() data: {
        idNotificacion: number;
        currentUser: { idUser: number; rol: string }
    }) {
        try {
            const { idNotificacion, currentUser } = data;
            this.logger.log(`Removing notificacion: ${idNotificacion}`);
            const result = await this.notificacionesService.remove(idNotificacion, currentUser);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error removing notificacion: ${data.idNotificacion}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Obtiene notificaciones por usuario
     */
    @MessagePattern(NOTIFICATION_PATTERNS.FIND_BY_USER)
    async findByUser(@Payload() data: {
        idUser: number;
        filterDto?: NotificacionFilterDto
    }) {
        try {
            const { idUser, filterDto } = data;
            this.logger.log(`Finding notifications for user: ${idUser}`);
            const result = await this.notificacionesService.findByUser(idUser, filterDto);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error finding notifications for user: ${data.idUser}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Obtiene contador de notificaciones no leídas
     */
    @MessagePattern(NOTIFICATION_PATTERNS.GET_UNREAD_COUNT)
    async getUnreadCount(@Payload() data: { idUser: number }) {
        try {
            const { idUser } = data;
            this.logger.log(`Getting unread count for user: ${idUser}`);
            const count = await this.notificacionesService.getUnreadCount(idUser);
            return { success: true, data: { unreadCount: count } };
        } catch (error) {
            this.logger.error(`Error getting unread count for user: ${data.idUser}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Obtiene estadísticas de notificaciones
     */
    @MessagePattern(NOTIFICATION_PATTERNS.GET_STATS)
    async getStats(@Payload() data: { idUser?: number }) {
        try {
            const { idUser } = data;
            const logMessage = idUser ? `Getting notification stats for user: ${idUser}` : 'Getting notification stats';
            this.logger.log(logMessage);
            const stats = await this.notificacionesService.getStats(idUser);
            return { success: true, data: stats };
        } catch (error) {
            this.logger.error('Error getting notification stats', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Limpia notificaciones antiguas
     */
    @MessagePattern(NOTIFICATION_PATTERNS.CLEANUP_OLD_NOTIFICATIONS)
    async cleanupOldNotifications(@Payload() data: { diasAntiguedad?: number }) {
        try {
            const { diasAntiguedad } = data;
            this.logger.log(`Cleaning up old notifications (${diasAntiguedad || 90} days)`);
            const result = await this.notificacionesService.cleanupOldNotifications(diasAntiguedad);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error('Error cleaning up old notifications', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }
}

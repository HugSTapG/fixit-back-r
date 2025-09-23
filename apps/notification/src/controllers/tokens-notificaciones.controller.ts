import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TokensNotificacionesService } from '../services/tokens-notificaciones.service';
import { PushNotificationsService } from '../services/push-notifications.service';
import {
    CreateTokenNotificacionDto,
    UpdateTokenNotificacionDto,
    EnviarNotificacionPushDto
} from '../dto/index';
import { NOTIFICATION_PATTERNS } from '@app/events';

/**
 * Controlador para la gestión de tokens de notificaciones push en microservicio
 */
@Controller()
export class TokensNotificacionesController {
    private readonly logger = new Logger(TokensNotificacionesController.name);

    constructor(
        private readonly tokensService: TokensNotificacionesService,
        private readonly pushService: PushNotificationsService
    ) { }

    /**
     * Obtiene todos los tokens
     */
    @MessagePattern(NOTIFICATION_PATTERNS.FIND_ALL_TOKENS)
    async findAll() {
        try {
            this.logger.log('Finding all notification tokens');
            const tokens = await this.tokensService.findAll();
            return { success: true, data: tokens };
        } catch (error) {
            this.logger.error('Error finding all notification tokens', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Busca un token por ID
     */
    @MessagePattern(NOTIFICATION_PATTERNS.FIND_TOKEN_BY_ID)
    async findOne(@Payload() data: { idTokenNotificacion: number }) {
        try {
            const { idTokenNotificacion } = data;
            this.logger.log(`Finding notification token: ${idTokenNotificacion}`);
            const token = await this.tokensService.findOne(idTokenNotificacion);
            return { success: true, data: token };
        } catch (error) {
            this.logger.error(`Error finding notification token: ${data.idTokenNotificacion}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Registra un nuevo token
     */
    @MessagePattern(NOTIFICATION_PATTERNS.REGISTER_TOKEN)
    async create(@Payload() data: {
        createTokenDto: CreateTokenNotificacionDto;
        idUser: number
    }) {
        try {
            const { createTokenDto, idUser } = data;
            this.logger.log(`Registering notification token for user: ${idUser}`);
            const token = await this.tokensService.create(createTokenDto, idUser);
            return { success: true, data: token };
        } catch (error) {
            this.logger.error(`Error registering notification token for user: ${data.idUser}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Actualiza un token
     */
    @MessagePattern(NOTIFICATION_PATTERNS.UPDATE_TOKEN)
    async update(@Payload() data: {
        idTokenNotificacion: number;
        updateTokenDto: UpdateTokenNotificacionDto;
        currentUser: { idUser: number; rol: string }
    }) {
        try {
            const { idTokenNotificacion, updateTokenDto, currentUser } = data;
            this.logger.log(`Updating notification token: ${idTokenNotificacion}`);
            const token = await this.tokensService.update(idTokenNotificacion, updateTokenDto, currentUser);
            return { success: true, data: token };
        } catch (error) {
            this.logger.error(`Error updating notification token: ${data.idTokenNotificacion}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Elimina un token
     */
    @MessagePattern(NOTIFICATION_PATTERNS.DELETE_TOKEN)
    async remove(@Payload() data: {
        idTokenNotificacion: number;
        currentUser: { idUser: number; rol: string }
    }) {
        try {
            const { idTokenNotificacion, currentUser } = data;
            this.logger.log(`Removing notification token: ${idTokenNotificacion}`);
            const result = await this.tokensService.remove(idTokenNotificacion, currentUser);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error removing notification token: ${data.idTokenNotificacion}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Obtiene tokens activos por usuario
     */
    @MessagePattern(NOTIFICATION_PATTERNS.FIND_ACTIVE_TOKENS_BY_USER)
    async findActiveTokensByUser(@Payload() data: { idUser: number }) {
        try {
            const { idUser } = data;
            this.logger.log(`Finding active tokens for user: ${idUser}`);
            const tokens = await this.tokensService.findActiveTokensByUser(idUser);
            return { success: true, data: tokens };
        } catch (error) {
            this.logger.error(`Error finding active tokens for user: ${data.idUser}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Desactiva un token
     */
    @MessagePattern(NOTIFICATION_PATTERNS.DEACTIVATE_TOKEN)
    async deactivateToken(@Payload() data: {
        tokenDispositivo: string;
        idUser: number
    }) {
        try {
            const { tokenDispositivo, idUser } = data;
            this.logger.log(`Deactivating token for user: ${idUser}`);
            const result = await this.tokensService.deactivateToken(tokenDispositivo, idUser);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error deactivating token for user: ${data.idUser}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Obtiene estadísticas de tokens
     */
    @MessagePattern(NOTIFICATION_PATTERNS.GET_TOKEN_STATS)
    async getStats() {
        try {
            this.logger.log('Getting token statistics');
            const stats = await this.tokensService.getStats();
            return { success: true, data: stats };
        } catch (error) {
            this.logger.error('Error getting token statistics', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Limpia tokens expirados
     */
    @MessagePattern(NOTIFICATION_PATTERNS.CLEANUP_EXPIRED_TOKENS)
    async cleanupExpiredTokens() {
        try {
            this.logger.log('Cleaning up expired tokens');
            const result = await this.tokensService.cleanupExpiredTokens();
            return { success: true, data: result };
        } catch (error) {
            this.logger.error('Error cleaning up expired tokens', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Envía notificación push a un usuario
     */
    @MessagePattern(NOTIFICATION_PATTERNS.SEND_PUSH_TO_USER)
    async sendPushToUser(@Payload() data: {
        idUser: number;
        notificacionDto: EnviarNotificacionPushDto
    }) {
        try {
            const { idUser, notificacionDto } = data;
            this.logger.log(`Sending push notification to user: ${idUser}`);
            const result = await this.pushService.sendToUser(idUser, notificacionDto);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error sending push notification to user: ${data.idUser}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Envía notificación push a múltiples usuarios
     */
    @MessagePattern(NOTIFICATION_PATTERNS.SEND_PUSH_TO_MULTIPLE_USERS)
    async sendPushToMultipleUsers(@Payload() data: {
        userIds: number[];
        notificacionDto: EnviarNotificacionPushDto
    }) {
        try {
            const { userIds, notificacionDto } = data;
            this.logger.log(`Sending push notification to ${userIds.length} users`);
            const result = await this.pushService.sendToMultipleUsers(userIds, notificacionDto);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error('Error sending push notification to multiple users', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Envía notificación de bienvenida
     */
    @MessagePattern(NOTIFICATION_PATTERNS.SEND_WELCOME_NOTIFICATION)
    async sendWelcomeNotification(@Payload() data: {
        idUser: number;
        nombreUsuario: string
    }) {
        try {
            const { idUser, nombreUsuario } = data;
            this.logger.log(`Sending welcome notification to user: ${idUser}`);
            const result = await this.pushService.sendWelcomeNotification(idUser, nombreUsuario);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error sending welcome notification to user: ${data.idUser}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Envía notificación de nueva solicitud
     */
    @MessagePattern(NOTIFICATION_PATTERNS.SEND_NEW_REQUEST_NOTIFICATION)
    async sendNewRequestNotification(@Payload() data: {
        technicianIds: number[];
        tituloSolicitud: string;
        idSolicitud: number
    }) {
        try {
            const { technicianIds, tituloSolicitud, idSolicitud } = data;
            this.logger.log(`Sending new request notification to ${technicianIds.length} technicians for solicitud: ${idSolicitud}`);
            const result = await this.pushService.sendNewRequestNotification(technicianIds, tituloSolicitud, idSolicitud);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error sending new request notification for solicitud: ${data.idSolicitud}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Envía notificación de propuesta
     */
    @MessagePattern(NOTIFICATION_PATTERNS.SEND_PROPOSAL_NOTIFICATION)
    async sendProposalNotification(@Payload() data: {
        idCliente: number;
        nombreTecnico: string;
        idSolicitud: number
    }) {
        try {
            const { idCliente, nombreTecnico, idSolicitud } = data;
            this.logger.log(`Sending proposal notification to client: ${idCliente} for solicitud: ${idSolicitud}`);
            const result = await this.pushService.sendProposalNotification(idCliente, nombreTecnico, idSolicitud);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error sending proposal notification for solicitud: ${data.idSolicitud}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Envía notificación de propuesta aceptada
     */
    @MessagePattern(NOTIFICATION_PATTERNS.SEND_PROPOSAL_ACCEPTED_NOTIFICATION)
    async sendProposalAcceptedNotification(@Payload() data: {
        idTecnico: number;
        tituloSolicitud: string;
        idSolicitud: number
    }) {
        try {
            const { idTecnico, tituloSolicitud, idSolicitud } = data;
            this.logger.log(`Sending proposal accepted notification to technician: ${idTecnico} for solicitud: ${idSolicitud}`);
            const result = await this.pushService.sendProposalAcceptedNotification(idTecnico, tituloSolicitud, idSolicitud);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error sending proposal accepted notification for solicitud: ${data.idSolicitud}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Envía notificación de servicio completado
     */
    @MessagePattern(NOTIFICATION_PATTERNS.SEND_SERVICE_COMPLETED_NOTIFICATION)
    async sendServiceCompletedNotification(@Payload() data: {
        idCliente: number;
        nombreTecnico: string;
        idSolicitud: number
    }) {
        try {
            const { idCliente, nombreTecnico, idSolicitud } = data;
            this.logger.log(`Sending service completed notification to client: ${idCliente} for solicitud: ${idSolicitud}`);
            const result = await this.pushService.sendServiceCompletedNotification(idCliente, nombreTecnico, idSolicitud);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error sending service completed notification for solicitud: ${data.idSolicitud}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Envía notificación de calificación recibida
     */
    @MessagePattern(NOTIFICATION_PATTERNS.SEND_RATING_RECEIVED_NOTIFICATION)
    async sendRatingReceivedNotification(@Payload() data: {
        idTecnico: number;
        puntaje: string;
        idSolicitud: number
    }) {
        try {
            const { idTecnico, puntaje, idSolicitud } = data;
            this.logger.log(`Sending rating received notification to technician: ${idTecnico} for solicitud: ${idSolicitud}`);
            const result = await this.pushService.sendRatingReceivedNotification(idTecnico, puntaje, idSolicitud);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error sending rating received notification for solicitud: ${data.idSolicitud}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Envía notificación de recordatorio de pago
     */
    @MessagePattern(NOTIFICATION_PATTERNS.SEND_PAYMENT_REMINDER_NOTIFICATION)
    async sendPaymentReminderNotification(@Payload() data: {
        idCliente: number;
        monto: number;
        idSolicitud: number
    }) {
        try {
            const { idCliente, monto, idSolicitud } = data;
            this.logger.log(`Sending payment reminder notification to client: ${idCliente} for solicitud: ${idSolicitud}`);
            const result = await this.pushService.sendPaymentReminderNotification(idCliente, monto, idSolicitud);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error sending payment reminder notification for solicitud: ${data.idSolicitud}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }
}

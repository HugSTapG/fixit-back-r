import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MicroserviceProxyService } from './microservice-proxy.service';
import { NOTIFICATION_PATTERNS } from '@app/events';

@Injectable()
export class NotificationProxyService extends MicroserviceProxyService {

    // === NOTIFICACIONES ===
    findAllNotificaciones(filterDto?: any, currentUser?: any): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.FIND_ALL_NOTIFICACIONES, { filterDto, currentUser });
    }

    findNotificacionById(idNotificacion: number, currentUser: any): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.FIND_NOTIFICACION_BY_ID, { idNotificacion, currentUser });
    }

    createNotificacion(createNotificacionDto: any): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.CREATE_NOTIFICACION, { createNotificacionDto });
    }

    createSystemNotification(idUser: number, tipoNotificacion: any, titulo: string, mensaje: string): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.CREATE_SYSTEM_NOTIFICATION, { idUser, tipoNotificacion, titulo, mensaje });
    }

    updateNotificacion(idNotificacion: number, updateNotificacionDto: any, currentUser: any): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.UPDATE_NOTIFICACION, { idNotificacion, updateNotificacionDto, currentUser });
    }

    deleteNotificacion(idNotificacion: number, currentUser: any): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.DELETE_NOTIFICACION, { idNotificacion, currentUser });
    }

    marcarComoLeida(idNotificacion: number, currentUser: any): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.MARCAR_COMO_LEIDA, { idNotificacion, currentUser });
    }

    marcarTodasLeidas(currentUser: any): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.MARCAR_TODAS_LEIDAS, { currentUser });
    }

    findNotificacionesByUser(idUser: number, filterDto?: any): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.FIND_BY_USER, { idUser, filterDto });
    }

    getUnreadCount(idUser: number): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.GET_UNREAD_COUNT, { idUser });
    }

    getNotificationStats(idUser?: number): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.GET_STATS, { idUser });
    }

    cleanupOldNotifications(diasAntiguedad?: number): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.CLEANUP_OLD_NOTIFICATIONS, { diasAntiguedad });
    }

    // === TOKENS ===
    findAllTokens(): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.FIND_ALL_TOKENS, {});
    }

    findTokenById(idTokenNotificacion: number): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.FIND_TOKEN_BY_ID, { idTokenNotificacion });
    }

    registerToken(createTokenDto: any, idUser: number): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.REGISTER_TOKEN, { createTokenDto, idUser });
    }

    updateToken(idTokenNotificacion: number, updateTokenDto: any, currentUser: any): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.UPDATE_TOKEN, { idTokenNotificacion, updateTokenDto, currentUser });
    }

    deleteToken(idTokenNotificacion: number, currentUser: any): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.DELETE_TOKEN, { idTokenNotificacion, currentUser });
    }

    findActiveTokensByUser(idUser: number): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.FIND_ACTIVE_TOKENS_BY_USER, { idUser });
    }

    deactivateToken(tokenDispositivo: string, idUser: number): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.DEACTIVATE_TOKEN, { tokenDispositivo, idUser });
    }

    getTokenStats(): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.GET_TOKEN_STATS, {});
    }

    cleanupExpiredTokens(): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.CLEANUP_EXPIRED_TOKENS, {});
    }

    // === PUSH NOTIFICATIONS ===
    sendPushToUser(idUser: number, notificacionDto: any): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.SEND_PUSH_TO_USER, { idUser, notificacionDto });
    }

    sendPushToMultipleUsers(userIds: number[], notificacionDto: any): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.SEND_PUSH_TO_MULTIPLE_USERS, { userIds, notificacionDto });
    }

    sendWelcomeNotification(idUser: number, nombreUsuario: string): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.SEND_WELCOME_NOTIFICATION, { idUser, nombreUsuario });
    }

    sendNewRequestNotification(technicianIds: number[], tituloSolicitud: string, idSolicitud: number): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.SEND_NEW_REQUEST_NOTIFICATION, { technicianIds, tituloSolicitud, idSolicitud });
    }

    sendProposalNotification(idCliente: number, nombreTecnico: string, idSolicitud: number): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.SEND_PROPOSAL_NOTIFICATION, { idCliente, nombreTecnico, idSolicitud });
    }

    sendProposalAcceptedNotification(idTecnico: number, tituloSolicitud: string, idSolicitud: number): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.SEND_PROPOSAL_ACCEPTED_NOTIFICATION, { idTecnico, tituloSolicitud, idSolicitud });
    }

    sendServiceCompletedNotification(idCliente: number, nombreTecnico: string, idSolicitud: number): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.SEND_SERVICE_COMPLETED_NOTIFICATION, { idCliente, nombreTecnico, idSolicitud });
    }

    sendRatingReceivedNotification(idTecnico: number, puntaje: string, idSolicitud: number): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.SEND_RATING_RECEIVED_NOTIFICATION, { idTecnico, puntaje, idSolicitud });
    }

    sendPaymentReminderNotification(idCliente: number, monto: number, idSolicitud: number): Observable<any> {
        return this.sendToNotification(NOTIFICATION_PATTERNS.SEND_PAYMENT_REMINDER_NOTIFICATION, { idCliente, monto, idSolicitud });
    }
}

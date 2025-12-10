import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Query,
    UseGuards,
    Request,
    ParseIntPipe,
    HttpCode,
    Logger
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { NotificationProxyService } from '../proxy/services/notification-proxy.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, RolUsuario } from '@app/shared';

/**
 * Controlador para la gestión de notificaciones a través del API Gateway
 */
@Controller('notifications')
export class NotificationController {
    private readonly logger = new Logger(NotificationController.name);

    constructor(private readonly notificationProxyService: NotificationProxyService) { }

    // ========== NOTIFICACIONES ==========

    /**
     * Obtiene todas las notificaciones (admin) o del usuario actual
     */
    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Query() filterDto: any, @Request() req: any): Observable<any> {
        this.logger.log(`Getting notifications for user: ${req.user.idUser}`);
        return this.notificationProxyService.findAllNotificaciones(filterDto, req.user);
    }

    /**
     * Obtiene las notificaciones del usuario actual
     */
    @Get('my/notifications')
    @UseGuards(JwtAuthGuard)
    findMyNotifications(@Request() req: any, @Query() filterDto: any): Observable<any> {
        this.logger.log(`Getting my notifications for user: ${req.user.idUser}`);
        return this.notificationProxyService.findNotificacionesByUser(req.user.idUser, filterDto);
    }

    /**
     * Obtiene contador de notificaciones no leídas del usuario actual
     */
    @Get('my/unread-count')
    @UseGuards(JwtAuthGuard)
    getUnreadCount(@Request() req: any): Observable<any> {
        this.logger.log(`Getting unread count for user: ${req.user.idUser}`);
        return this.notificationProxyService.getUnreadCount(req.user.idUser);
    }

    /**
     * Obtiene estadísticas de notificaciones
     */
    @Get('stats')
    @UseGuards(JwtAuthGuard)
    getStats(@Request() req: any): Observable<any> {
        const idUser = req.user.roles?.includes(RolUsuario.ADMIN)
            ? undefined
            : req.user.idUser;
        this.logger.log(`Getting notification stats for user: ${idUser || 'all'}`);
        return this.notificationProxyService.getNotificationStats(idUser);
    }

    /**
     * Crea una nueva notificación (solo admin)
     */
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    create(@Body() createNotificacionDto: any): Observable<any> {
        this.logger.log(`Creating notification for user: ${createNotificacionDto.idUser}`);
        return this.notificationProxyService.createNotificacion(createNotificacionDto);
    }

    /**
     * Marca todas las notificaciones del usuario como leídas
     */
    @Put('mark-all-read')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    markAllAsRead(@Request() req: any): Observable<any> {
        this.logger.log(`Marking all notifications as read for user: ${req.user.idUser}`);
        return this.notificationProxyService.marcarTodasLeidas(req.user);
    }

    /**
     * Obtiene una notificación específica por su ID
     */
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any): Observable<any> {
        this.logger.log(`Getting notification: ${id}`);
        return this.notificationProxyService.findNotificacionById(id, req.user);
    }

    /**
     * Marca una notificación como leída
     */
    @Put(':id/mark-read')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    markAsRead(@Param('id', ParseIntPipe) id: number, @Request() req: any): Observable<any> {
        this.logger.log(`Marking notification as read: ${id}`);
        return this.notificationProxyService.marcarComoLeida(id, req.user);
    }

    /**
     * Actualiza una notificación existente
     */
    @Put(':id')
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateNotificacionDto: any,
        @Request() req: any
    ): Observable<any> {
        this.logger.log(`Updating notification: ${id}`);
        return this.notificationProxyService.updateNotificacion(id, updateNotificacionDto, req.user);
    }

    /**
     * Elimina una notificación
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id', ParseIntPipe) id: number, @Request() req: any): Observable<any> {
        this.logger.log(`Removing notification: ${id}`);
        return this.notificationProxyService.deleteNotificacion(id, req.user);
    }

    /**
     * Limpia notificaciones antiguas (solo admin)
     */
    @Delete('cleanup/old-notifications')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    cleanupOldNotifications(@Query('days', ParseIntPipe) days?: number): Observable<any> {
        this.logger.log(`Cleaning up old notifications (${days || 90} days)`);
        return this.notificationProxyService.cleanupOldNotifications(days);
    }

    // ========== TOKENS DE NOTIFICACIONES ==========

    /**
     * Obtiene todos los tokens (solo admin)
     */
    @Get('tokens/all')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    findAllTokens(): Observable<any> {
        this.logger.log('Getting all notification tokens');
        return this.notificationProxyService.findAllTokens();
    }

    /**
     * Obtiene los tokens activos del usuario actual
     */
    @Get('tokens/my-tokens')
    @UseGuards(JwtAuthGuard)
    findMyTokens(@Request() req: any): Observable<any> {
        this.logger.log(`Getting tokens for user: ${req.user.idUser}`);
        return this.notificationProxyService.findActiveTokensByUser(req.user.idUser);
    }

    /**
     * Obtiene estadísticas de tokens (solo admin)
     */
    @Get('tokens/stats')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    getTokenStats(): Observable<any> {
        this.logger.log('Getting token statistics');
        return this.notificationProxyService.getTokenStats();
    }

    /**
     * Registra un nuevo token de notificación para el usuario actual
     */
    @Post('tokens/register')
    @UseGuards(JwtAuthGuard)
    registerToken(@Body() createTokenDto: any, @Request() req: any): Observable<any> {
        this.logger.log(`Registering token for user: ${req.user.idUser}`);
        return this.notificationProxyService.registerToken(createTokenDto, req.user.idUser);
    }

    /**
     * Desactiva un token específico del usuario actual
     */
    @Put('tokens/:token/deactivate')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    deactivateToken(@Param('token') token: string, @Request() req: any): Observable<any> {
        this.logger.log(`Deactivating token for user: ${req.user.idUser}`);
        return this.notificationProxyService.deactivateToken(token, req.user.idUser);
    }

    /**
     * Obtiene un token específico por su ID
     */
    @Get('tokens/:id')
    @UseGuards(JwtAuthGuard)
    findOneToken(@Param('id', ParseIntPipe) id: number): Observable<any> {
        this.logger.log(`Getting token: ${id}`);
        return this.notificationProxyService.findTokenById(id);
    }

    /**
     * Actualiza un token existente
     */
    @Put('tokens/:id')
    @UseGuards(JwtAuthGuard)
    updateToken(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTokenDto: any,
        @Request() req: any
    ): Observable<any> {
        this.logger.log(`Updating token: ${id}`);
        return this.notificationProxyService.updateToken(id, updateTokenDto, req.user);
    }

    /**
     * Elimina un token
     */
    @Delete('tokens/:id')
    @UseGuards(JwtAuthGuard)
    removeToken(@Param('id', ParseIntPipe) id: number, @Request() req: any): Observable<any> {
        this.logger.log(`Removing token: ${id}`);
        return this.notificationProxyService.deleteToken(id, req.user);
    }

    /**
     * Limpia tokens expirados (solo admin)
     */
    @Delete('tokens/cleanup/expired')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    cleanupExpiredTokens(): Observable<any> {
        this.logger.log('Cleaning up expired tokens');
        return this.notificationProxyService.cleanupExpiredTokens();
    }

    // ========== PUSH NOTIFICATIONS ==========

    /**
     * Envía notificación push de prueba al usuario actual
     */
    @Post('push/test')
    @UseGuards(JwtAuthGuard)
    sendTestPush(@Request() req: any): Observable<any> {
        this.logger.log(`Sending test push to user: ${req.user.idUser}`);
        const notificacion = {
            titulo: 'Notificación de Prueba',
            mensaje: '¡Tu configuración de notificaciones push funciona correctamente!',
            datosAdicionales: {
                tipo: 'test',
                timestamp: new Date().toISOString()
            }
        };
        return this.notificationProxyService.sendPushToUser(req.user.idUser, notificacion);
    }

    /**
     * Envía notificación push personalizada (solo admin)
     */
    @Post('push/send/:userId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    sendCustomPush(
        @Param('userId', ParseIntPipe) userId: number,
        @Body() notificacionDto: any
    ): Observable<any> {
        this.logger.log(`Sending custom push to user: ${userId}`);
        return this.notificationProxyService.sendPushToUser(userId, notificacionDto);
    }

    /**
     * Envía notificación push masiva (solo admin)
     */
    @Post('push/broadcast')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    sendBroadcast(@Body() body: { userIds: number[]; notificacion: any }): Observable<any> {
        const { userIds, notificacion } = body;
        this.logger.log(`Sending broadcast push to ${userIds.length} users`);
        return this.notificationProxyService.sendPushToMultipleUsers(userIds, notificacion);
    }
}

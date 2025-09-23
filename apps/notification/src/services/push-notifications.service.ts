import { Injectable, Logger } from '@nestjs/common';
import { TokensNotificacionesService } from './tokens-notificaciones.service';
import { EnviarNotificacionPushDto } from '../dto/index';

/**
 * Servicio para envío de notificaciones push (simulado) en microservicio
 */
@Injectable()
export class PushNotificationsService {
    private readonly logger = new Logger(PushNotificationsService.name);

    constructor(
        private readonly tokensService: TokensNotificacionesService
    ) { }

    /**
     * Envía notificación push a un usuario específico
     */
    async sendToUser(
        idUser: number,
        notificacionDto: EnviarNotificacionPushDto
    ): Promise<{ enviadas: number; fallidas: number; detalles: any[] }> {
        this.logger.log(`Sending push notification to user: ${idUser}`);

        try {
            const tokens = await this.tokensService.findActiveTokensByUser(idUser);

            if (tokens.length === 0) {
                this.logger.warn(`No se encontraron tokens activos para el usuario ${idUser}`);
                return { enviadas: 0, fallidas: 0, detalles: [] };
            }

            const resultados = await Promise.allSettled(
                tokens.map(token => this.sendPushNotification(token.tokenDispositivo, token.plataforma, notificacionDto))
            );

            let enviadas = 0;
            let fallidas = 0;
            const detalles: any[] = [];

            resultados.forEach((resultado, index) => {
                if (resultado.status === 'fulfilled' && resultado.value.success) {
                    enviadas++;
                    detalles.push({
                        token: tokens[index].tokenDispositivo,
                        plataforma: tokens[index].plataforma,
                        estado: 'enviada'
                    });
                } else {
                    fallidas++;
                    detalles.push({
                        token: tokens[index].tokenDispositivo,
                        plataforma: tokens[index].plataforma,
                        estado: 'fallida',
                        error: resultado.status === 'rejected' ? resultado.reason : 'Error desconocido'
                    });
                }
            });

            this.logger.log(`Push notification results for user ${idUser}: ${enviadas} sent, ${fallidas} failed`);

            return { enviadas, fallidas, detalles };
        } catch (error) {
            this.logger.error(`Error sending push notification to user ${idUser}`, error.stack);
            return { enviadas: 0, fallidas: 1, detalles: [{ error: error.message }] };
        }
    }

    /**
     * Envía notificación push a múltiples usuarios
     */
    async sendToMultipleUsers(
        userIds: number[],
        notificacionDto: EnviarNotificacionPushDto
    ): Promise<{ totalEnviadas: number; totalFallidas: number; detallesPorUsuario: any[] }> {
        this.logger.log(`Sending push notification to ${userIds.length} users`);

        const resultados = await Promise.allSettled(
            userIds.map(idUser => this.sendToUser(idUser, notificacionDto))
        );

        let totalEnviadas = 0;
        let totalFallidas = 0;
        const detallesPorUsuario: any[] = [];

        resultados.forEach((resultado, index) => {
            if (resultado.status === 'fulfilled') {
                totalEnviadas += resultado.value.enviadas;
                totalFallidas += resultado.value.fallidas;
                detallesPorUsuario.push({
                    idUser: userIds[index],
                    ...resultado.value
                });
            } else {
                totalFallidas++;
                detallesPorUsuario.push({
                    idUser: userIds[index],
                    enviadas: 0,
                    fallidas: 1,
                    error: resultado.reason
                });
            }
        });

        this.logger.log(`Mass push notification completed: ${totalEnviadas} total sent, ${totalFallidas} total failed`);

        return { totalEnviadas, totalFallidas, detallesPorUsuario };
    }

    /**
     * Simula el envío de notificación push a un dispositivo específico
     */
    private async sendPushNotification(
        token: string,
        plataforma: string,
        notificacion: EnviarNotificacionPushDto
    ): Promise<{ success: boolean; messageId?: string; error?: string }> {
        try {
            // Simulación del envío según la plataforma
            await this.simulateDelay(100, 500); // Simular latencia de red

            // Simular tasa de éxito según plataforma
            const successRate = this.getSuccessRateByPlatform(plataforma);
            const isSuccessful = Math.random() < successRate;

            if (isSuccessful) {
                const messageId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
                this.logger.debug(`Push notification sent successfully - Token: ${token.substring(0, 10)}..., Platform: ${plataforma}, MessageID: ${messageId}`);

                return {
                    success: true,
                    messageId
                };
            } else {
                const error = 'Failed to send push notification';
                this.logger.warn(`Failed to send push notification - Token: ${token.substring(0, 10)}..., Error: ${error}`);

                return {
                    success: false,
                    error
                };
            }
        } catch (error) {
            this.logger.error(`Exception sending push notification: ${error.message}`);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Obtiene la tasa de éxito según la plataforma
     */
    private getSuccessRateByPlatform(plataforma: string): number {
        const rates: Record<string, number> = {
            'iOS': 0.95,
            'Android': 0.92,
            'Web': 0.88,
            'default': 0.90
        };

        return rates[plataforma] || rates['default'];
    }

    /**
     * Simula delay de red
     */
    private async simulateDelay(minMs: number, maxMs: number): Promise<void> {
        const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    /**
     * Envía notificación de bienvenida a un usuario
     */
    async sendWelcomeNotification(idUser: number, nombreUsuario: string): Promise<any> {
        this.logger.log(`Sending welcome notification to user: ${idUser}`);

        return this.sendToUser(idUser, {
            titulo: '¡Bienvenido a FixitBack!',
            mensaje: `Hola ${nombreUsuario}, tu cuenta ha sido creada exitosamente. ¡Comienza a usar nuestros servicios!`,
            datosAdicionales: {
                tipo: 'bienvenida',
                accion: 'abrir_app'
            }
        });
    }

    /**
     * Envía notificación cuando se crea una nueva solicitud
     */
    async sendNewRequestNotification(
        technicianIds: number[],
        tituloSolicitud: string,
        idSolicitud: number
    ): Promise<any> {
        this.logger.log(`Sending new request notification to ${technicianIds.length} technicians for solicitud: ${idSolicitud}`);

        return this.sendToMultipleUsers(technicianIds, {
            titulo: 'Nueva Solicitud Disponible',
            mensaje: `Nueva solicitud: ${tituloSolicitud}. ¡Postúlate ahora!`,
            datosAdicionales: {
                tipo: 'nueva_solicitud',
                idSolicitud,
                accion: 'ver_solicitud'
            }
        });
    }

    /**
     * Envía notificación cuando un técnico se postula
     */
    async sendProposalNotification(
        idCliente: number,
        nombreTecnico: string,
        idSolicitud: number
    ): Promise<any> {
        this.logger.log(`Sending proposal notification to client: ${idCliente} for solicitud: ${idSolicitud}`);

        return this.sendToUser(idCliente, {
            titulo: 'Nueva Propuesta Recibida',
            mensaje: `${nombreTecnico} se ha postulado a tu solicitud. ¡Revisa su propuesta!`,
            datosAdicionales: {
                tipo: 'nueva_propuesta',
                idSolicitud,
                accion: 'ver_propuestas'
            }
        });
    }

    /**
     * Envía notificación cuando se acepta una propuesta
     */
    async sendProposalAcceptedNotification(
        idTecnico: number,
        tituloSolicitud: string,
        idSolicitud: number
    ): Promise<any> {
        this.logger.log(`Sending proposal accepted notification to technician: ${idTecnico} for solicitud: ${idSolicitud}`);

        return this.sendToUser(idTecnico, {
            titulo: '¡Propuesta Aceptada!',
            mensaje: `Tu propuesta para "${tituloSolicitud}" ha sido aceptada. ¡Comienza el trabajo!`,
            datosAdicionales: {
                tipo: 'propuesta_aceptada',
                idSolicitud,
                accion: 'ver_solicitud'
            }
        });
    }

    /**
     * Envía notificación cuando se completa un servicio
     */
    async sendServiceCompletedNotification(
        idCliente: number,
        nombreTecnico: string,
        idSolicitud: number
    ): Promise<any> {
        this.logger.log(`Sending service completed notification to client: ${idCliente} for solicitud: ${idSolicitud}`);

        return this.sendToUser(idCliente, {
            titulo: 'Servicio Completado',
            mensaje: `${nombreTecnico} ha marcado el servicio como completado. ¡No olvides calificarlo!`,
            datosAdicionales: {
                tipo: 'servicio_completado',
                idSolicitud,
                accion: 'calificar_servicio'
            }
        });
    }

    /**
     * Envía notificación cuando se recibe una calificación
     */
    async sendRatingReceivedNotification(
        idTecnico: number,
        puntaje: string,
        idSolicitud: number
    ): Promise<any> {
        this.logger.log(`Sending rating received notification to technician: ${idTecnico} for solicitud: ${idSolicitud}`);

        return this.sendToUser(idTecnico, {
            titulo: 'Nueva Calificación Recibida',
            mensaje: `Has recibido una calificación de ${puntaje} por tu servicio. ¡Sigue así!`,
            datosAdicionales: {
                tipo: 'calificacion_recibida',
                idSolicitud,
                puntaje,
                accion: 'ver_calificacion'
            }
        });
    }

    /**
     * Envía notificación de recordatorio de pago
     */
    async sendPaymentReminderNotification(
        idCliente: number,
        monto: number,
        idSolicitud: number
    ): Promise<any> {
        this.logger.log(`Sending payment reminder notification to client: ${idCliente} for solicitud: ${idSolicitud}`);

        return this.sendToUser(idCliente, {
            titulo: 'Recordatorio de Pago',
            mensaje: `Tienes un pago pendiente de $${monto}. ¡Completa tu pago ahora!`,
            datosAdicionales: {
                tipo: 'recordatorio_pago',
                idSolicitud,
                monto,
                accion: 'procesar_pago'
            }
        });
    }
}

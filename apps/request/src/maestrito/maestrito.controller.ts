import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MaestritoService } from './maestrito.service';
import { MAESTRITO_PATTERNS } from '@app/events';

/**
 * Controlador del módulo Maestrito
 * Expone los endpoints de chat inteligente vía microservicios (RPC)
 */
@Controller()
export class MaestritoController {
    private readonly logger = new Logger(MaestritoController.name);

    constructor(private readonly maestritoService: MaestritoService) {}

    /**
     * Inicia una nueva sesión de chat
     *
     * @param data Payload con idUser
     * @returns ID de la sesión creada
     */
    @MessagePattern(MAESTRITO_PATTERNS.START_SESSION)
    startSession(@Payload() data: { idUser: number }) {
        try {
            this.logger.log(`Starting Maestrito session for user: ${data.idUser}`);
            const result = this.maestritoService.startSession(data.idUser);
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            this.logger.error('Error starting Maestrito session', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500,
            };
        }
    }

    /**
     * Envía un mensaje en una sesión activa
     *
     * @param data Payload con sessionId y mensaje
     * @returns Respuesta de Maestrito
     */
    @MessagePattern(MAESTRITO_PATTERNS.SEND_MESSAGE)
    async sendMessage(
        @Payload() data: { sessionId: string; message: string; idUser: number },
    ) {
        try {
            const { sessionId, message } = data;
            this.logger.log(`Maestrito message in session: ${sessionId}`);

            const response = await this.maestritoService.sendMessage(
                sessionId,
                message,
            );

            return {
                success: true,
                data: response,
            };
        } catch (error) {
            this.logger.error('Error sending Maestrito message', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500,
            };
        }
    }

    /**
     * Obtiene el historial de una sesión
     *
     * @param data Payload con sessionId
     * @returns Array de mensajes
     */
    @MessagePattern(MAESTRITO_PATTERNS.GET_SESSION_HISTORY)
    getSessionHistory(@Payload() data: { sessionId: string }) {
        try {
            this.logger.log(`Getting Maestrito session history: ${data.sessionId}`);
            const messages = this.maestritoService.getSessionHistory(data.sessionId);
            return {
                success: true,
                data: {
                    messages,
                    messageCount: messages.length,
                },
            };
        } catch (error) {
            this.logger.error('Error getting session history', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500,
            };
        }
    }

    /**
     * Finaliza una sesión manualmente
     *
     * @param data Payload con sessionId
     * @returns Confirmación
     */
    @MessagePattern(MAESTRITO_PATTERNS.END_SESSION)
    endSession(@Payload() data: { sessionId: string }) {
        try {
            this.logger.log(`Ending Maestrito session: ${data.sessionId}`);
            this.maestritoService.endSession(data.sessionId);
            return {
                success: true,
                data: {
                    message: 'Session ended successfully',
                },
            };
        } catch (error) {
            this.logger.error('Error ending session', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500,
            };
        }
    }
}

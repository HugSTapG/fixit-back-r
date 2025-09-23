import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransaccionesService } from '../services/transacciones.service';
import {
    CreateTransaccionDto,
    UpdateTransaccionDto,
    ProcesarPagoDto,
    TransaccionFilterDto
} from '../dto';
import { PAYMENT_PATTERNS } from '@app/events';

/**
 * Controlador para la gestión de transacciones y pagos en microservicio
 */
@Controller()
export class TransaccionesController {
    private readonly logger = new Logger(TransaccionesController.name);

    constructor(private readonly transaccionesService: TransaccionesService) { }

    /**
     * Obtiene todas las transacciones con filtros opcionales
     */
    @MessagePattern(PAYMENT_PATTERNS.GET_ALL_TRANSACCIONES)
    async findAll(@Payload() filterDto?: TransaccionFilterDto) {
        try {
            this.logger.log('Finding all transacciones with filters');
            const result = await this.transaccionesService.findAll(filterDto);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error('Error finding all transacciones', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Busca una transacción por su ID
     */
    @MessagePattern(PAYMENT_PATTERNS.GET_TRANSACCION)
    async findOne(@Payload() data: { idTransaccion: number }) {
        try {
            const { idTransaccion } = data;
            this.logger.log(`Finding transaccion: ${idTransaccion}`);
            const result = await this.transaccionesService.findOne(idTransaccion);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error finding transaccion: ${data.idTransaccion}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Crea una nueva transacción
     */
    @MessagePattern(PAYMENT_PATTERNS.CREATE_TRANSACCION)
    async create(@Payload() data: {
        createTransaccionDto: CreateTransaccionDto;
        currentUser: { idUser: number; rol: string }
    }) {
        try {
            const { createTransaccionDto, currentUser } = data;
            this.logger.log(`Creating transaccion for solicitud: ${createTransaccionDto.idSolicitud}`);
            const result = await this.transaccionesService.create(createTransaccionDto, currentUser);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error creating transaccion for solicitud: ${data.createTransaccionDto.idSolicitud}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Procesa un pago para una solicitud
     */
    @MessagePattern(PAYMENT_PATTERNS.PROCESAR_PAGO)
    async procesarPago(@Payload() data: {
        idSolicitud: number;
        procesarPagoDto: ProcesarPagoDto;
        currentUser: { idUser: number; rol: string }
    }) {
        try {
            const { idSolicitud, procesarPagoDto, currentUser } = data;
            this.logger.log(`Processing payment for solicitud: ${idSolicitud}`);
            const result = await this.transaccionesService.procesarPago(idSolicitud, procesarPagoDto, currentUser);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error processing payment for solicitud: ${data.idSolicitud}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Actualiza una transacción existente
     */
    @MessagePattern(PAYMENT_PATTERNS.UPDATE_TRANSACCION)
    async update(@Payload() data: {
        idTransaccion: number;
        updateTransaccionDto: UpdateTransaccionDto;
        currentUser: { idUser: number; rol: string }
    }) {
        try {
            const { idTransaccion, updateTransaccionDto, currentUser } = data;
            this.logger.log(`Updating transaccion: ${idTransaccion}`);
            const result = await this.transaccionesService.update(idTransaccion, updateTransaccionDto, currentUser);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error updating transaccion: ${data.idTransaccion}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Confirma un pago pendiente (solo administradores)
     */
    @MessagePattern(PAYMENT_PATTERNS.CONFIRMAR_PAGO)
    async confirmarPago(@Payload() data: {
        idTransaccion: number;
        currentUser: { idUser: number; rol: string }
    }) {
        try {
            const { idTransaccion, currentUser } = data;
            this.logger.log(`Confirming payment: ${idTransaccion}`);
            const result = await this.transaccionesService.confirmarPago(idTransaccion, currentUser);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error confirming payment: ${data.idTransaccion}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Marca un pago como fallido (solo administradores)
     */
    @MessagePattern(PAYMENT_PATTERNS.MARCAR_FALLIDO)
    async marcarComoFallido(@Payload() data: {
        idTransaccion: number;
        currentUser: { idUser: number; rol: string }
    }) {
        try {
            const { idTransaccion, currentUser } = data;
            this.logger.log(`Marking payment as failed: ${idTransaccion}`);
            const result = await this.transaccionesService.marcarComoFallido(idTransaccion, currentUser);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error marking payment as failed: ${data.idTransaccion}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Obtiene transacciones por solicitud
     */
    @MessagePattern(PAYMENT_PATTERNS.GET_BY_SOLICITUD)
    async findBySolicitud(@Payload() data: { idSolicitud: number }) {
        try {
            const { idSolicitud } = data;
            this.logger.log(`Finding transacciones for solicitud: ${idSolicitud}`);
            const result = await this.transaccionesService.findBySolicitud(idSolicitud);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error finding transacciones for solicitud: ${data.idSolicitud}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Obtiene transacciones por usuario
     */
    @MessagePattern(PAYMENT_PATTERNS.GET_BY_USER)
    async findByUser(@Payload() data: {
        idUser: number;
        filterDto?: TransaccionFilterDto
    }) {
        try {
            const { idUser, filterDto } = data;
            this.logger.log(`Finding transacciones for user: ${idUser}`);
            const result = await this.transaccionesService.findByUser(idUser, filterDto);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error finding transacciones for user: ${data.idUser}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Obtiene estadísticas generales de transacciones
     */
    @MessagePattern(PAYMENT_PATTERNS.GET_STATS)
    async getStats(@Payload() data?: { idUser?: number }) {
        try {
            const idUser = data?.idUser;
            // CORREGIDO: Simplificar el mensaje de log para evitar template literals anidados
            const logMessage = idUser ? `Getting payment stats for user: ${idUser}` : 'Getting payment stats';
            this.logger.log(logMessage);
            const result = await this.transaccionesService.getStats(idUser);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error('Error getting payment stats', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Obtiene estadísticas por método de pago
     */
    @MessagePattern(PAYMENT_PATTERNS.GET_STATS_BY_METODO)
    async getStatsByMetodoPago(@Payload() data?: { idUser?: number }) {
        try {
            const idUser = data?.idUser;
            // CORREGIDO: Simplificar el mensaje de log para evitar template literals anidados
            const logMessage = idUser ? `Getting payment stats by method for user: ${idUser}` : 'Getting payment stats by method';
            this.logger.log(logMessage);
            const result = await this.transaccionesService.getStatsByMetodoPago(idUser);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error('Error getting payment stats by method', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Obtiene estadísticas del usuario específico
     */
    @MessagePattern(PAYMENT_PATTERNS.GET_USER_STATS)
    async getUserStats(@Payload() data: { idUser: number }) {
        try {
            const { idUser } = data;
            this.logger.log(`Getting user stats: ${idUser}`);
            const result = await this.transaccionesService.getStats(idUser);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error getting user stats: ${data.idUser}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    /**
     * Obtiene estadísticas por método de pago del usuario específico
     */
    @MessagePattern(PAYMENT_PATTERNS.GET_USER_STATS_BY_METODO)
    async getUserStatsByMetodoPago(@Payload() data: { idUser: number }) {
        try {
            const { idUser } = data;
            this.logger.log(`Getting user stats by method: ${idUser}`);
            const result = await this.transaccionesService.getStatsByMetodoPago(idUser);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error getting user stats by method: ${data.idUser}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }
}

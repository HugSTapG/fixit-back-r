import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SolicitudesService } from '../services/solicitudes.service';
import { CreateSolicitudDto, UpdateSolicitudDto, SolicitudFilterDto } from '../dto';
import { REQUEST_PATTERNS } from '@app/events';

@Controller()
export class SolicitudesController {
    private readonly logger = new Logger(SolicitudesController.name);

    constructor(private readonly solicitudesService: SolicitudesService) { }

    @MessagePattern(REQUEST_PATTERNS.FIND_ALL_SOLICITUDES)
    async findAll(@Payload() data: { filterDto?: SolicitudFilterDto }) {
        try {
            this.logger.log('Getting all solicitudes');
            const result = await this.solicitudesService.findAll(data.filterDto);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error('Error getting solicitudes', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(REQUEST_PATTERNS.FIND_SOLICITUD_BY_ID)
    async findOne(@Payload() data: { idSolicitud: number }) {
        try {
            this.logger.log(`Getting solicitud: ${data.idSolicitud}`);
            const solicitud = await this.solicitudesService.findOne(data.idSolicitud);
            return { success: true, data: solicitud };
        } catch (error) {
            this.logger.error(`Error getting solicitud: ${data.idSolicitud}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(REQUEST_PATTERNS.CREATE_SOLICITUD)
    async create(@Payload() data: { createSolicitudDto: CreateSolicitudDto; idUser: number }) {
        try {
            const { createSolicitudDto, idUser } = data;
            this.logger.log(`Creating solicitud for user: ${idUser}`);
            const solicitud = await this.solicitudesService.create(createSolicitudDto, idUser);
            return { success: true, data: solicitud };
        } catch (error) {
            this.logger.error(`Error creating solicitud for user: ${data.idUser}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(REQUEST_PATTERNS.UPDATE_SOLICITUD)
    async update(@Payload() data: {
        idSolicitud: number;
        updateSolicitudDto: UpdateSolicitudDto;
        currentUser: { idUser: number; rol: string }
    }) {
        try {
            const { idSolicitud, updateSolicitudDto, currentUser } = data;
            this.logger.log(`Updating solicitud: ${idSolicitud}`);
            const solicitud = await this.solicitudesService.update(idSolicitud, updateSolicitudDto, currentUser);
            return { success: true, data: solicitud };
        } catch (error) {
            this.logger.error(`Error updating solicitud: ${data.idSolicitud}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(REQUEST_PATTERNS.CANCEL_SOLICITUD)
    async cancel(@Payload() data: {
        idSolicitud: number;
        currentUser: { idUser: number; rol: string }
    }) {
        try {
            const { idSolicitud, currentUser } = data;
            this.logger.log(`Cancelling solicitud: ${idSolicitud}`);
            const result = await this.solicitudesService.cancel(idSolicitud, currentUser);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error cancelling solicitud: ${data.idSolicitud}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(REQUEST_PATTERNS.GET_SOLICITUDES_STATS)
    async getStats(@Payload() data: { idUser?: number }) {
        try {
            this.logger.log(`Getting solicitudes stats for user: ${data.idUser || 'all'}`);
            const stats = await this.solicitudesService.getStats(data.idUser);
            return { success: true, data: stats };
        } catch (error) {
            this.logger.error('Error getting solicitudes stats', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(REQUEST_PATTERNS.FIND_SOLICITUDES_BY_USER)
    async findByUser(@Payload() data: { idUser: number; filterDto?: SolicitudFilterDto }) {
        try {
            const { idUser, filterDto } = data;
            this.logger.log(`Getting solicitudes for user: ${idUser}`);
            const result = await this.solicitudesService.findByUser(idUser, filterDto);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error getting solicitudes for user: ${data.idUser}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }
}

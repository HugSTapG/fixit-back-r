import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SolicitudesTecnicosService } from '../services/solicitudes-tecnicos.service';
import {
    CreateSolicitudTecnicoDto,
    ResponderSolicitudDto
} from '../dto';
import { REQUEST_PATTERNS } from '@app/events';

@Controller()
export class SolicitudesTecnicosController {
    private readonly logger = new Logger(SolicitudesTecnicosController.name);

    constructor(
        private readonly solicitudesTecnicosService: SolicitudesTecnicosService
    ) { }

    @MessagePattern(REQUEST_PATTERNS.FIND_ALL_SOLICITUDES_TECNICOS)
    async findAll() {
        try {
            this.logger.log('Getting all solicitudes-tecnicos');
            const result = await this.solicitudesTecnicosService.findAll();
            return { success: true, data: result };
        } catch (error) {
            this.logger.error('Error getting solicitudes-tecnicos', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(REQUEST_PATTERNS.FIND_SOLICITUD_TECNICO_BY_ID)
    async findOne(@Payload() data: { idSolTec: number }) {
        try {
            this.logger.log(`Getting solicitud-tecnico: ${data.idSolTec}`);
            const result = await this.solicitudesTecnicosService.findOne(data.idSolTec);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error getting solicitud-tecnico: ${data.idSolTec}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(REQUEST_PATTERNS.POSTULARSE_SOLICITUD)
    async postularse(@Payload() data: {
        createDto: CreateSolicitudTecnicoDto;
        idTecnico: number
    }) {
        try {
            const { createDto, idTecnico } = data;
            this.logger.log(`Tecnico ${idTecnico} postulándose a solicitud ${createDto.idSolicitud}`);
            const result = await this.solicitudesTecnicosService.postularse(createDto, idTecnico);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error en postulación`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(REQUEST_PATTERNS.RESPONDER_SOLICITUD)
    async responder(@Payload() data: {
        idSolTec: number;
        respuestaDto: ResponderSolicitudDto;
        currentUser: { idUser: number; rol: string }
    }) {
        try {
            const { idSolTec, respuestaDto, currentUser } = data;
            this.logger.log(`Respondiendo a solicitud-tecnico: ${idSolTec}`);
            const result = await this.solicitudesTecnicosService.responder(idSolTec, respuestaDto, currentUser);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error respondiendo solicitud-tecnico: ${data.idSolTec}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(REQUEST_PATTERNS.FIND_SOLICITUDES_BY_TECNICO)
    async findByTecnico(@Payload() data: { idTecnico: number }) {
        try {
            this.logger.log(`Getting solicitudes for tecnico: ${data.idTecnico}`);
            const result = await this.solicitudesTecnicosService.findByTecnico(data.idTecnico);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error getting solicitudes for tecnico: ${data.idTecnico}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(REQUEST_PATTERNS.GET_STATS_BY_TECNICO)
    async getStatsByTecnico(@Payload() data: { idTecnico: number }) {
        try {
            this.logger.log(`Getting stats for tecnico: ${data.idTecnico}`);
            const result = await this.solicitudesTecnicosService.getStatsByTecnico(data.idTecnico);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error getting stats for tecnico: ${data.idTecnico}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }
}

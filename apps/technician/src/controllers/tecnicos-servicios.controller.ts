
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TecnicosServiciosService } from '../services/tecnicos-servicios.service';
import { CreateTecnicoServicioDto } from '../dto';
import { TECHNICIAN_PATTERNS } from '@app/events';

@Controller()
export class TecnicosServiciosController {
    private readonly logger = new Logger(TecnicosServiciosController.name);

    constructor(private readonly tecnicosServiciosService: TecnicosServiciosService) { }

    @MessagePattern(TECHNICIAN_PATTERNS.FIND_ALL_TECNICO_SERVICIOS)
    async findAll() {
        try {
            this.logger.log('Getting all tecnico-servicio assignments');
            const asignaciones = await this.tecnicosServiciosService.findAll();
            return { success: true, data: asignaciones };
        } catch (error) {
            this.logger.error('Error getting tecnico-servicio assignments', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.CREATE_TECNICO_SERVICIO)
    async create(@Payload() data: {
        idTecnico: number;
        createTecnicoServicioDto: CreateTecnicoServicioDto;
        currentUser: any
    }) {
        try {
            const { idTecnico, createTecnicoServicioDto, currentUser } = data;
            this.logger.log(`Assigning servicio ${createTecnicoServicioDto.idTipoServicio} to tecnico ${idTecnico}`);
            const asignacion = await this.tecnicosServiciosService.create(idTecnico, createTecnicoServicioDto, currentUser);
            return { success: true, data: asignacion };
        } catch (error) {
            this.logger.error(`Error assigning servicio to tecnico: ${data.idTecnico}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.DELETE_TECNICO_SERVICIO)
    async remove(@Payload() data: {
        idTecnico: number;
        idTipoServicio: number;
        currentUser: any
    }) {
        try {
            const { idTecnico, idTipoServicio, currentUser } = data;
            this.logger.log(`Removing servicio ${idTipoServicio} from tecnico ${idTecnico}`);
            const result = await this.tecnicosServiciosService.remove(idTecnico, idTipoServicio, currentUser);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error removing servicio assignment: ${data.idTecnico}-${data.idTipoServicio}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.FIND_SERVICIOS_BY_TECNICO)
    async findByTecnico(@Payload() data: { idTecnico: number }) {
        try {
            this.logger.log(`Getting servicios for tecnico: ${data.idTecnico}`);
            const servicios = await this.tecnicosServiciosService.findByTecnico(data.idTecnico);
            return { success: true, data: servicios };
        } catch (error) {
            this.logger.error(`Error getting servicios for tecnico: ${data.idTecnico}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.FIND_TECNICOS_BY_SERVICIO)
    async findByTipoServicio(@Payload() data: { idTipoServicio: number }) {
        try {
            this.logger.log(`Getting tecnicos for servicio: ${data.idTipoServicio}`);
            const tecnicos = await this.tecnicosServiciosService.findByTipoServicio(data.idTipoServicio);
            return { success: true, data: tecnicos };
        } catch (error) {
            this.logger.error(`Error getting tecnicos for servicio: ${data.idTipoServicio}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }
}

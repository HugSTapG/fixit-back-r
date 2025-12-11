import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TecnicosService } from '../services/tecnicos.service';
import { CreateTecnicoDto, UpdateTecnicoDto, TecnicoFilterDto } from '../dto';
import { TECHNICIAN_PATTERNS } from '@app/events';

@Controller()
export class TecnicosController {
    private readonly logger = new Logger(TecnicosController.name);

    constructor(private readonly tecnicosService: TecnicosService) { }

    @MessagePattern(TECHNICIAN_PATTERNS.FIND_ALL_TECHNICIANS)
    async findAll(@Payload() filterDto?: TecnicoFilterDto) {
        try {
            this.logger.log('Getting all technicians with filters', filterDto);
            const result = await this.tecnicosService.findAll(filterDto);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error('Error getting all technicians', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.FIND_TECHNICIAN_BY_ID)
    async findOne(@Payload() data: { idTecnico: number }) {
        try {
            this.logger.log(`Getting technician: ${data.idTecnico}`);
            const tecnico = await this.tecnicosService.findOne(data.idTecnico);
            return { success: true, data: tecnico };
        } catch (error) {
            this.logger.error(`Error getting technician: ${data.idTecnico}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.FIND_TECHNICIAN_BY_USER_ID)
    async findByUserId(@Payload() data: { idUser: number }) {
        try {
            this.logger.log(`Getting technician by user ID: ${data.idUser}`);
            const tecnico = await this.tecnicosService.findByUserId(data.idUser);
            return { success: true, data: tecnico };
        } catch (error) {
            this.logger.error(`Error getting technician by user ID: ${data.idUser}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.CREATE_TECHNICIAN)
    async create(@Payload() data: { createTecnicoDto: CreateTecnicoDto; currentUser: any }) {
        try {
            this.logger.log(`Creating technician for user: ${data.createTecnicoDto.idUser}`);
            const tecnico = await this.tecnicosService.create(data.createTecnicoDto);
            return { success: true, data: tecnico };
        } catch (error) {
            this.logger.error(`Error creating technician: ${data.createTecnicoDto.idUser}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.UPDATE_TECHNICIAN)
    async update(@Payload() data: { idTecnico: number; updateTecnicoDto: UpdateTecnicoDto; currentUser: any }) {
        try {
            const { idTecnico, updateTecnicoDto, currentUser } = data;
            this.logger.log(`Updating technician: ${idTecnico}`);
            const tecnico = await this.tecnicosService.update(idTecnico, updateTecnicoDto, currentUser);
            return { success: true, data: tecnico };
        } catch (error) {
            this.logger.error(`Error updating technician: ${data.idTecnico}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.DEACTIVATE_TECHNICIAN)
    async deactivate(@Payload() data: { idTecnico: number; currentUser: any }) {
        try {
            const { idTecnico, currentUser } = data;
            this.logger.log(`Deactivating technician: ${idTecnico}`);
            const tecnico = await this.tecnicosService.deactivate(idTecnico, currentUser);
            return { success: true, data: tecnico };
        } catch (error) {
            this.logger.error(`Error deactivating technician: ${data.idTecnico}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.FIND_TECHNICIANS_BY_PARROQUIA)
    async findByParroquia(@Payload() data: { codigoParroquia: string; filterDto?: TecnicoFilterDto }) {
        try {
            const { codigoParroquia, filterDto } = data;
            this.logger.log(`Getting technicians by parroquia: ${codigoParroquia}`);
            const result = await this.tecnicosService.findByParroquia(codigoParroquia, filterDto);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error getting technicians by parroquia: ${data.codigoParroquia}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.FIND_TECHNICIANS_BY_TIPO_SERVICIO)
    async findByTipoServicio(@Payload() data: { idTipoServicio: number; filterDto?: TecnicoFilterDto }) {
        try {
            const { idTipoServicio, filterDto } = data;
            this.logger.log(`Getting technicians by service type: ${idTipoServicio}`);
            const result = await this.tecnicosService.findByTipoServicio(idTipoServicio, filterDto);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error getting technicians by service type: ${data.idTipoServicio}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.GET_TOP_RATED_TECHNICIANS)
    async getTopRated(@Payload() data: { limit?: number }) {
        try {
            const { limit = 10 } = data;
            this.logger.log(`Getting top rated technicians (limit: ${limit})`);
            const tecnicos = await this.tecnicosService.getTopRated(limit);
            return { success: true, data: tecnicos };
        } catch (error) {
            this.logger.error('Error getting top rated technicians', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.FIND_AVAILABLE_FOR_REQUEST)
    async findAvailableForRequest(@Payload() data: { 
        idSolicitud: number; 
        codigoParroquia?: string; 
        idTipoServicio?: number 
    }) {
        try {
            const { idSolicitud, codigoParroquia, idTipoServicio } = data;
            this.logger.log(`Finding available technicians for request: ${idSolicitud}`);
            const tecnicos = await this.tecnicosService.findAvailableForRequest(
                idSolicitud, 
                codigoParroquia, 
                idTipoServicio
            );
            return { success: true, data: tecnicos };
        } catch (error) {
            this.logger.error(`Error finding available technicians for request: ${data.idSolicitud}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.GET_TECHNICIAN_STATS)
    async getStats() {
        try {
            this.logger.log('Getting technician statistics');
            const stats = await this.tecnicosService.getStats();
            return { success: true, data: stats };
        } catch (error) {
            this.logger.error('Error getting technician statistics', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }
}
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TiposServiciosService } from '../services/tipos-servicios.service';
import { CreateTipoServicioDto, UpdateTipoServicioDto } from '../dto';
import { TECHNICIAN_PATTERNS } from '@app/events';

@Controller()
export class TiposServiciosController {
    private readonly logger = new Logger(TiposServiciosController.name);

    constructor(private readonly tiposServiciosService: TiposServiciosService) { }

    @MessagePattern(TECHNICIAN_PATTERNS.FIND_ALL_TIPOS_SERVICIOS)
    async findAll() {
        try {
            this.logger.log('Getting all tipos de servicios');
            const tiposServicios = await this.tiposServiciosService.findAll();
            return { success: true, data: tiposServicios };
        } catch (error) {
            this.logger.error('Error getting tipos de servicios', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.FIND_TIPO_SERVICIO_BY_ID)
    async findOne(@Payload() data: { idTipoServicio: number }) {
        try {
            this.logger.log(`Getting tipo de servicio: ${data.idTipoServicio}`);
            const tipoServicio = await this.tiposServiciosService.findOne(data.idTipoServicio);
            return { success: true, data: tipoServicio };
        } catch (error) {
            this.logger.error(`Error getting tipo de servicio: ${data.idTipoServicio}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.CREATE_TIPO_SERVICIO)
    async create(@Payload() data: { createTipoServicioDto: CreateTipoServicioDto; currentUser: any }) {
        try {
            const { createTipoServicioDto, currentUser } = data;
            this.logger.log(`Creating tipo de servicio: ${createTipoServicioDto.nombreServicio}`);
            const tipoServicio = await this.tiposServiciosService.create(createTipoServicioDto, currentUser);
            return { success: true, data: tipoServicio };
        } catch (error) {
            this.logger.error(`Error creating tipo de servicio: ${data.createTipoServicioDto.nombreServicio}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.UPDATE_TIPO_SERVICIO)
    async update(@Payload() data: {
        idTipoServicio: number;
        updateTipoServicioDto: UpdateTipoServicioDto;
        currentUser: any
    }) {
        try {
            const { idTipoServicio, updateTipoServicioDto, currentUser } = data;
            this.logger.log(`Updating tipo de servicio: ${idTipoServicio}`);
            const tipoServicio = await this.tiposServiciosService.update(idTipoServicio, updateTipoServicioDto, currentUser);
            return { success: true, data: tipoServicio };
        } catch (error) {
            this.logger.error(`Error updating tipo de servicio: ${data.idTipoServicio}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.DELETE_TIPO_SERVICIO)
    async remove(@Payload() data: { idTipoServicio: number; currentUser: any }) {
        try {
            const { idTipoServicio, currentUser } = data;
            this.logger.log(`Deleting tipo de servicio: ${idTipoServicio}`);
            const result = await this.tiposServiciosService.remove(idTipoServicio, currentUser);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error deleting tipo de servicio: ${data.idTipoServicio}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.GET_TIPO_SERVICIO_STATS)
    async getStats() {
        try {
            this.logger.log('Getting tipo servicio statistics');
            const stats = await this.tiposServiciosService.getStats();
            return { success: true, data: stats };
        } catch (error) {
            this.logger.error('Error getting tipo servicio statistics', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }
}

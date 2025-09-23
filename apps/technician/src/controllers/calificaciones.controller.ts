import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CalificacionesService } from '../services/calificaciones.service';
import { CreateCalificacionDto, UpdateCalificacionDto } from '../dto';
import { TECHNICIAN_PATTERNS } from '@app/events';

@Controller()
export class CalificacionesController {
    private readonly logger = new Logger(CalificacionesController.name);

    constructor(private readonly calificacionesService: CalificacionesService) { }

    @MessagePattern(TECHNICIAN_PATTERNS.CREATE_CALIFICACION)
    async create(@Payload() data: { createCalificacionDto: CreateCalificacionDto; currentUser: any }) {
        try {
            const { createCalificacionDto, currentUser } = data;
            this.logger.log(`Creating calificacion for tecnico: ${createCalificacionDto.idTecnico}`);
            const calificacion = await this.calificacionesService.create(createCalificacionDto, currentUser);
            return { success: true, data: calificacion };
        } catch (error) {
            this.logger.error(`Error creating calificacion: ${data.createCalificacionDto.idTecnico}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.UPDATE_CALIFICACION)
    async update(@Payload() data: {
        idCalificacion: number;
        updateCalificacionDto: UpdateCalificacionDto;
        currentUser: any
    }) {
        try {
            const { idCalificacion, updateCalificacionDto, currentUser } = data;
            this.logger.log(`Updating calificacion: ${idCalificacion}`);
            const calificacion = await this.calificacionesService.update(idCalificacion, updateCalificacionDto, currentUser);
            return { success: true, data: calificacion };
        } catch (error) {
            this.logger.error(`Error updating calificacion: ${data.idCalificacion}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.FIND_CALIFICACIONES_BY_TECNICO)
    async findByTecnico(@Payload() data: { idTecnico: number; filterDto?: any }) {
        try {
            const { idTecnico, filterDto } = data;
            this.logger.log(`Getting calificaciones for tecnico: ${idTecnico}`);
            const calificaciones = await this.calificacionesService.findByTecnico(idTecnico, filterDto);
            return { success: true, data: calificaciones };
        } catch (error) {
            this.logger.error(`Error getting calificaciones for tecnico: ${data.idTecnico}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.UPDATE_PROMEDIO_CALIFICACIONES)
    async updatePromedio(@Payload() data: { idTecnico: number }) {
        try {
            const { idTecnico } = data;
            this.logger.log(`Updating promedio calificaciones for tecnico: ${idTecnico}`);
            const result = await this.calificacionesService.updatePromedioCalificaciones(idTecnico);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error updating promedio for tecnico: ${data.idTecnico}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }
}

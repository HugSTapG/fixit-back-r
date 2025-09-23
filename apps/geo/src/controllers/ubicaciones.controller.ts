import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UbicacionesService } from '../services/ubicaciones.service';
import { CreateUbicacionDto, UpdateUbicacionDto } from '../dto';
import { GEO_PATTERNS } from '@app/events';

@Controller()
export class UbicacionesController {
    private readonly logger = new Logger(UbicacionesController.name);

    constructor(private readonly ubicacionesService: UbicacionesService) { }

    @MessagePattern(GEO_PATTERNS.GET_UBICACIONES)
    async findAll(@Payload() filters: any) {
        try {
            this.logger.log(`Getting ubicaciones with filters:`, filters);
            const ubicaciones = await this.ubicacionesService.findAll(
                filters.codigoParroquia,
                filters.nearbyLocation,
                filters.maxDistance
            );
            return { success: true, data: ubicaciones };
        } catch (error) {
            this.logger.error('Error getting ubicaciones', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(GEO_PATTERNS.GET_UBICACION)
    async findOne(@Payload() data: { idUbicacion: number }) {
        try {
            this.logger.log(`Getting ubicacion: ${data.idUbicacion}`);
            const ubicacion = await this.ubicacionesService.findOne(data.idUbicacion);
            return { success: true, data: ubicacion };
        } catch (error) {
            this.logger.error(`Error getting ubicacion: ${data.idUbicacion}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(GEO_PATTERNS.GET_UBICACIONES_BY_PARROQUIA)
    async findByParroquia(@Payload() data: { codigoParroquia: string }) {
        try {
            this.logger.log(`Getting ubicaciones for parroquia: ${data.codigoParroquia}`);
            const ubicaciones = await this.ubicacionesService.findByParroquia(data.codigoParroquia);
            return { success: true, data: ubicaciones };
        } catch (error) {
            this.logger.error(`Error getting ubicaciones for parroquia: ${data.codigoParroquia}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(GEO_PATTERNS.CREATE_UBICACION)
    async create(@Payload() createUbicacionDto: CreateUbicacionDto) {
        try {
            this.logger.log(`Creating ubicacion: ${createUbicacionDto.nombreUbicacion}`);
            const ubicacion = await this.ubicacionesService.create(createUbicacionDto);
            return { success: true, data: ubicacion };
        } catch (error) {
            this.logger.error(`Error creating ubicacion: ${createUbicacionDto.nombreUbicacion}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(GEO_PATTERNS.UPDATE_UBICACION)
    async update(@Payload() data: { idUbicacion: number;[key: string]: any }) {
        try {
            const { idUbicacion, ...updateUbicacionDto } = data;
            this.logger.log(`Updating ubicacion: ${idUbicacion}`);
            const ubicacion = await this.ubicacionesService.update(idUbicacion, updateUbicacionDto as UpdateUbicacionDto);
            return { success: true, data: ubicacion };
        } catch (error) {
            this.logger.error(`Error updating ubicacion: ${data.idUbicacion}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(GEO_PATTERNS.DELETE_UBICACION)
    async remove(@Payload() data: { idUbicacion: number }) {
        try {
            this.logger.log(`Deleting ubicacion: ${data.idUbicacion}`);
            const ubicacion = await this.ubicacionesService.remove(data.idUbicacion);
            return { success: true, data: ubicacion };
        } catch (error) {
            this.logger.error(`Error deleting ubicacion: ${data.idUbicacion}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }
}

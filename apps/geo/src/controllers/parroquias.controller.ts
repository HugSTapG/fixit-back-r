import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ParroquiasService } from '../services/parroquias.service';
import { CreateParroquiaDto, UpdateParroquiaDto } from '../dto';
import { GEO_PATTERNS } from '@app/events';

@Controller()
export class ParroquiasController {
    private readonly logger = new Logger(ParroquiasController.name);

    constructor(private readonly parroquiasService: ParroquiasService) { }

    @MessagePattern(GEO_PATTERNS.GET_PARROQUIAS)
    async findAll(@Payload() data: { codigoCanton?: string }) {
        try {
            this.logger.log(`Getting parroquias for canton: ${data.codigoCanton || 'all'}`);
            if (data.codigoCanton) {
                const parroquias = await this.parroquiasService.findByCanton(data.codigoCanton);
                return { success: true, data: parroquias };
            }
            const parroquias = await this.parroquiasService.findAll();
            return { success: true, data: parroquias };
        } catch (error) {
            this.logger.error(`Error getting parroquias for canton: ${data.codigoCanton || 'all'}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(GEO_PATTERNS.GET_PARROQUIA)
    async findOne(@Payload() data: { codigoParroquia: string }) {
        try {
            this.logger.log(`Getting parroquia: ${data.codigoParroquia}`);
            const parroquia = await this.parroquiasService.findOne(data.codigoParroquia);
            return { success: true, data: parroquia };
        } catch (error) {
            this.logger.error(`Error getting parroquia: ${data.codigoParroquia}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(GEO_PATTERNS.CREATE_PARROQUIA)
    async create(@Payload() createParroquiaDto: CreateParroquiaDto) {
        try {
            this.logger.log(`Creating parroquia: ${createParroquiaDto.codigoParroquia}`);
            const parroquia = await this.parroquiasService.create(createParroquiaDto);
            return { success: true, data: parroquia };
        } catch (error) {
            this.logger.error(`Error creating parroquia: ${createParroquiaDto.codigoParroquia}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(GEO_PATTERNS.UPDATE_PARROQUIA)
    async update(@Payload() data: { codigoParroquia: string;[key: string]: any }) {
        try {
            const { codigoParroquia, ...updateParroquiaDto } = data;
            this.logger.log(`Updating parroquia: ${codigoParroquia}`);
            const parroquia = await this.parroquiasService.update(codigoParroquia, updateParroquiaDto as UpdateParroquiaDto);
            return { success: true, data: parroquia };
        } catch (error) {
            this.logger.error(`Error updating parroquia: ${data.codigoParroquia}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(GEO_PATTERNS.DELETE_PARROQUIA)
    async remove(@Payload() data: { codigoParroquia: string }) {
        try {
            this.logger.log(`Deleting parroquia: ${data.codigoParroquia}`);
            const parroquia = await this.parroquiasService.remove(data.codigoParroquia);
            return { success: true, data: parroquia };
        } catch (error) {
            this.logger.error(`Error deleting parroquia: ${data.codigoParroquia}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }
}

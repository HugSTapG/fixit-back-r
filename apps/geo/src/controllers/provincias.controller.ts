import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProvinciasService } from '../services/provincias.service';
import { CreateProvinciaDto, UpdateProvinciaDto } from '../dto';
import { GEO_PATTERNS } from '@app/events';

@Controller()
export class ProvinciasController {
    private readonly logger = new Logger(ProvinciasController.name);

    constructor(private readonly provinciasService: ProvinciasService) { }

    @MessagePattern(GEO_PATTERNS.GET_PROVINCIAS)
    async findAll() {
        try {
            this.logger.log('Getting all provincias');
            const provincias = await this.provinciasService.findAll();
            return { success: true, data: provincias };
        } catch (error) {
            this.logger.error('Error getting provincias', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(GEO_PATTERNS.GET_PROVINCIA)
    async findOne(@Payload() data: { codigoProvincia: string }) {
        try {
            this.logger.log(`Getting provincia: ${data.codigoProvincia}`);
            const provincia = await this.provinciasService.findOne(data.codigoProvincia);
            return { success: true, data: provincia };
        } catch (error) {
            this.logger.error(`Error getting provincia: ${data.codigoProvincia}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(GEO_PATTERNS.CREATE_PROVINCIA)
    async create(@Payload() createProvinciaDto: CreateProvinciaDto) {
        try {
            this.logger.log(`Creating provincia: ${createProvinciaDto.codigoProvincia}`);
            const provincia = await this.provinciasService.create(createProvinciaDto);
            return { success: true, data: provincia };
        } catch (error) {
            this.logger.error(`Error creating provincia: ${createProvinciaDto.codigoProvincia}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(GEO_PATTERNS.UPDATE_PROVINCIA)
    async update(@Payload() data: { codigoProvincia: string;[key: string]: any }) {
        try {
            const { codigoProvincia, ...updateProvinciaDto } = data;
            this.logger.log(`Updating provincia: ${codigoProvincia}`);
            const provincia = await this.provinciasService.update(codigoProvincia, updateProvinciaDto as UpdateProvinciaDto);
            return { success: true, data: provincia };
        } catch (error) {
            this.logger.error(`Error updating provincia: ${data.codigoProvincia}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(GEO_PATTERNS.DELETE_PROVINCIA)
    async remove(@Payload() data: { codigoProvincia: string }) {
        try {
            this.logger.log(`Deleting provincia: ${data.codigoProvincia}`);
            const provincia = await this.provinciasService.remove(data.codigoProvincia);
            return { success: true, data: provincia };
        } catch (error) {
            this.logger.error(`Error deleting provincia: ${data.codigoProvincia}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }
}

import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CantonesService } from '../services/cantones.service';
import { CreateCantonDto, UpdateCantonDto } from '../dto';
import { GEO_PATTERNS } from '@app/events';

@Controller()
export class CantonesController {
    private readonly logger = new Logger(CantonesController.name);

    constructor(private readonly cantonesService: CantonesService) { }

    @MessagePattern(GEO_PATTERNS.GET_CANTONES)
    async findAll(@Payload() data: { codigoProvincia?: string }) {
        try {
            this.logger.log(`Getting cantones for provincia: ${data.codigoProvincia || 'all'}`);
            if (data.codigoProvincia) {
                const cantones = await this.cantonesService.findByProvincia(data.codigoProvincia);
                return { success: true, data: cantones };
            }
            const cantones = await this.cantonesService.findAll();
            return { success: true, data: cantones };
        } catch (error) {
            this.logger.error(`Error getting cantones for provincia: ${data.codigoProvincia || 'all'}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(GEO_PATTERNS.GET_CANTON)
    async findOne(@Payload() data: { codigoCanton: string }) {
        try {
            this.logger.log(`Getting canton: ${data.codigoCanton}`);
            const canton = await this.cantonesService.findOne(data.codigoCanton);
            return { success: true, data: canton };
        } catch (error) {
            this.logger.error(`Error getting canton: ${data.codigoCanton}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(GEO_PATTERNS.CREATE_CANTON)
    async create(@Payload() createCantonDto: CreateCantonDto) {
        try {
            this.logger.log(`Creating canton: ${createCantonDto.codigoCanton}`);
            const canton = await this.cantonesService.create(createCantonDto);
            return { success: true, data: canton };
        } catch (error) {
            this.logger.error(`Error creating canton: ${createCantonDto.codigoCanton}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(GEO_PATTERNS.UPDATE_CANTON)
    async update(@Payload() data: { codigoCanton: string;[key: string]: any }) {
        try {
            const { codigoCanton, ...updateCantonDto } = data;
            this.logger.log(`Updating canton: ${codigoCanton}`);
            const canton = await this.cantonesService.update(codigoCanton, updateCantonDto as UpdateCantonDto);
            return { success: true, data: canton };
        } catch (error) {
            this.logger.error(`Error updating canton: ${data.codigoCanton}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(GEO_PATTERNS.DELETE_CANTON)
    async remove(@Payload() data: { codigoCanton: string }) {
        try {
            this.logger.log(`Deleting canton: ${data.codigoCanton}`);
            const canton = await this.cantonesService.remove(data.codigoCanton);
            return { success: true, data: canton };
        } catch (error) {
            this.logger.error(`Error deleting canton: ${data.codigoCanton}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }
}

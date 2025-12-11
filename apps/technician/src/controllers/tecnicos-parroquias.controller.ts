import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TecnicosParroquiasService } from '../services/tecnicos-parroquias.service';
import { CreateTecnicoParroquiaDto } from '../dto';
import { TECHNICIAN_PATTERNS } from '@app/events';

@Controller()
export class TecnicosParroquiasController {
    private readonly logger = new Logger(TecnicosParroquiasController.name);

    constructor(private readonly tecnicosParroquiasService: TecnicosParroquiasService) { }

    @MessagePattern(TECHNICIAN_PATTERNS.FIND_ALL_TECNICO_PARROQUIAS)
    async findAll() {
        try {
            this.logger.log('Getting all tecnico-parroquia assignments');
            const asignaciones = await this.tecnicosParroquiasService.findAll();
            return { success: true, data: asignaciones };
        } catch (error) {
            this.logger.error('Error getting tecnico-parroquia assignments', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.CREATE_TECNICO_PARROQUIA)
    async create(@Payload() data: {
        idTecnico: number;
        createTecnicoParroquiaDto: CreateTecnicoParroquiaDto;
        currentUser: any
    }) {
        try {
            const { idTecnico, createTecnicoParroquiaDto, currentUser } = data;
            this.logger.log(`Assigning parroquia ${createTecnicoParroquiaDto.codigoParroquia} to tecnico ${idTecnico}`);
            const asignacion = await this.tecnicosParroquiasService.create(idTecnico, createTecnicoParroquiaDto, currentUser);
            return { success: true, data: asignacion };
        } catch (error) {
            this.logger.error(`Error assigning parroquia to tecnico: ${data.idTecnico}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.DELETE_TECNICO_PARROQUIA)
    async remove(@Payload() data: {
        idTecnico: number;
        codigoParroquia: string;
        currentUser: any
    }) {
        try {
            const { idTecnico, codigoParroquia, currentUser } = data;
            this.logger.log(`Removing parroquia ${codigoParroquia} from tecnico ${idTecnico}`);
            const result = await this.tecnicosParroquiasService.remove(idTecnico, codigoParroquia, currentUser);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error removing parroquia assignment: ${data.idTecnico}-${data.codigoParroquia}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.FIND_PARROQUIAS_BY_TECNICO)
    async findByTecnico(@Payload() data: { idTecnico: number }) {
        try {
            this.logger.log(`Getting parroquias for tecnico: ${data.idTecnico}`);
            const parroquias = await this.tecnicosParroquiasService.findByTecnico(data.idTecnico);
            return { success: true, data: parroquias };
        } catch (error) {
            this.logger.error(`Error getting parroquias for tecnico: ${data.idTecnico}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.FIND_TECNICOS_BY_PARROQUIA)
    async findByParroquia(@Payload() data: { codigoParroquia: string }) {
        try {
            this.logger.log(`Getting tecnicos for parroquia: ${data.codigoParroquia}`);
            const tecnicos = await this.tecnicosParroquiasService.findByParroquia(data.codigoParroquia);
            return { success: true, data: tecnicos };
        } catch (error) {
            this.logger.error(`Error getting tecnicos for parroquia: ${data.codigoParroquia}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }
}

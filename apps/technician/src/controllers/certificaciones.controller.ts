import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CertificacionesService } from '../services/certificaciones.service';
import { CreateCertificacionDto, UpdateCertificacionDto } from '../dto';
import { TECHNICIAN_PATTERNS } from '@app/events';

@Controller()
export class CertificacionesController {
    private readonly logger = new Logger(CertificacionesController.name);

    constructor(private readonly certificacionesService: CertificacionesService) { }

    @MessagePattern(TECHNICIAN_PATTERNS.FIND_ALL_CERTIFICACIONES)
    async findAll() {
        try {
            this.logger.log('Getting all certificaciones');
            const certificaciones = await this.certificacionesService.findAll();
            return { success: true, data: certificaciones };
        } catch (error) {
            this.logger.error('Error getting certificaciones', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.FIND_CERTIFICACION_BY_ID)
    async findOne(@Payload() data: { idCertificacion: number }) {
        try {
            this.logger.log(`Getting certificacion: ${data.idCertificacion}`);
            const certificacion = await this.certificacionesService.findOne(data.idCertificacion);
            return { success: true, data: certificacion };
        } catch (error) {
            this.logger.error(`Error getting certificacion: ${data.idCertificacion}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.CREATE_CERTIFICACION)
    async create(@Payload() data: { createCertificacionDto: CreateCertificacionDto; currentUser: any }) {
        try {
            const { createCertificacionDto, currentUser } = data;
            this.logger.log(`Creating certificacion: ${createCertificacionDto.nombreCertificacion}`);
            const certificacion = await this.certificacionesService.create(createCertificacionDto, currentUser);
            return { success: true, data: certificacion };
        } catch (error) {
            this.logger.error(`Error creating certificacion: ${data.createCertificacionDto.nombreCertificacion}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.UPDATE_CERTIFICACION)
    async update(@Payload() data: { 
        idCertificacion: number; 
        updateCertificacionDto: UpdateCertificacionDto; 
        currentUser: any 
    }) {
        try {
            const { idCertificacion, updateCertificacionDto, currentUser } = data;
            this.logger.log(`Updating certificacion: ${idCertificacion}`);
            const certificacion = await this.certificacionesService.update(
                idCertificacion, 
                updateCertificacionDto, 
                currentUser
            );
            return { success: true, data: certificacion };
        } catch (error) {
            this.logger.error(`Error updating certificacion: ${data.idCertificacion}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.DELETE_CERTIFICACION)
    async remove(@Payload() data: { idCertificacion: number; currentUser: any }) {
        try {
            const { idCertificacion, currentUser } = data;
            this.logger.log(`Deleting certificacion: ${idCertificacion}`);
            const result = await this.certificacionesService.remove(idCertificacion, currentUser);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error deleting certificacion: ${data.idCertificacion}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }
}
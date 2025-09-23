import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TecnicosCertificacionesService } from '../services/tecnicos-certificaciones.service';
import {
    CreateTecnicoCertificacionDto,
    UpdateTecnicoCertificacionDto
} from '../dto/tecnico-certificacion.dto';
import { TECHNICIAN_PATTERNS } from '@app/events';

@Controller()
export class TecnicosCertificacionesController {
    private readonly logger = new Logger(TecnicosCertificacionesController.name);

    constructor(
        private readonly tecnicosCertificacionesService: TecnicosCertificacionesService
    ) { }

    @MessagePattern(TECHNICIAN_PATTERNS.FIND_ALL_TECNICO_CERTIFICACIONES)
    async findAll() {
        try {
            this.logger.log('Finding all technician certifications');
            const certificaciones = await this.tecnicosCertificacionesService.findAll();
            return { success: true, data: certificaciones };
        } catch (error) {
            this.logger.error('Error finding all technician certifications', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.FIND_TECNICO_CERTIFICACION_BY_ID)
    async findOne(@Payload() data: { idTecCert: number }) {
        try {
            const { idTecCert } = data;
            this.logger.log(`Finding technician certification: ${idTecCert}`);
            const certificacion = await this.tecnicosCertificacionesService.findOne(idTecCert);
            return { success: true, data: certificacion };
        } catch (error) {
            this.logger.error(`Error finding technician certification: ${data.idTecCert}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.CREATE_TECNICO_CERTIFICACION)
    async create(@Payload() data: {
        idTecnico: number;
        createTecnicoCertificacionDto: CreateTecnicoCertificacionDto;
        currentUser: any;
    }) {
        try {
            const { idTecnico, createTecnicoCertificacionDto, currentUser } = data;
            this.logger.log(`Creating certification for technician: ${idTecnico}`);
            const certificacion = await this.tecnicosCertificacionesService.create(
                idTecnico,
                createTecnicoCertificacionDto,
                currentUser
            );
            return { success: true, data: certificacion };
        } catch (error) {
            this.logger.error(`Error creating certification for technician: ${data.idTecnico}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.UPDATE_TECNICO_CERTIFICACION)
    async update(@Payload() data: {
        idTecCert: number;
        updateTecnicoCertificacionDto: UpdateTecnicoCertificacionDto;
        currentUser: any;
    }) {
        try {
            const { idTecCert, updateTecnicoCertificacionDto, currentUser } = data;
            this.logger.log(`Updating technician certification: ${idTecCert}`);
            const certificacion = await this.tecnicosCertificacionesService.update(
                idTecCert,
                updateTecnicoCertificacionDto,
                currentUser
            );
            return { success: true, data: certificacion };
        } catch (error) {
            this.logger.error(`Error updating technician certification: ${data.idTecCert}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.DELETE_TECNICO_CERTIFICACION)
    async remove(@Payload() data: { idTecCert: number; currentUser: any }) {
        try {
            const { idTecCert, currentUser } = data;
            this.logger.log(`Removing technician certification: ${idTecCert}`);
            const result = await this.tecnicosCertificacionesService.remove(idTecCert, currentUser);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`Error removing technician certification: ${data.idTecCert}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.VERIFY_TECNICO_CERTIFICACION)
    async verify(@Payload() data: { idTecCert: number; currentUser: any }) {
        try {
            const { idTecCert, currentUser } = data;
            this.logger.log(`Verifying technician certification: ${idTecCert}`);
            const certificacion = await this.tecnicosCertificacionesService.verificar(idTecCert, currentUser);
            return { success: true, data: certificacion };
        } catch (error) {
            this.logger.error(`Error verifying technician certification: ${data.idTecCert}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.REJECT_TECNICO_CERTIFICACION)
    async reject(@Payload() data: { idTecCert: number; currentUser: any }) {
        try {
            const { idTecCert, currentUser } = data;
            this.logger.log(`Rejecting technician certification: ${idTecCert}`);
            const certificacion = await this.tecnicosCertificacionesService.rechazar(idTecCert, currentUser);
            return { success: true, data: certificacion };
        } catch (error) {
            this.logger.error(`Error rejecting technician certification: ${data.idTecCert}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.FIND_CERTIFICACIONES_BY_TECNICO)
    async findByTecnico(@Payload() data: { idTecnico: number }) {
        try {
            const { idTecnico } = data;
            this.logger.log(`Finding certifications for technician: ${idTecnico}`);
            const certificaciones = await this.tecnicosCertificacionesService.findByTecnico(idTecnico);
            return { success: true, data: certificaciones };
        } catch (error) {
            this.logger.error(`Error finding certifications for technician: ${data.idTecnico}`, error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.FIND_PENDING_CERTIFICACIONES)
    async findPendingVerification() {
        try {
            this.logger.log('Finding pending certifications');
            const certificaciones = await this.tecnicosCertificacionesService.findPendingVerification();
            return { success: true, data: certificaciones };
        } catch (error) {
            this.logger.error('Error finding pending certifications', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.FIND_EXPIRING_CERTIFICACIONES)
    async findExpiringCertifications(@Payload() data: { diasAnticipacion?: number }) {
        try {
            const { diasAnticipacion } = data;
            this.logger.log(`Finding expiring certifications (${diasAnticipacion || 30} days)`);
            const certificaciones = await this.tecnicosCertificacionesService.findExpiringCertifications(diasAnticipacion);
            return { success: true, data: certificaciones };
        } catch (error) {
            this.logger.error('Error finding expiring certifications', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.MARK_EXPIRED_CERTIFICACIONES)
    async markExpiredCertifications() {
        try {
            this.logger.log('Marking expired certifications');
            const result = await this.tecnicosCertificacionesService.markExpiredCertifications();
            return { success: true, data: result };
        } catch (error) {
            this.logger.error('Error marking expired certifications', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }

    @MessagePattern(TECHNICIAN_PATTERNS.GET_CERTIFICACION_STATS)
    async getStats() {
        try {
            this.logger.log('Getting certification statistics');
            const stats = await this.tecnicosCertificacionesService.getStats();
            return { success: true, data: stats };
        } catch (error) {
            this.logger.error('Error getting certification statistics', error.stack);
            return {
                success: false,
                error: error.message,
                statusCode: error.status || 500
            };
        }
    }
}

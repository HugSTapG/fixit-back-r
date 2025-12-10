import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    Logger
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { KafkaService } from '@app/events';
import {
    CreateCertificacionDto,
    UpdateCertificacionDto
} from '../dto';
import { CertificacionMapper } from '../mappers';
import { RolUsuario } from '@app/shared';

/**
 * Servicio para la gestión de certificaciones
 */
@Injectable()
export class CertificacionesService {
    private readonly logger = new Logger(CertificacionesService.name);

    constructor(
        private readonly database: DatabaseService,
        private readonly kafkaService: KafkaService,
    ) { }

    /**
     * Obtiene todas las certificaciones
     */
    async findAll() {
        const certificaciones = await this.database.certificacion.findMany({
            include: {
                _count: {
                    select: {
                        tecnicosCertificaciones: true
                    }
                }
            },
            orderBy: {
                nombreCertificacion: 'asc'
            }
        });

        return certificaciones.map(cert => CertificacionMapper.toInterface(cert));
    }

    /**
     * Busca una certificación por ID
     */
    async findOne(idCertificacion: number) {
        const certificacion = await this.database.certificacion.findUnique({
            where: { idCertificacion },
            include: {
                tecnicosCertificaciones: {
                    include: {
                        tecnico: true
                    }
                }
            }
        });

        if (!certificacion) {
            throw new NotFoundException(`Certificación con ID ${idCertificacion} no encontrada`);
        }

        return CertificacionMapper.toInterface(certificacion);
    }

    /**
     * Crea una nueva certificación (solo admin)
     */
    async create(
        createCertificacionDto: CreateCertificacionDto,
        currentUser: { idUser: number; roles: RolUsuario[] }
    ) {
        if (!currentUser.roles.includes(RolUsuario.ADMIN)) {
            throw new ForbiddenException('Solo los administradores pueden crear certificaciones');
        }

        const createData = CertificacionMapper.toPrismaCreateData(createCertificacionDto);

        const certificacion = await this.database.certificacion.create({
            data: createData
        });

        // Emitir evento
        await this.kafkaService.publishEvent('technician.certificacion.created', {
            idCertificacion: certificacion.idCertificacion,
            nombreCertificacion: certificacion.nombreCertificacion,
            timestamp: new Date(),
        });

        return CertificacionMapper.toInterface(certificacion);
    }

    /**
     * Actualiza una certificación existente (solo admin)
     */
    async update(
        idCertificacion: number,
        updateCertificacionDto: UpdateCertificacionDto,
        currentUser: { idUser: number; roles: RolUsuario[] }
    ) {
        if (!currentUser.roles.includes(RolUsuario.ADMIN)) {
            throw new ForbiddenException('Solo los administradores pueden actualizar certificaciones');
        }

        const certificacion = await this.findOne(idCertificacion);

        const updateData = CertificacionMapper.toPrismaUpdateData(updateCertificacionDto);

        const certificacionActualizada = await this.database.certificacion.update({
            where: { idCertificacion },
            data: updateData
        });

        // Emitir evento
        await this.kafkaService.publishEvent('technician.certificacion.updated', {
            idCertificacion,
            changes: updateCertificacionDto,
            timestamp: new Date(),
        });

        return CertificacionMapper.toInterface(certificacionActualizada);
    }

    /**
     * Elimina una certificación (solo admin)
     */
    async remove(
        idCertificacion: number,
        currentUser: { idUser: number; roles: RolUsuario[] }
    ) {
        if (!currentUser.roles.includes(RolUsuario.ADMIN)) {
            throw new ForbiddenException('Solo los administradores pueden eliminar certificaciones');
        }

        const certificacion = await this.findOne(idCertificacion);

        // Verificar que no tenga técnicos asociados
        const tecnicosAsociados = await this.database.tecnicoCertificacion.count({
            where: { idCertificacion }
        });

        if (tecnicosAsociados > 0) {
            throw new ForbiddenException('No se puede eliminar una certificación que tiene técnicos asociados');
        }

        const deletedCertificacion = await this.database.certificacion.delete({
            where: { idCertificacion }
        });

        // Emitir evento
        await this.kafkaService.publishEvent('technician.certificacion.deleted', {
            idCertificacion,
            nombreCertificacion: deletedCertificacion.nombreCertificacion,
            timestamp: new Date(),
        });

        return CertificacionMapper.toInterface(deletedCertificacion);
    }
}

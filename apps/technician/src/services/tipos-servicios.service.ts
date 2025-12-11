import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    Logger
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { KafkaService } from '@app/events';
import {
    CreateTipoServicioDto,
    UpdateTipoServicioDto
} from '../dto';
import { TipoServicioMapper } from '../mappers';
import { RolUsuario } from '@app/shared';

/**
 * Servicio para la gestión de tipos de servicios
 */
@Injectable()
export class TiposServiciosService {
    private readonly logger = new Logger(TiposServiciosService.name);

    constructor(
        private readonly database: DatabaseService,
        private readonly kafkaService: KafkaService,
    ) { }

    /**
     * Obtiene todos los tipos de servicios
     */
    async findAll() {
        const tiposServicios = await this.database.tipoServicio.findMany({
            include: {
                _count: {
                    select: {
                        tecnicosServicios: true
                    }
                }
            },
            orderBy: {
                nombreServicio: 'asc'
            }
        });

        return tiposServicios.map(tipo => TipoServicioMapper.toInterface(tipo));
    }

    /**
     * Busca un tipo de servicio por ID
     */
    async findOne(idTipoServicio: number) {
        const tipoServicio = await this.database.tipoServicio.findUnique({
            where: { idTipoServicio },
            include: {
                tecnicosServicios: {
                    include: {
                        tecnico: true
                    }
                }
            }
        });

        if (!tipoServicio) {
            throw new NotFoundException(`Tipo de servicio con ID ${idTipoServicio} no encontrado`);
        }

        return TipoServicioMapper.toInterface(tipoServicio);
    }

    /**
     * Crea un nuevo tipo de servicio (solo admin)
     */
    async create(
        createTipoServicioDto: CreateTipoServicioDto,
        currentUser: { idUser: number; roles: RolUsuario[] }
    ) {
        if (!currentUser.roles.includes(RolUsuario.ADMIN)) {
            throw new ForbiddenException('Solo los administradores pueden crear tipos de servicios');
        }

        const createData = TipoServicioMapper.toPrismaCreateData(createTipoServicioDto);

        const tipoServicio = await this.database.tipoServicio.create({
            data: createData
        });

        // Emitir evento
        await this.kafkaService.publishEvent('technician.tipoServicio.created', {
            idTipoServicio: tipoServicio.idTipoServicio,
            nombreServicio: tipoServicio.nombreServicio,
            subServicio: tipoServicio.subServicio,
            timestamp: new Date(),
        });

        return TipoServicioMapper.toInterface(tipoServicio);
    }

    /**
     * Actualiza un tipo de servicio existente (solo admin)
     */
    async update(
        idTipoServicio: number,
        updateTipoServicioDto: UpdateTipoServicioDto,
        currentUser: { idUser: number; roles: RolUsuario[] }
    ) {
        if (!currentUser.roles.includes(RolUsuario.ADMIN)) {
            throw new ForbiddenException('Solo los administradores pueden actualizar tipos de servicios');
        }

        const tipoServicio = await this.findOne(idTipoServicio);

        const updateData = TipoServicioMapper.toPrismaUpdateData(updateTipoServicioDto);

        const tipoServicioActualizado = await this.database.tipoServicio.update({
            where: { idTipoServicio },
            data: updateData
        });

        // Emitir evento
        await this.kafkaService.publishEvent('technician.tipoServicio.updated', {
            idTipoServicio,
            changes: updateTipoServicioDto,
            timestamp: new Date(),
        });

        return TipoServicioMapper.toInterface(tipoServicioActualizado);
    }

    /**
     * Elimina un tipo de servicio (solo admin)
     */
    async remove(
        idTipoServicio: number,
        currentUser: { idUser: number; roles: RolUsuario[] }
    ) {
        if (!currentUser.roles.includes(RolUsuario.ADMIN)) {
            throw new ForbiddenException('Solo los administradores pueden eliminar tipos de servicios');
        }

        const tipoServicio = await this.findOne(idTipoServicio);

        // Verificar que no tenga técnicos asociados
        const tecnicosAsociados = await this.database.tecnicoServicio.count({
            where: { idTipoServicio }
        });

        if (tecnicosAsociados > 0) {
            throw new ForbiddenException('No se puede eliminar un tipo de servicio que tiene técnicos asociados');
        }

        const deletedTipoServicio = await this.database.tipoServicio.delete({
            where: { idTipoServicio }
        });

        // Emitir evento
        await this.kafkaService.publishEvent('technician.tipoServicio.deleted', {
            idTipoServicio,
            nombreServicio: deletedTipoServicio.nombreServicio,
            timestamp: new Date(),
        });

        return TipoServicioMapper.toInterface(deletedTipoServicio);
    }

    /**
     * Obtiene estadísticas de tipos de servicios
     */
    async getStats() {
        const [
            total,
            conTecnicos,
            masPopulares
        ] = await Promise.all([
            this.database.tipoServicio.count(),
            this.database.tipoServicio.count({
                where: {
                    tecnicosServicios: {
                        some: {}
                    }
                }
            }),
            this.database.tipoServicio.findMany({
                include: {
                    _count: {
                        select: {
                            tecnicosServicios: true
                        }
                    }
                },
                orderBy: {
                    tecnicosServicios: {
                        _count: 'desc'
                    }
                },
                take: 5
            })
        ]);

        return {
            total,
            conTecnicos,
            porcentajeConTecnicos: total > 0 ? (conTecnicos / total) * 100 : 0,
            masPopulares: masPopulares.map(servicio => ({
                idTipoServicio: servicio.idTipoServicio,
                nombreServicio: servicio.nombreServicio,
                subServicio: servicio.subServicio,
                totalTecnicos: servicio._count.tecnicosServicios
            }))
        };
    }
}

import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    ConflictException,
    Logger
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { KafkaService } from '@app/events';
import { CreateTecnicoServicioDto } from '../dto/tecnico-servicio.dto';
import { RolUsuario } from '@app/shared';

/**
 * Servicio para la gestión de servicios de técnicos
 */
@Injectable()
export class TecnicosServiciosService {
    private readonly logger = new Logger(TecnicosServiciosService.name);

    constructor(
        private readonly database: DatabaseService,
        private readonly kafkaService: KafkaService,
    ) { }

    /**
     * Obtiene todas las asignaciones técnico-servicio
     */
    async findAll() {
        const asignaciones = await this.database.tecnicoServicio.findMany({
            include: {
                tecnico: true,
                tipoServicio: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return asignaciones;
    }

    /**
     * Asigna un servicio a un técnico
     */
    async create(
        idTecnico: number,
        createTecnicoServicioDto: CreateTecnicoServicioDto,
        currentUser: { idUser: number; roles: RolUsuario[] }
    ) {
        const { idTipoServicio } = createTecnicoServicioDto;

        // Verificar que el técnico existe
        const tecnico = await this.database.tecnico.findUnique({
            where: { idTecnico }
        });

        if (!tecnico) {
            throw new NotFoundException(`Técnico con ID ${idTecnico} no encontrado`);
        }

        // Verificar permisos
        if (!currentUser.roles.includes(RolUsuario.ADMIN) && tecnico.idUser !== currentUser.idUser) {
            throw new ForbiddenException('No tienes permisos para asignar servicios a este técnico');
        }

        // Verificar que el tipo de servicio existe
        const tipoServicio = await this.database.tipoServicio.findUnique({
            where: { idTipoServicio }
        });

        if (!tipoServicio) {
            throw new NotFoundException(`Tipo de servicio con ID ${idTipoServicio} no encontrado`);
        }

        // Verificar que no existe ya esta asignación
        const asignacionExistente = await this.database.tecnicoServicio.findUnique({
            where: {
                idTecnico_idTipoServicio: {
                    idTecnico,
                    idTipoServicio
                }
            }
        });

        if (asignacionExistente) {
            throw new ConflictException('El técnico ya tiene asignado este tipo de servicio');
        }

        const tecnicoServicio = await this.database.tecnicoServicio.create({
            data: {
                idTecnico,
                idTipoServicio
            },
            include: {
                tecnico: true,
                tipoServicio: true
            }
        });

        // Emitir evento
        await this.kafkaService.publishEvent('technician.servicio.assigned', {
            idTecnico,
            idTipoServicio,
            nombreServicio: tipoServicio.nombreServicio,
            timestamp: new Date(),
        });

        return tecnicoServicio;
    }

    /**
     * Elimina asignación de servicio a técnico
     */
    async remove(
        idTecnico: number,
        idTipoServicio: number,
        currentUser: { idUser: number; roles: RolUsuario[] }
    ) {
        // Verificar que la asignación existe
        const asignacion = await this.database.tecnicoServicio.findUnique({
            where: {
                idTecnico_idTipoServicio: {
                    idTecnico,
                    idTipoServicio
                }
            },
            include: {
                tecnico: true,
                tipoServicio: true
            }
        });

        if (!asignacion) {
            throw new NotFoundException('Asignación técnico-servicio no encontrada');
        }

        // Verificar permisos
        if (!currentUser.roles.includes(RolUsuario.ADMIN) && asignacion.tecnico.idUser !== currentUser.idUser) {
            throw new ForbiddenException('No tienes permisos para eliminar esta asignación');
        }

        const deletedAsignacion = await this.database.tecnicoServicio.delete({
            where: {
                idTecnico_idTipoServicio: {
                    idTecnico,
                    idTipoServicio
                }
            }
        });

        // Emitir evento
        await this.kafkaService.publishEvent('technician.servicio.unassigned', {
            idTecnico,
            idTipoServicio,
            nombreServicio: asignacion.tipoServicio.nombreServicio,
            timestamp: new Date(),
        });

        return deletedAsignacion;
    }

    /**
     * Obtiene servicios asignados a un técnico
     */
    async findByTecnico(idTecnico: number) {
        const asignaciones = await this.database.tecnicoServicio.findMany({
            where: { idTecnico },
            include: {
                tipoServicio: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        return asignaciones;
    }

    /**
     * Obtiene técnicos que ofrecen un tipo de servicio
     */
    async findByTipoServicio(idTipoServicio: number) {
        const asignaciones = await this.database.tecnicoServicio.findMany({
            where: { idTipoServicio },
            include: {
                tecnico: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        return asignaciones;
    }
}

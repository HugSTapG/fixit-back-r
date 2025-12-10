import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    ConflictException,
    Logger
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { KafkaService } from '@app/events';
import { CreateTecnicoParroquiaDto } from '../dto/tecnico-parroquia.dto';
import { RolUsuario } from '@app/shared';

/**
 * Servicio para la gestión de parroquias de técnicos
 */
@Injectable()
export class TecnicosParroquiasService {
    private readonly logger = new Logger(TecnicosParroquiasService.name);

    constructor(
        private readonly database: DatabaseService,
        private readonly kafkaService: KafkaService,
    ) { }

    /**
     * Obtiene todas las asignaciones técnico-parroquia
     */
    async findAll() {
        const asignaciones = await this.database.tecnicoParroquia.findMany({
            include: {
                tecnico: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return asignaciones;
    }

    /**
     * Asigna una parroquia a un técnico
     */
    async create(
        idTecnico: number,
        createTecnicoParroquiaDto: CreateTecnicoParroquiaDto,
        currentUser: { idUser: number; roles: RolUsuario[] }
    ) {
        const { codigoParroquia } = createTecnicoParroquiaDto;

        // Verificar que el técnico existe
        const tecnico = await this.database.tecnico.findUnique({
            where: { idTecnico }
        });

        if (!tecnico) {
            throw new NotFoundException(`Técnico con ID ${idTecnico} no encontrado`);
        }

        // Verificar permisos
        if (!currentUser.roles.includes(RolUsuario.ADMIN) && tecnico.idUser !== currentUser.idUser) {
            throw new ForbiddenException('No tienes permisos para asignar parroquias a este técnico');
        }

        // Verificar que no existe ya esta asignación
        const asignacionExistente = await this.database.tecnicoParroquia.findUnique({
            where: {
                idTecnico_codigoParroquia: {
                    idTecnico,
                    codigoParroquia
                }
            }
        });

        if (asignacionExistente) {
            throw new ConflictException('El técnico ya está asignado a esta parroquia');
        }

        const tecnicoParroquia = await this.database.tecnicoParroquia.create({
            data: {
                idTecnico,
                codigoParroquia
            },
            include: {
                tecnico: true
            }
        });

        // Emitir evento
        await this.kafkaService.publishEvent('technician.parroquia.assigned', {
            idTecnico,
            codigoParroquia,
            timestamp: new Date(),
        });

        return tecnicoParroquia;
    }

    /**
     * Elimina asignación de parroquia a técnico
     */
    async remove(
        idTecnico: number,
        codigoParroquia: string,
        currentUser: { idUser: number; roles: RolUsuario[] }
    ) {
        // Verificar que la asignación existe
        const asignacion = await this.database.tecnicoParroquia.findUnique({
            where: {
                idTecnico_codigoParroquia: {
                    idTecnico,
                    codigoParroquia
                }
            },
            include: {
                tecnico: true
            }
        });

        if (!asignacion) {
            throw new NotFoundException('Asignación técnico-parroquia no encontrada');
        }

        // Verificar permisos
        if (!currentUser.roles.includes(RolUsuario.ADMIN) && asignacion.tecnico.idUser !== currentUser.idUser) {
            throw new ForbiddenException('No tienes permisos para eliminar esta asignación');
        }

        const deletedAsignacion = await this.database.tecnicoParroquia.delete({
            where: {
                idTecnico_codigoParroquia: {
                    idTecnico,
                    codigoParroquia
                }
            }
        });

        // Emitir evento
        await this.kafkaService.publishEvent('technician.parroquia.unassigned', {
            idTecnico,
            codigoParroquia,
            timestamp: new Date(),
        });

        return deletedAsignacion;
    }

    /**
     * Obtiene parroquias asignadas a un técnico
     */
    async findByTecnico(idTecnico: number) {
        const asignaciones = await this.database.tecnicoParroquia.findMany({
            where: { idTecnico },
            orderBy: {
                createdAt: 'asc'
            }
        });

        return asignaciones;
    }

    /**
     * Obtiene técnicos asignados a una parroquia
     */
    async findByParroquia(codigoParroquia: string) {
        const asignaciones = await this.database.tecnicoParroquia.findMany({
            where: { codigoParroquia },
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

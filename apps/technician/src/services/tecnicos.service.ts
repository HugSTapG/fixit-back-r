import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    ConflictException,
    Logger
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { KafkaService, RedisService } from '@app/events';
import {
    CreateTecnicoDto,
    UpdateTecnicoDto,
    TecnicoFilterDto
} from '../dto';
import { TecnicoMapper } from '../mappers';
import { RolUsuario } from '@app/shared';

/**
 * Servicio para la gestión de técnicos en el microservicio
 */
@Injectable()
export class TecnicosService {
    private readonly logger = new Logger(TecnicosService.name);

    constructor(
        private readonly database: DatabaseService,
        private readonly kafkaService: KafkaService,
        private readonly redisService: RedisService,
    ) { }

    /**
     * Obtiene todos los técnicos con filtros opcionales
     */
    async findAll(filterDto?: TecnicoFilterDto) {
        const {
            isActive,
            codigoParroquia,
            idTipoServicio,
            calificacionMinima,
            limit = 20,
            page = 1
        } = filterDto || {};

        const where: any = {};

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        // Filtro por parroquia
        if (codigoParroquia) {
            where.parroquias = {
                some: {
                    codigoParroquia: codigoParroquia
                }
            };
        }

        // Filtro por tipo de servicio
        if (idTipoServicio) {
            where.servicios = {
                some: {
                    idTipoServicio: idTipoServicio
                }
            };
        }

        // Filtro por calificación mínima
        if (calificacionMinima) {
            where.promedioCalificaciones = {
                gte: calificacionMinima
            };
        }

        const skip = (page - 1) * limit;

        const [tecnicos, total] = await Promise.all([
            this.database.tecnico.findMany({
                where,
                include: {
                    certificaciones: {
                        include: {
                            certificacion: true
                        },
                        where: {
                            estatusCertificacion: 'VERIFICADA'
                        }
                    },
                    parroquias: true,
                    servicios: {
                        include: {
                            tipoServicio: true
                        }
                    },
                    _count: {
                        select: {
                            solicitudesTecnico: true,
                            calificaciones: true
                        }
                    }
                },
                orderBy: [
                    { promedioCalificaciones: 'desc' },
                    { totalCalificaciones: 'desc' }
                ],
                take: limit,
                skip
            }),
            this.database.tecnico.count({ where })
        ]);

        return {
            tecnicos: tecnicos.map(t => TecnicoMapper.toInterface(t)),
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    /**
     * Busca un técnico por su ID
     */
    async findOne(idTecnico: number) {
        const tecnico = await this.database.tecnico.findUnique({
            where: { idTecnico },
            include: {
                certificaciones: {
                    include: {
                        certificacion: true
                    },
                    orderBy: {
                        fechaObtencion: 'desc'
                    }
                },
                parroquias: true,
                servicios: {
                    include: {
                        tipoServicio: true
                    }
                },
                solicitudesTecnico: {
                    orderBy: {
                        fechaPropuesta: 'desc'
                    },
                    take: 10
                },
                calificaciones: {
                    orderBy: {
                        fechaCalificacion: 'desc'
                    },
                    take: 10
                }
            }
        });

        if (!tecnico) {
            throw new NotFoundException(`Técnico con ID ${idTecnico} no encontrado`);
        }

        return TecnicoMapper.toInterface(tecnico);
    }

    /**
     * Busca un técnico por ID de usuario
     */
    async findByUserId(idUser: number) {
        const tecnico = await this.database.tecnico.findUnique({
            where: { idUser },
            include: {
                certificaciones: {
                    include: {
                        certificacion: true
                    }
                },
                parroquias: true,
                servicios: {
                    include: {
                        tipoServicio: true
                    }
                }
            }
        });

        if (!tecnico) {
            throw new NotFoundException(`No se encontró técnico para el usuario con ID ${idUser}`);
        }

        return TecnicoMapper.toInterface(tecnico);
    }

    /**
     * Crea un nuevo técnico
     * Note: La validación del usuario se hace en el API Gateway
     */
    async create(createTecnicoDto: CreateTecnicoDto) {
        const { idUser } = createTecnicoDto;

        // Verificar que no existe ya un técnico para este usuario
        const tecnicoExistente = await this.database.tecnico.findUnique({
            where: { idUser }
        });

        if (tecnicoExistente) {
            throw new ConflictException(`Ya existe un técnico para el usuario con ID ${idUser}`);
        }

        const createData = TecnicoMapper.toPrismaCreateData(createTecnicoDto);

        const tecnico = await this.database.tecnico.create({
            data: createData,
            include: {
                certificaciones: true,
                parroquias: true,
                servicios: true
            }
        });

        // Emitir evento
        await this.kafkaService.publishEvent('technician.created', {
            idTecnico: tecnico.idTecnico,
            idUser: tecnico.idUser,
            timestamp: new Date(),
        });

        return TecnicoMapper.toInterface(tecnico);
    }

    /**
     * Actualiza un técnico existente
     */
    async update(
        idTecnico: number,
        updateTecnicoDto: UpdateTecnicoDto,
        currentUser: { idUser: number; roles: RolUsuario[] }
    ) {
        const tecnico = await this.findOne(idTecnico);

        // Verificar permisos (la validación se hace aquí)
        if (!currentUser.roles.includes(RolUsuario.ADMIN) && tecnico.idUser !== currentUser.idUser) {
            throw new ForbiddenException('No tienes permisos para actualizar este técnico');
        }

        const updateData = TecnicoMapper.toPrismaUpdateData({
            ...updateTecnicoDto,
            updatedBy: currentUser.idUser
        });

        const tecnicoActualizado = await this.database.tecnico.update({
            where: { idTecnico },
            data: updateData,
            include: {
                certificaciones: true,
                parroquias: true,
                servicios: true
            }
        });

        // Emitir evento
        await this.kafkaService.publishEvent('technician.updated', {
            idTecnico: tecnicoActualizado.idTecnico,
            changes: updateTecnicoDto,
            timestamp: new Date(),
        });

        return TecnicoMapper.toInterface(tecnicoActualizado);
    }

    /**
     * Desactiva un técnico (soft delete)
     */
    async deactivate(
        idTecnico: number,
        currentUser: { idUser: number; roles: RolUsuario[] }
    ) {
        // Solo admin puede desactivar técnicos
        if (!currentUser.roles.includes(RolUsuario.ADMIN)) {
            throw new ForbiddenException('Solo los administradores pueden desactivar técnicos');
        }

        const tecnico = await this.database.tecnico.update({
            where: { idTecnico },
            data: {
                isActive: false,
                deletedAt: new Date(),
                updatedBy: currentUser.idUser
            }
        });

        // Emitir evento
        await this.kafkaService.publishEvent('technician.deactivated', {
            idTecnico: tecnico.idTecnico,
            deactivatedBy: currentUser.idUser,
            timestamp: new Date(),
        });

        return TecnicoMapper.toInterface(tecnico);
    }

    /**
     * Obtiene técnicos por parroquia
     */
    async findByParroquia(codigoParroquia: string, filterDto?: TecnicoFilterDto) {
        return this.findAll({
            ...filterDto,
            codigoParroquia
        });
    }

    /**
     * Obtiene técnicos por tipo de servicio
     */
    async findByTipoServicio(idTipoServicio: number, filterDto?: TecnicoFilterDto) {
        return this.findAll({
            ...filterDto,
            idTipoServicio
        });
    }

    /**
     * Obtiene técnicos mejor calificados
     */
    async getTopRated(limit: number = 10) {
        const tecnicos = await this.database.tecnico.findMany({
            where: {
                isActive: true,
                totalCalificaciones: { gt: 0 }
            },
            include: {
                servicios: {
                    include: {
                        tipoServicio: {
                            select: {
                                nombreServicio: true
                            }
                        }
                    }
                },
                parroquias: true
            },
            orderBy: [
                { promedioCalificaciones: 'desc' },
                { totalCalificaciones: 'desc' }
            ],
            take: limit
        });

        return tecnicos.map(t => TecnicoMapper.toInterface(t));
    }

    /**
     * Busca técnicos disponibles para una solicitud específica
     */
    async findAvailableForRequest(
        idSolicitud: number,
        codigoParroquia?: string,
        idTipoServicio?: number
    ) {
        const where: any = {
            isActive: true
        };

        // Filtro por parroquia si se proporciona
        if (codigoParroquia) {
            where.parroquias = {
                some: {
                    codigoParroquia: codigoParroquia
                }
            };
        }

        // Filtro por tipo de servicio si se proporciona
        if (idTipoServicio) {
            where.servicios = {
                some: {
                    idTipoServicio: idTipoServicio
                }
            };
        }

        // Excluir técnicos que ya se postularon a esta solicitud
        where.solicitudesTecnico = {
            none: {
                idSolicitud: idSolicitud
            }
        };

        const tecnicos = await this.database.tecnico.findMany({
            where,
            include: {
                servicios: {
                    include: {
                        tipoServicio: true
                    }
                },
                parroquias: true
            },
            orderBy: [
                { promedioCalificaciones: 'desc' },
                { totalCalificaciones: 'desc' }
            ]
        });

        return tecnicos.map(t => TecnicoMapper.toInterface(t));
    }

    /**
     * Obtiene estadísticas de técnicos
     */
    async getStats() {
        const [
            total,
            activos,
            inactivos,
            conCertificaciones,
            promedioCalificaciones,
            distribucionPorParroquia
        ] = await Promise.all([
            this.database.tecnico.count(),
            this.database.tecnico.count({ where: { isActive: true } }),
            this.database.tecnico.count({ where: { isActive: false } }),
            this.database.tecnico.count({
                where: {
                    certificaciones: {
                        some: {
                            estatusCertificacion: 'VERIFICADA'
                        }
                    }
                }
            }),
            this.database.tecnico.aggregate({
                where: { totalCalificaciones: { gt: 0 } },
                _avg: { promedioCalificaciones: true }
            }),
            this.database.tecnicoParroquia.groupBy({
                by: ['codigoParroquia'],
                _count: { codigoParroquia: true }
            })
        ]);

        return {
            total,
            activos,
            inactivos,
            conCertificaciones,
            promedioSistema: promedioCalificaciones._avg.promedioCalificaciones || 0,
            porcentajeActivos: total > 0 ? (activos / total) * 100 : 0,
            porcentajeCertificados: total > 0 ? (conCertificaciones / total) * 100 : 0,
            distribucionPorParroquia: distribucionPorParroquia.reduce((acc, item) => {
                acc[item.codigoParroquia] = item._count.codigoParroquia;
                return acc;
            }, {} as Record<string, number>)
        };
    }

    /**
     * Actualiza el promedio de calificaciones de un técnico
     */
    async updatePromedioCalificaciones(idTecnico: number) {
        const calificaciones = await this.database.calificacion.findMany({
            where: { idTecnico }
        });

        if (calificaciones.length === 0) {
            await this.database.tecnico.update({
                where: { idTecnico },
                data: {
                    totalCalificaciones: 0,
                    promedioCalificaciones: null
                }
            });
            return;
        }

        // Calcular promedio según puntajes numéricos
        const puntajesNumericos = calificaciones.map(cal => {
            switch (cal.puntaje) {
                case 'EXCELENTE': return 5;
                case 'BUENO': return 4;
                case 'REGULAR': return 3;
                case 'MALO': return 2;
                case 'TERRIBLE': return 1;
                default: return 3;
            }
        });

        const promedio = puntajesNumericos.reduce((sum, val) => sum + val, 0) / puntajesNumericos.length;

        await this.database.tecnico.update({
            where: { idTecnico },
            data: {
                totalCalificaciones: calificaciones.length,
                promedioCalificaciones: promedio
            }
        });

        return { promedio, total: calificaciones.length };
    }

    /**
     * Envía una solicitud de verificación del técnico
     * Cambia el status a VERIFICACION_PENDIENTE
     */
    async submitVerification(idTecnico: number, currentUser: { idUser: number; roles: RolUsuario[] }) {
        const tecnico = await this.findOne(idTecnico);

        // Verificar que el usuario puede hacer esto (el técnico o un admin)
        if (!currentUser.roles.includes(RolUsuario.ADMIN) && tecnico.idUser !== currentUser.idUser) {
            throw new ForbiddenException('No tienes permisos para enviar verificación para este técnico');
        }

        // Actualizar estado a VERIFICACION_PENDIENTE
        const updatedTecnico = await this.database.tecnico.update({
            where: { idTecnico },
            data: {
                status: 'VERIFICACION_PENDIENTE',
                updatedBy: currentUser.idUser,
            },
            include: {
                certificaciones: true,
                parroquias: true,
                servicios: true
            }
        });

        // Emitir evento
        await this.kafkaService.publishEvent('technician.verification_submitted', {
            idTecnico,
            idUser: tecnico.idUser,
            timestamp: new Date(),
        });

        return TecnicoMapper.toInterface(updatedTecnico);
    }

    /**
     * Aprueba la verificación de un técnico (solo admins)
     * Cambia el status a VERIFICADO
     */
    async approveVerification(idTecnico: number, currentUser: { idUser: number; roles: RolUsuario[] }) {
        if (!currentUser.roles.includes(RolUsuario.ADMIN)) {
            throw new ForbiddenException('Solo los administradores pueden aprobar verificaciones');
        }

        const tecnico = await this.findOne(idTecnico);

        const updatedTecnico = await this.database.tecnico.update({
            where: { idTecnico },
            data: {
                status: 'VERIFICADO',
                updatedBy: currentUser.idUser,
            },
            include: {
                certificaciones: true,
                parroquias: true,
                servicios: true
            }
        });

        // Emitir evento
        await this.kafkaService.publishEvent('technician.verified', {
            idTecnico,
            idUser: tecnico.idUser,
            approvedBy: currentUser.idUser,
            timestamp: new Date(),
        });

        return TecnicoMapper.toInterface(updatedTecnico);
    }

    /**
     * Rechaza la verificación de un técnico (solo admins)
     * Cambia el status de vuelta a REGISTRADO
     */
    async rejectVerification(idTecnico: number, currentUser: { idUser: number; roles: RolUsuario[] }) {
        if (!currentUser.roles.includes(RolUsuario.ADMIN)) {
            throw new ForbiddenException('Solo los administradores pueden rechazar verificaciones');
        }

        const tecnico = await this.findOne(idTecnico);

        const updatedTecnico = await this.database.tecnico.update({
            where: { idTecnico },
            data: {
                status: 'REGISTRADO',
                updatedBy: currentUser.idUser,
            },
            include: {
                certificaciones: true,
                parroquias: true,
                servicios: true
            }
        });

        // Emitir evento
        await this.kafkaService.publishEvent('technician.verification_rejected', {
            idTecnico,
            idUser: tecnico.idUser,
            rejectedBy: currentUser.idUser,
            timestamp: new Date(),
        });

        return TecnicoMapper.toInterface(updatedTecnico);
    }
}

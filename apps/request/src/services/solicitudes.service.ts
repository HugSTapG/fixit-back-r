import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
    CreateSolicitudDto,
    UpdateSolicitudDto,
    SolicitudFilterDto
} from '../dto/solicitud.dto';
import { EstadoSolicitud, RolUsuario } from '@app/shared';

/**
 * Servicio para la gestión de solicitudes de servicio
 */
@Injectable()
export class SolicitudesService {
    constructor(private readonly database: DatabaseService) { }

    /**
     * Obtiene todas las solicitudes con filtros opcionales
     * CLIENTE: retorna TODAS sus solicitudes sin default de estado
     * TÉCNICO: default PENDIENTE si no especifica estado
     * ADMIN: retorna TODAS sin default de estado
     */
    async findAll(filterDto?: SolicitudFilterDto) {
        const {
            estadoSolicitud,
            idTipoServicio,
            codigoParroquia,
            promocion,
            idUser,
            rol,
            limit,
            page
        } = filterDto || {};

        // Microservice payloads arrive deserialised, so we normalise primitives before hitting Prisma.
        const parseNumber = (value?: unknown): number | undefined => {
            if (value === null || value === undefined) {
                return undefined;
            }
            const numeric = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
            return Number.isNaN(numeric) ? undefined : numeric;
        };

        const parseBoolean = (value?: unknown): boolean | undefined => {
            if (value === null || value === undefined) {
                return undefined;
            }
            if (typeof value === 'boolean') {
                return value;
            }
            if (typeof value === 'string') {
                const normalized = value.trim().toLowerCase();
                if (normalized === 'true') return true;
                if (normalized === 'false') return false;
            }
            return undefined;
        };

        const sanitizedLimit = Math.max(parseNumber(limit) ?? 20, 1);
        const sanitizedPage = Math.max(parseNumber(page) ?? 1, 1);

        const where: any = {
            isActive: true
        };

        // ✅ P1 CORRECCIÓN: Aplicar default PENDIENTE SOLO si es TÉCNICO
        if (estadoSolicitud) {
            // Si se especifica estado explícitamente, usar ese
            where.estadoSolicitud = estadoSolicitud;
        } else if (rol === RolUsuario.TECNICO) {
            // Default: TÉCNICO ve solo PENDIENTE
            where.estadoSolicitud = EstadoSolicitud.PENDIENTE;
        }
        // Si es CLIENTE o ADMIN: sin default, retorna TODAS (sin filtro de estado)

        const parsedTipoServicio = parseNumber(idTipoServicio);
        if (parsedTipoServicio !== undefined) {
            where.idTipoServicio = parsedTipoServicio;
        }

        if (codigoParroquia) {
            where.codigoParroquia = codigoParroquia;
        }

        const parsedPromocion = parseBoolean(promocion);
        if (parsedPromocion !== undefined) {
            where.promocion = parsedPromocion;
        }

        const parsedIdUser = parseNumber(idUser);
        if (parsedIdUser !== undefined) {
            where.idUser = parsedIdUser;
        }

        const skip = (sanitizedPage - 1) * sanitizedLimit;

        const [solicitudes, total] = await Promise.all([
            this.database.solicitud.findMany({
                where,
                include: {
                    _count: {
                        select: {
                            solicitudesTecnico: true,
                            calificaciones: true
                        }
                    }
                },
                orderBy: {
                    fechaPublicacion: 'desc'
                },
                take: sanitizedLimit,
                skip
            }),
            this.database.solicitud.count({ where })
        ]);

        return {
            solicitudes,
            pagination: {
                total,
                page: sanitizedPage,
                limit: sanitizedLimit,
                totalPages: Math.ceil(total / sanitizedLimit)
            }
        };
    }

    /**
     * Busca una solicitud por su ID
     * P2a: Valida que el usuario tenga permisos para acceder
     */
    async findOne(idSolicitud: number, currentUser?: { idUser: number; rol: string }) {
        const solicitud = await this.database.solicitud.findUnique({
            where: {
                idSolicitud,
                isActive: true
            },
            include: {
                solicitudesTecnico: true,
                calificaciones: true,
                transacciones: true
            }
        });

        if (!solicitud) {
            throw new NotFoundException(`Solicitud con ID ${idSolicitud} no encontrada`);
        }

        // P2a: Verificar permisos (solo propietario o admin)
        if (currentUser && currentUser.rol !== 'ADMIN' && solicitud.idUser !== currentUser.idUser) {
            throw new ForbiddenException('No tienes permisos para acceder a esta solicitud');
        }

        return solicitud;
    }

    /**
     * Crea una nueva solicitud de servicio
     */
    async create(createSolicitudDto: CreateSolicitudDto, idUser: number) {
        const {
            fechaProgramada,
            ...restData
        } = createSolicitudDto;

        // Validar fecha programada
        let fechaProgramadaDate: Date | undefined;
        if (fechaProgramada) {
            fechaProgramadaDate = new Date(fechaProgramada);
            if (fechaProgramadaDate <= new Date()) {
                throw new BadRequestException('La fecha programada debe ser futura');
            }
        }

        const solicitud = await this.database.solicitud.create({
            data: {
                ...restData,
                idUser,
                fechaProgramada: fechaProgramadaDate,
                estadoSolicitud: EstadoSolicitud.PENDIENTE,
                createdBy: idUser
            }
        });

        return solicitud;
    }

    /**
     * Actualiza una solicitud existente
     */
    async update(
        idSolicitud: number,
        updateSolicitudDto: UpdateSolicitudDto,
        currentUser: { idUser: number; rol: string }
    ) {
        const solicitud = await this.findOne(idSolicitud, currentUser);

        const {
            fechaProgramada,
            fechaInicio,
            fechaFinalizacion,
            ...restData
        } = updateSolicitudDto;

        // Preparar datos de actualización
        const updateData: any = {
            ...restData,
            updatedBy: currentUser.idUser
        };

        if (fechaProgramada) updateData.fechaProgramada = new Date(fechaProgramada);
        if (fechaInicio) updateData.fechaInicio = new Date(fechaInicio);
        if (fechaFinalizacion) updateData.fechaFinalizacion = new Date(fechaFinalizacion);

        const solicitudActualizada = await this.database.solicitud.update({
            where: { idSolicitud },
            data: updateData
        });

        return solicitudActualizada;
    }

    /**
     * Cancela una solicitud (soft delete)
     */
    async cancel(
        idSolicitud: number,
        currentUser: { idUser: number; rol: string }
    ) {
        const solicitud = await this.findOne(idSolicitud, currentUser);

        // Solo se puede cancelar si está pendiente o aceptada
        if (![EstadoSolicitud.PENDIENTE, EstadoSolicitud.ACEPTADA].includes(solicitud.estadoSolicitud as EstadoSolicitud)) {
            throw new BadRequestException('Solo se pueden cancelar solicitudes pendientes o aceptadas');
        }

        return this.database.solicitud.update({
            where: { idSolicitud },
            data: {
                estadoSolicitud: EstadoSolicitud.CANCELADA,
                updatedBy: currentUser.idUser
            }
        });
    }

    /**
     * Elimina permanentemente una solicitud (solo administradores)
     */
    async remove(
        idSolicitud: number,
        currentUser: { idUser: number; rol: string }
    ) {
        if (currentUser.rol !== 'ADMIN') {
            throw new ForbiddenException('Solo los administradores pueden eliminar solicitudes');
        }

        const solicitud = await this.findOne(idSolicitud);

        // Verificar que no tenga relaciones activas
        if (solicitud.solicitudesTecnico.length > 0) {
            throw new BadRequestException('No se puede eliminar una solicitud con propuestas de técnicos');
        }

        return this.database.solicitud.update({
            where: { idSolicitud },
            data: {
                isActive: false,
                deletedAt: new Date(),
                updatedBy: currentUser.idUser
            }
        });
    }

    /**
     * Obtiene solicitudes por usuario
     */
    async findByUser(idUser: number, filterDto?: SolicitudFilterDto) {
        return this.findAll({
            ...filterDto,
            idUser
        });
    }

    /**
     * Obtiene estadísticas de solicitudes
     */
    async getStats(idUser?: number) {
        const where: any = { isActive: true };
        if (idUser) where.idUser = idUser;

        const [
            total,
            pendientes,
            aceptadas,
            completadas,
            canceladas
        ] = await Promise.all([
            this.database.solicitud.count({ where }),
            this.database.solicitud.count({
                where: { ...where, estadoSolicitud: EstadoSolicitud.PENDIENTE }
            }),
            this.database.solicitud.count({
                where: { ...where, estadoSolicitud: EstadoSolicitud.ACEPTADA }
            }),
            this.database.solicitud.count({
                where: { ...where, estadoSolicitud: EstadoSolicitud.COMPLETADA }
            }),
            this.database.solicitud.count({
                where: { ...where, estadoSolicitud: EstadoSolicitud.CANCELADA }
            })
        ]);

        return {
            total,
            pendientes,
            aceptadas,
            completadas,
            canceladas,
            porcentajes: {
                pendientes: total > 0 ? (pendientes / total) * 100 : 0,
                aceptadas: total > 0 ? (aceptadas / total) * 100 : 0,
                completadas: total > 0 ? (completadas / total) * 100 : 0,
                canceladas: total > 0 ? (canceladas / total) * 100 : 0
            }
        };
    }
}

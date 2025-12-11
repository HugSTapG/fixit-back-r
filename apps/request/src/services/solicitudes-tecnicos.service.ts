import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
    ConflictException
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import type { PrismaClient } from '../prismaClientRequest/generated';
import {
    CreateSolicitudTecnicoDto,
    UpdateSolicitudTecnicoDto,
    ResponderSolicitudDto
} from '../dto/solicitud-tecnico.dto';
import { EstadoAceptacion, EstadoSolicitud } from '@app/shared';

/**
 * Servicio para la gestión de propuestas técnico-solicitud
 */
@Injectable()
export class SolicitudesTecnicosService {
    constructor(private readonly database: DatabaseService) { }

    /**
     * Obtiene todas las propuestas técnico-solicitud
     */
    async findAll() {
        return this.database.solicitudTecnico.findMany({
            include: {
                solicitud: true
            },
            orderBy: {
                fechaPropuesta: 'desc'
            }
        });
    }

    /**
     * Busca una propuesta por ID
     */
    async findOne(idSolTec: number) {
        const propuesta = await this.database.solicitudTecnico.findUnique({
            where: { idSolTec },
            include: {
                solicitud: true
            }
        });

        if (!propuesta) {
            throw new NotFoundException(`Propuesta con ID ${idSolTec} no encontrada`);
        }

        return propuesta;
    }

    /**
     * Técnico se postula a una solicitud
     */
    async postularse(
        createDto: CreateSolicitudTecnicoDto,
        idTecnico: number
    ) {
        const { idSolicitud } = createDto;

        // Verificar que la solicitud existe y está pendiente
        const solicitud = await this.database.solicitud.findUnique({
            where: { idSolicitud, isActive: true }
        });

        if (!solicitud) {
            throw new NotFoundException(`Solicitud con ID ${idSolicitud} no encontrada`);
        }

        if (solicitud.estadoSolicitud !== EstadoSolicitud.PENDIENTE) {
            throw new BadRequestException('Solo se puede postular a solicitudes pendientes');
        }

        // Verificar que el técnico no se haya postulado ya
        const postulacionExistente = await this.database.solicitudTecnico.findUnique({
            where: {
                idSolicitud_idTecnico: {
                    idSolicitud,
                    idTecnico
                }
            }
        });

        if (postulacionExistente) {
            throw new ConflictException('Ya te has postulado a esta solicitud');
        }

        return this.database.solicitudTecnico.create({
            data: {
                idSolicitud,
                idTecnico,
                costoAcordado: createDto.costoAcordado,
                estadoAcuerdo: EstadoAceptacion.PROPUESTO,
                notas: createDto.notas
            },
            include: {
                solicitud: true
            }
        });
    }

    /**
     * Cliente acepta o rechaza una propuesta de técnico
     */
    async responder(
        idSolTec: number,
        respuestaDto: ResponderSolicitudDto,
        currentUser: { idUser: number; rol: string }
    ) {
        const propuesta = await this.findOne(idSolTec);

        // Verificar que el usuario actual es el dueño de la solicitud o admin
        if (currentUser.rol !== 'ADMIN' && propuesta.solicitud.idUser !== currentUser.idUser) {
            throw new ForbiddenException('No tienes permisos para responder a esta propuesta');
        }

        // Solo se puede responder a propuestas en estado PROPUESTO
        if (propuesta.estadoAcuerdo !== EstadoAceptacion.PROPUESTO) {
            throw new BadRequestException('Solo se puede responder a propuestas en estado PROPUESTO');
        }

        const { estadoAcuerdo, costoAcordado, notas } = respuestaDto;

        // Si se acepta la propuesta, actualizar el estado de la solicitud
        const updateData: any = {
            estadoAcuerdo,
            fechaConfirmada: new Date(),
            costoAcordado,
            notas
        };

        // Usar transacción para actualizar tanto la propuesta como la solicitud si es necesario
        return this.database.$transaction(async (prisma: PrismaClient) => {
            // Actualizar la propuesta
            const propuestaActualizada = await prisma.solicitudTecnico.update({
                where: { idSolTec },
                data: updateData,
                include: {
                    solicitud: true
                }
            });

            // Si se acepta la propuesta, actualizar el estado de la solicitud y rechazar otras propuestas
            if (estadoAcuerdo === EstadoAceptacion.ACEPTADO) {
                // Actualizar la solicitud a ACEPTADA
                await prisma.solicitud.update({
                    where: { idSolicitud: propuesta.idSolicitud },
                    data: {
                        estadoSolicitud: EstadoSolicitud.ACEPTADA,
                        updatedBy: currentUser.idUser
                    }
                });

                // Rechazar automáticamente otras propuestas pendientes
                await prisma.solicitudTecnico.updateMany({
                    where: {
                        idSolicitud: propuesta.idSolicitud,
                        idSolTec: { not: idSolTec },
                        estadoAcuerdo: EstadoAceptacion.PROPUESTO
                    },
                    data: {
                        estadoAcuerdo: EstadoAceptacion.RECHAZADO,
                        fechaConfirmada: new Date()
                    }
                });
            }

            return propuestaActualizada;
        });
    }

    /**
     * Obtiene propuestas por solicitud
     */
    async findBySolicitud(idSolicitud: number) {
        // Verificar que la solicitud existe
        const solicitud = await this.database.solicitud.findUnique({
            where: { idSolicitud, isActive: true }
        });

        if (!solicitud) {
            throw new NotFoundException(`Solicitud con ID ${idSolicitud} no encontrada`);
        }

        return this.database.solicitudTecnico.findMany({
            where: { idSolicitud },
            orderBy: {
                fechaPropuesta: 'desc'
            }
        });
    }

    /**
     * Obtiene propuestas por técnico
     */
    async findByTecnico(idTecnico: number) {
        return this.database.solicitudTecnico.findMany({
            where: { idTecnico },
            include: {
                solicitud: true
            },
            orderBy: {
                fechaPropuesta: 'desc'
            }
        });
    }

    /**
     * Actualiza una propuesta (solo el técnico propietario)
     */
    async update(
        idSolTec: number,
        updateDto: UpdateSolicitudTecnicoDto,
        idTecnico: number
    ) {
        const propuesta = await this.findOne(idSolTec);

        // Verificar que el técnico es el propietario de la propuesta
        if (propuesta.idTecnico !== idTecnico) {
            throw new ForbiddenException('No tienes permisos para actualizar esta propuesta');
        }

        // Solo se puede actualizar si está en estado PROPUESTO
        if (propuesta.estadoAcuerdo !== EstadoAceptacion.PROPUESTO) {
            throw new BadRequestException('Solo se pueden actualizar propuestas en estado PROPUESTO');
        }

        return this.database.solicitudTecnico.update({
            where: { idSolTec },
            data: updateDto,
            include: {
                solicitud: true
            }
        });
    }

    /**
     * Cancela una propuesta (solo el técnico propietario)
     */
    async cancelar(idSolTec: number, idTecnico: number) {
        const propuesta = await this.findOne(idSolTec);

        // Verificar que el técnico es el propietario de la propuesta
        if (propuesta.idTecnico !== idTecnico) {
            throw new ForbiddenException('No tienes permisos para cancelar esta propuesta');
        }

        // Solo se puede cancelar si está en estado PROPUESTO
        if (propuesta.estadoAcuerdo !== EstadoAceptacion.PROPUESTO) {
            throw new BadRequestException('Solo se pueden cancelar propuestas en estado PROPUESTO');
        }

        return this.database.solicitudTecnico.delete({
            where: { idSolTec }
        });
    }

    /**
     * Obtiene estadísticas de propuestas por técnico
     */
    async getStatsByTecnico(idTecnico: number) {
        const [
            total,
            propuestas,
            aceptadas,
            rechazadas
        ] = await Promise.all([
            this.database.solicitudTecnico.count({
                where: { idTecnico }
            }),
            this.database.solicitudTecnico.count({
                where: { idTecnico, estadoAcuerdo: EstadoAceptacion.PROPUESTO }
            }),
            this.database.solicitudTecnico.count({
                where: { idTecnico, estadoAcuerdo: EstadoAceptacion.ACEPTADO }
            }),
            this.database.solicitudTecnico.count({
                where: { idTecnico, estadoAcuerdo: EstadoAceptacion.RECHAZADO }
            })
        ]);

        return {
            total,
            propuestas,
            aceptadas,
            rechazadas,
            tasaAceptacion: total > 0 ? (aceptadas / total) * 100 : 0
        };
    }
}

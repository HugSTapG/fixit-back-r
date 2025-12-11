// apps/technician/src/services/tecnicos-certificaciones.service.ts
import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
    ConflictException,
    Logger
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
    CreateTecnicoCertificacionDto,
    UpdateTecnicoCertificacionDto
} from '../dto/tecnico-certificacion.dto';
import { RolUsuario, EstatusCertificacion } from '@app/shared';

/**
 * Servicio para la gestión de certificaciones de técnicos
 */
@Injectable()
export class TecnicosCertificacionesService {
    private readonly logger = new Logger(TecnicosCertificacionesService.name);

    constructor(private readonly databaseService: DatabaseService) { }

    /**
     * Obtiene todas las certificaciones de técnicos
     */
    async findAll() {
        try {
            this.logger.log('Fetching all technician certifications');
            
            return await this.databaseService.tecnicoCertificacion.findMany({
                include: {
                    tecnico: true,
                    certificacion: true
                },
                orderBy: {
                    fechaObtencion: 'desc'
                }
            });
        } catch (error) {
            this.logger.error('Error fetching all technician certifications', error.stack);
            throw error;
        }
    }

    /**
     * Busca una certificación de técnico por ID
     */
    async findOne(idTecCert: number) {
        try {
            this.logger.log(`Fetching technician certification with ID: ${idTecCert}`);
            
            const tecnicoCertificacion = await this.databaseService.tecnicoCertificacion.findUnique({
                where: { idTecCert },
                include: {
                    tecnico: true,
                    certificacion: true
                }
            });

            if (!tecnicoCertificacion) {
                throw new NotFoundException(`Certificación de técnico con ID ${idTecCert} no encontrada`);
            }

            return tecnicoCertificacion;
        } catch (error) {
            this.logger.error(`Error fetching technician certification with ID: ${idTecCert}`, error.stack);
            throw error;
        }
    }

    /**
     * Asigna una certificación a un técnico
     */
    async create(
        idTecnico: number,
        createTecnicoCertificacionDto: CreateTecnicoCertificacionDto,
        currentUser: { idUser: number; roles: RolUsuario[] }
    ) {
        try {
            this.logger.log(`Creating certification for technician: ${idTecnico}`);
            
            const { idCertificacion, fechaObtencion, fechaVencimiento, documento, estatusCertificacion } = createTecnicoCertificacionDto;

            // Verificar que el técnico existe
            const tecnico = await this.databaseService.tecnico.findUnique({
                where: { idTecnico }
            });

            if (!tecnico) {
                throw new NotFoundException(`Técnico con ID ${idTecnico} no encontrado`);
            }

            // Verificar permisos - solo el técnico propietario o admin
            if (!currentUser.roles.includes(RolUsuario.ADMIN) && tecnico.idUser !== currentUser.idUser) {
                throw new ForbiddenException('No tienes permisos para asignar certificaciones a este técnico');
            }

            // Verificar que la certificación existe
            const certificacion = await this.databaseService.certificacion.findUnique({
                where: { idCertificacion }
            });

            if (!certificacion) {
                throw new NotFoundException(`Certificación con ID ${idCertificacion} no encontrada`);
            }

            // Verificar que no existe ya esta certificación para este técnico
            const certificacionExistente = await this.databaseService.tecnicoCertificacion.findUnique({
                where: {
                    idTecnico_idCertificacion: {
                        idTecnico,
                        idCertificacion
                    }
                }
            });

            if (certificacionExistente) {
                throw new ConflictException('El técnico ya tiene esta certificación asignada');
            }

            // Validar fechas
            const fechaObt = new Date(fechaObtencion);
            const fechaVenc = new Date(fechaVencimiento);

            if (fechaVenc <= fechaObt) {
                throw new BadRequestException('La fecha de vencimiento debe ser posterior a la fecha de obtención');
            }

            const tecnicoCertificacion = await this.databaseService.tecnicoCertificacion.create({
                data: {
                    idTecnico,
                    idCertificacion,
                    fechaObtencion: fechaObt,
                    fechaVencimiento: fechaVenc,
                    documento,
                    estatusCertificacion: estatusCertificacion || EstatusCertificacion.PENDIENTE
                },
                include: {
                    tecnico: true,
                    certificacion: true
                }
            });

            this.logger.log(`Certification created successfully for technician: ${idTecnico}`);
            return tecnicoCertificacion;
        } catch (error) {
            this.logger.error(`Error creating certification for technician: ${idTecnico}`, error.stack);
            throw error;
        }
    }

    /**
     * Actualiza una certificación de técnico
     */
    async update(
        idTecCert: number,
        updateTecnicoCertificacionDto: UpdateTecnicoCertificacionDto,
        currentUser: { idUser: number; roles: RolUsuario[] }
    ) {
        try {
            this.logger.log(`Updating technician certification: ${idTecCert}`);
            
            const tecnicoCertificacion = await this.findOne(idTecCert);

            // Verificar permisos
            if (!currentUser.roles.includes(RolUsuario.ADMIN) && tecnicoCertificacion.tecnico.idUser !== currentUser.idUser) {
                throw new ForbiddenException('No tienes permisos para actualizar esta certificación');
            }

            const { fechaObtencion, fechaVencimiento, ...restData } = updateTecnicoCertificacionDto;
            const updateData: any = { ...restData };

            if (fechaObtencion) updateData.fechaObtencion = new Date(fechaObtencion);
            if (fechaVencimiento) updateData.fechaVencimiento = new Date(fechaVencimiento);

            // Validar fechas si se proporcionan ambas
            if (updateData.fechaObtencion && updateData.fechaVencimiento) {
                if (updateData.fechaVencimiento <= updateData.fechaObtencion) {
                    throw new BadRequestException('La fecha de vencimiento debe ser posterior a la fecha de obtención');
                }
            }

            const certificacionActualizada = await this.databaseService.tecnicoCertificacion.update({
                where: { idTecCert },
                data: updateData,
                include: {
                    tecnico: true,
                    certificacion: true
                }
            });

            this.logger.log(`Technician certification updated successfully: ${idTecCert}`);
            return certificacionActualizada;
        } catch (error) {
            this.logger.error(`Error updating technician certification: ${idTecCert}`, error.stack);
            throw error;
        }
    }

    /**
     * Verifica una certificación (solo admin)
     */
    async verificar(
        idTecCert: number,
        currentUser: { idUser: number; rol: RolUsuario }
    ) {
        try {
            this.logger.log(`Verifying certification: ${idTecCert}`);
            
            if (currentUser.rol !== RolUsuario.ADMIN) {
                throw new ForbiddenException('Solo los administradores pueden verificar certificaciones');
            }

            const tecnicoCertificacion = await this.findOne(idTecCert);

            if (tecnicoCertificacion.estatusCertificacion === EstatusCertificacion.VERIFICADA) {
                throw new BadRequestException('Esta certificación ya está verificada');
            }

            const result = await this.databaseService.tecnicoCertificacion.update({
                where: { idTecCert },
                data: { estatusCertificacion: EstatusCertificacion.VERIFICADA },
                include: {
                    tecnico: true,
                    certificacion: true
                }
            });

            this.logger.log(`Certification verified successfully: ${idTecCert}`);
            return result;
        } catch (error) {
            this.logger.error(`Error verifying certification: ${idTecCert}`, error.stack);
            throw error;
        }
    }

    /**
     * Rechaza una certificación (solo admin)
     */
    async rechazar(
        idTecCert: number,
        currentUser: { idUser: number; rol: RolUsuario }
    ) {
        try {
            this.logger.log(`Rejecting certification: ${idTecCert}`);
            
            if (currentUser.rol !== RolUsuario.ADMIN) {
                throw new ForbiddenException('Solo los administradores pueden rechazar certificaciones');
            }

            const result = await this.databaseService.tecnicoCertificacion.update({
                where: { idTecCert },
                data: { estatusCertificacion: EstatusCertificacion.RECHAZADA },
                include: {
                    tecnico: true,
                    certificacion: true
                }
            });

            this.logger.log(`Certification rejected successfully: ${idTecCert}`);
            return result;
        } catch (error) {
            this.logger.error(`Error rejecting certification: ${idTecCert}`, error.stack);
            throw error;
        }
    }

    /**
     * Elimina una certificación de técnico
     */
    async remove(
        idTecCert: number,
        currentUser: { idUser: number; rol: RolUsuario }
    ) {
        try {
            this.logger.log(`Removing technician certification: ${idTecCert}`);
            
            const tecnicoCertificacion = await this.findOne(idTecCert);

            // Obtener datos del técnico para verificación de permisos
            const tecnico = await this.databaseService.tecnico.findUnique({
                where: { idTecnico: tecnicoCertificacion.idTecnico }
            });

            if (!tecnico) {
                throw new NotFoundException('Técnico no encontrado');
            }

            // Verificar permisos
            if (currentUser.rol !== RolUsuario.ADMIN && tecnico.idUser !== currentUser.idUser) {
                throw new ForbiddenException('No tienes permisos para eliminar esta certificación');
            }

            const result = await this.databaseService.tecnicoCertificacion.delete({
                where: { idTecCert }
            });

            this.logger.log(`Technician certification removed successfully: ${idTecCert}`);
            return result;
        } catch (error) {
            this.logger.error(`Error removing technician certification: ${idTecCert}`, error.stack);
            throw error;
        }
    }

    /**
     * Obtiene certificaciones por técnico
     */
    async findByTecnico(idTecnico: number) {
        try {
            this.logger.log(`Fetching certifications for technician: ${idTecnico}`);
            
            return await this.databaseService.tecnicoCertificacion.findMany({
                where: { idTecnico },
                include: {
                    certificacion: true
                },
                orderBy: {
                    fechaObtencion: 'desc'
                }
            });
        } catch (error) {
            this.logger.error(`Error fetching certifications for technician: ${idTecnico}`, error.stack);
            throw error;
        }
    }

    /**
     * Obtiene certificaciones por certificación específica
     */
    async findByCertificacion(idCertificacion: number) {
        try {
            this.logger.log(`Fetching technicians for certification: ${idCertificacion}`);
            
            return await this.databaseService.tecnicoCertificacion.findMany({
                where: { idCertificacion },
                include: {
                    tecnico: true,
                    certificacion: true
                },
                orderBy: {
                    fechaObtencion: 'desc'
                }
            });
        } catch (error) {
            this.logger.error(`Error fetching technicians for certification: ${idCertificacion}`, error.stack);
            throw error;
        }
    }

    /**
     * Obtiene certificaciones pendientes de verificación
     */
    async findPendingVerification() {
        try {
            this.logger.log('Fetching pending certifications');
            
            return await this.databaseService.tecnicoCertificacion.findMany({
                where: {
                    estatusCertificacion: EstatusCertificacion.PENDIENTE
                },
                include: {
                    tecnico: true,
                    certificacion: true
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });
        } catch (error) {
            this.logger.error('Error fetching pending certifications', error.stack);
            throw error;
        }
    }

    /**
     * Obtiene certificaciones verificadas
     */
    async findVerified(limit?: number | string) {
        try {
            this.logger.log('Fetching verified certifications');
            
            // Convert query parameter (string) to number for Prisma
            const parsedLimit = Number(limit) || 20;
            
            return await this.databaseService.tecnicoCertificacion.findMany({
                where: {
                    estatusCertificacion: EstatusCertificacion.VERIFICADA
                },
                include: {
                    tecnico: true,
                    certificacion: true
                },
                orderBy: {
                    fechaObtencion: 'desc'
                },
                take: parsedLimit
            });
        } catch (error) {
            this.logger.error('Error fetching verified certifications', error.stack);
            throw error;
        }
    }

    /**
     * Obtiene certificaciones próximas a vencer
     */
    async findExpiringCertifications(diasAnticipacion: number = 30) {
        try {
            this.logger.log(`Fetching expiring certifications (${diasAnticipacion} days)`);
            
            const fechaLimite = new Date();
            fechaLimite.setDate(fechaLimite.getDate() + diasAnticipacion);

            return await this.databaseService.tecnicoCertificacion.findMany({
                where: {
                    fechaVencimiento: {
                        lte: fechaLimite,
                        gt: new Date()
                    },
                    estatusCertificacion: EstatusCertificacion.VERIFICADA
                },
                include: {
                    tecnico: true,
                    certificacion: true
                },
                orderBy: {
                    fechaVencimiento: 'asc'
                }
            });
        } catch (error) {
            this.logger.error('Error fetching expiring certifications', error.stack);
            throw error;
        }
    }

    /**
     * Marca certificaciones vencidas
     */
    async markExpiredCertifications() {
        try {
            this.logger.log('Marking expired certifications');
            
            const now = new Date();

            const result = await this.databaseService.tecnicoCertificacion.updateMany({
                where: {
                    fechaVencimiento: {
                        lt: now
                    },
                    estatusCertificacion: {
                        not: EstatusCertificacion.VENCIDA
                    }
                },
                data: {
                    estatusCertificacion: EstatusCertificacion.VENCIDA
                }
            });

            this.logger.log(`${result.count} certifications marked as expired`);
            
            return {
                message: `${result.count} certificaciones marcadas como vencidas`,
                count: result.count
            };
        } catch (error) {
            this.logger.error('Error marking expired certifications', error.stack);
            throw error;
        }
    }

    /**
     * Obtiene estadísticas de certificaciones
     */
    async getStats() {
        try {
            this.logger.log('Fetching certification statistics');
            
            const [
                total,
                pendientes,
                verificadas,
                rechazadas,
                vencidas,
                proximasVencer,
                porCertificacion
            ] = await Promise.all([
                this.databaseService.tecnicoCertificacion.count(),
                this.databaseService.tecnicoCertificacion.count({
                    where: { estatusCertificacion: EstatusCertificacion.PENDIENTE }
                }),
                this.databaseService.tecnicoCertificacion.count({
                    where: { estatusCertificacion: EstatusCertificacion.VERIFICADA }
                }),
                this.databaseService.tecnicoCertificacion.count({
                    where: { estatusCertificacion: EstatusCertificacion.RECHAZADA }
                }),
                this.databaseService.tecnicoCertificacion.count({
                    where: { estatusCertificacion: EstatusCertificacion.VENCIDA }
                }),
                this.databaseService.tecnicoCertificacion.count({
                    where: {
                        fechaVencimiento: {
                            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
                            gt: new Date()
                        },
                        estatusCertificacion: EstatusCertificacion.VERIFICADA
                    }
                }),
                this.databaseService.tecnicoCertificacion.groupBy({
                    by: ['idCertificacion'],
                    _count: { idCertificacion: true },
                    orderBy: {
                        _count: {
                            idCertificacion: 'desc'
                        }
                    },
                    take: 5
                })
            ]);

            return {
                total,
                pendientes,
                verificadas,
                rechazadas,
                vencidas,
                proximasVencer,
                porcentajes: {
                    pendientes: total > 0 ? (pendientes / total) * 100 : 0,
                    verificadas: total > 0 ? (verificadas / total) * 100 : 0,
                    rechazadas: total > 0 ? (rechazadas / total) * 100 : 0,
                    vencidas: total > 0 ? (vencidas / total) * 100 : 0
                },
                certificacionesPopulares: porCertificacion.map(cert => ({
                    idCertificacion: cert.idCertificacion,
                    cantidad: cert._count.idCertificacion
                }))
            };
        } catch (error) {
            this.logger.error('Error fetching certification statistics', error.stack);
            throw error;
        }
    }

    /**
     * Obtiene estadísticas por técnico
     */
    async getStatsByTecnico(idTecnico: number) {
        try {
            this.logger.log(`Fetching certification statistics for technician: ${idTecnico}`);
            
            const [
                total,
                pendientes,
                verificadas,
                rechazadas,
                vencidas,
                certificaciones
            ] = await Promise.all([
                this.databaseService.tecnicoCertificacion.count({
                    where: { idTecnico }
                }),
                this.databaseService.tecnicoCertificacion.count({
                    where: {
                        idTecnico,
                        estatusCertificacion: EstatusCertificacion.PENDIENTE
                    }
                }),
                this.databaseService.tecnicoCertificacion.count({
                    where: {
                        idTecnico,
                        estatusCertificacion: EstatusCertificacion.VERIFICADA
                    }
                }),
                this.databaseService.tecnicoCertificacion.count({
                    where: {
                        idTecnico,
                        estatusCertificacion: EstatusCertificacion.RECHAZADA
                    }
                }),
                this.databaseService.tecnicoCertificacion.count({
                    where: {
                        idTecnico,
                        estatusCertificacion: EstatusCertificacion.VENCIDA
                    }
                }),
                this.databaseService.tecnicoCertificacion.findMany({
                    where: { idTecnico },
                    include: {
                        certificacion: {
                            select: {
                                nombreCertificacion: true,
                                entidadCertificacion: true
                            }
                        }
                    }
                })
            ]);

            return {
                idTecnico,
                total,
                pendientes,
                verificadas,
                rechazadas,
                vencidas,
                porcentajes: {
                    pendientes: total > 0 ? (pendientes / total) * 100 : 0,
                    verificadas: total > 0 ? (verificadas / total) * 100 : 0,
                    rechazadas: total > 0 ? (rechazadas / total) * 100 : 0,
                    vencidas: total > 0 ? (vencidas / total) * 100 : 0
                },
                certificaciones: certificaciones.map(cert => ({
                    idTecCert: cert.idTecCert,
                    nombreCertificacion: cert.certificacion.nombreCertificacion,
                    entidadCertificacion: cert.certificacion.entidadCertificacion,
                    estatus: cert.estatusCertificacion,
                    fechaObtencion: cert.fechaObtencion,
                    fechaVencimiento: cert.fechaVencimiento
                }))
            };
        } catch (error) {
            this.logger.error(`Error fetching certification statistics for technician: ${idTecnico}`, error.stack);
            throw error;
        }
    }

    /**
     * Renueva una certificación (crea una nueva versión)
     */
    async renovarCertificacion(
        idTecCert: number,
        createTecnicoCertificacionDto: CreateTecnicoCertificacionDto,
        currentUser: { idUser: number; roles: RolUsuario[] }
    ) {
        try {
            this.logger.log(`Renewing certification: ${idTecCert}`);
            
            const certificacionAnterior = await this.findOne(idTecCert);

            // Obtener datos del técnico para verificación de permisos
            const tecnico = await this.databaseService.tecnico.findUnique({
                where: { idTecnico: certificacionAnterior.idTecnico }
            });

            if (!tecnico) {
                throw new NotFoundException('Técnico no encontrado');
            }

            // Verificar permisos
            if (!currentUser.roles.includes(RolUsuario.ADMIN) && tecnico.idUser !== currentUser.idUser) {
                throw new ForbiddenException('No tienes permisos para renovar esta certificación');
            }

            // Marcar la certificación anterior como vencida
            await this.databaseService.tecnicoCertificacion.update({
                where: { idTecCert },
                data: {
                    estatusCertificacion: EstatusCertificacion.VENCIDA
                }
            });

            // Crear la nueva certificación
            const result = await this.create(
                certificacionAnterior.idTecnico,
                {
                    ...createTecnicoCertificacionDto,
                    idCertificacion: certificacionAnterior.idCertificacion
                },
                currentUser
            );

            this.logger.log(`Certification renewed successfully: ${idTecCert}`);
            return result;
        } catch (error) {
            this.logger.error(`Error renewing certification: ${idTecCert}`, error.stack);
            throw error;
        }
    }
}

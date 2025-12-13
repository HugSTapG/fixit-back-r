import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
    Logger
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { KafkaService } from '@app/events';
import { CreateCalificacionDto, UpdateCalificacionDto } from '../dto';
import { CalificacionMapper } from '../mappers';
import { RolUsuario, PuntajeCalificacion } from '@app/shared';

@Injectable()
export class CalificacionesService {
    private readonly logger = new Logger(CalificacionesService.name);

    /**
     * Mapeo de puntajes a valores numéricos para cálculos
     */
    private readonly puntajeValues = {
        [PuntajeCalificacion.TERRIBLE]: 1,
        [PuntajeCalificacion.MALO]: 2,
        [PuntajeCalificacion.REGULAR]: 3,
        [PuntajeCalificacion.BUENO]: 4,
        [PuntajeCalificacion.EXCELENTE]: 5
    };

    constructor(
        private readonly database: DatabaseService,
        private readonly kafkaService: KafkaService,
    ) { }

    /**
     * Crea una nueva calificación
     * Nota: Las validaciones de solicitud se harán en el API Gateway
     * consultando al microservicio Request cuando esté disponible
     */
    async create(
        createCalificacionDto: CreateCalificacionDto,
        currentUser: { idUser: number; roles: RolUsuario[] }
    ) {
        const { idSolicitud, idTecnico, puntaje } = createCalificacionDto;

        // Verificar que el técnico existe
        const tecnico = await this.database.tecnico.findUnique({
            where: { idTecnico }
        });

        if (!tecnico) {
            throw new NotFoundException(`Técnico con ID ${idTecnico} no encontrado`);
        }

        // Verificar que no haya una calificación previa para esta solicitud y técnico
        const calificacionExistente = await this.database.calificacion.findFirst({
            where: {
                idSolicitud,
                idTecnico
            }
        });

        if (calificacionExistente) {
            throw new ConflictException('Ya existe una calificación para este servicio');
        }

        // Crear la calificación usando transacción para actualizar estadísticas del técnico
        return this.database.$transaction(async (prisma) => {
            // Crear la calificación
            const createData = CalificacionMapper.toPrismaCreateData(createCalificacionDto);

            const nuevaCalificacion = await prisma.calificacion.create({
                data: createData,
                include: {
                    tecnico: true
                }
            });

            // Actualizar estadísticas del técnico
            await this.actualizarEstadisticasTecnico(prisma, idTecnico);

            // Emitir evento
            await this.kafkaService.publishEvent('technician.calificacion.created', {
                idCalificacion: nuevaCalificacion.idCalificacion,
                idTecnico,
                idSolicitud,
                puntaje,
                timestamp: new Date(),
            });

            return CalificacionMapper.toInterface(nuevaCalificacion);
        });
    }

    /**
     * Actualiza una calificación existente
     */
    async update(
        idCalificacion: number,
        updateCalificacionDto: UpdateCalificacionDto,
        currentUser: { idUser: number; roles: RolUsuario[] }
    ) {
        const calificacion = await this.database.calificacion.findUnique({
            where: { idCalificacion }
        });

        if (!calificacion) {
            throw new NotFoundException(`Calificación con ID ${idCalificacion} no encontrada`);
        }

        // Verificar que la calificación no sea muy antigua (ej: 7 días)
        const diasTranscurridos = Math.floor(
            (Date.now() - calificacion.fechaCalificacion.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diasTranscurridos > 7 && !currentUser.roles.includes(RolUsuario.ADMIN)) {
            throw new BadRequestException('No se pueden actualizar calificaciones después de 7 días');
        }

        return this.database.$transaction(async (prisma) => {
            const updateData = CalificacionMapper.toPrismaUpdateData(updateCalificacionDto);

            // Actualizar la calificación
            const calificacionActualizada = await prisma.calificacion.update({
                where: { idCalificacion },
                data: updateData,
                include: {
                    tecnico: true
                }
            });

            // Recalcular estadísticas del técnico si cambió el puntaje
            if (updateCalificacionDto.puntaje) {
                await this.actualizarEstadisticasTecnico(prisma, calificacion.idTecnico);
            }

            // Emitir evento
            await this.kafkaService.publishEvent('technician.calificacion.updated', {
                idCalificacion,
                changes: updateCalificacionDto,
                timestamp: new Date(),
            });

            return CalificacionMapper.toInterface(calificacionActualizada);
        });
    }

    /**
     * Obtiene todas las calificaciones (solo ADMIN)
     */
    async findAll(filterDto?: any) {
        const {
            limit = 20,
            page = 1,
            idTecnico,
            puntaje
        } = filterDto || {};

        const parsedLimit = Number(limit) || 20;
        const parsedPage = Number(page) || 1;
        const skip = (parsedPage - 1) * parsedLimit;

        const where: any = {};

        if (idTecnico) {
            where.idTecnico = Number(idTecnico);
        }

        if (puntaje) {
            where.puntaje = puntaje;
        }

        const [calificaciones, total] = await Promise.all([
            this.database.calificacion.findMany({
                where,
                orderBy: { fechaCalificacion: 'desc' },
                take: parsedLimit,
                skip,
                include: {
                    tecnico: true
                }
            }),
            this.database.calificacion.count({ where })
        ]);

        return {
            calificaciones: calificaciones.map(c => CalificacionMapper.toInterface(c)),
            pagination: {
                total,
                page: parsedPage,
                limit: parsedLimit,
                totalPages: Math.ceil(total / parsedLimit)
            }
        };
    }

    /**
     * Obtiene calificaciones por técnico
     */
    async findByTecnico(idTecnico: number, filterDto?: any) {
        const {
            limit = 20,
            page = 1
        } = filterDto || {};

        // Convert query parameters (strings) to numbers for Prisma
        const parsedLimit = Number(limit) || 20;
        const parsedPage = Number(page) || 1;

        const skip = (parsedPage - 1) * parsedLimit;

        const [calificaciones, total] = await Promise.all([
            this.database.calificacion.findMany({
                where: { idTecnico },
                orderBy: { fechaCalificacion: 'desc' },
                take: parsedLimit,
                skip
            }),
            this.database.calificacion.count({ where: { idTecnico } })
        ]);

        return {
            calificaciones: calificaciones.map(c => CalificacionMapper.toInterface(c)),
            pagination: {
                total,
                page: parsedPage,
                limit: parsedLimit,
                totalPages: Math.ceil(total / parsedLimit)
            }
        };
    }

    /**
     * Elimina una calificación (solo ADMIN)
     */
    async delete(
        idCalificacion: number,
        currentUser: { idUser: number; roles: RolUsuario[] }
    ) {
        // Verificar que es admin
        if (!currentUser.roles.includes(RolUsuario.ADMIN)) {
            throw new BadRequestException('Solo los administradores pueden eliminar calificaciones');
        }

        const calificacion = await this.database.calificacion.findUnique({
            where: { idCalificacion }
        });

        if (!calificacion) {
            throw new NotFoundException(`Calificación con ID ${idCalificacion} no encontrada`);
        }

        return this.database.$transaction(async (prisma) => {
            // Eliminar la calificación
            await prisma.calificacion.delete({
                where: { idCalificacion }
            });

            // Actualizar estadísticas del técnico
            await this.actualizarEstadisticasTecnico(prisma, calificacion.idTecnico);

            // Emitir evento
            await this.kafkaService.publishEvent('technician.calificacion.deleted', {
                idCalificacion,
                idTecnico: calificacion.idTecnico,
                timestamp: new Date(),
            });

            return { message: 'Calificación eliminada exitosamente' };
        });
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
            return { promedio: null, total: 0 };
        }

        // Calcular promedio según puntajes numéricos - CORREGIDO: tipos explícitos
        const sumaValores = calificaciones.reduce((suma: number, cal: any) => {
            return suma + this.puntajeValues[cal.puntaje as PuntajeCalificacion];
        }, 0);

        const promedio = Number((sumaValores / calificaciones.length).toFixed(2));

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
     * Actualiza las estadísticas de calificaciones de un técnico (privado)
     */
    private async actualizarEstadisticasTecnico(prisma: any, idTecnico: number) {
        const calificaciones = await prisma.calificacion.findMany({
            where: { idTecnico }
        });

        const totalCalificaciones = calificaciones.length;

        if (totalCalificaciones === 0) {
            await prisma.tecnico.update({
                where: { idTecnico },
                data: {
                    totalCalificaciones: 0,
                    promedioCalificaciones: null
                }
            });
            return;
        }

        // Calcular promedio numérico - CORREGIDO: tipos explícitos
        const sumaValores = calificaciones.reduce((suma: number, cal: any) => {
            return suma + this.puntajeValues[cal.puntaje as PuntajeCalificacion];
        }, 0);

        const promedio = Number((sumaValores / totalCalificaciones).toFixed(2));

        await prisma.tecnico.update({
            where: { idTecnico },
            data: {
                totalCalificaciones,
                promedioCalificaciones: promedio
            }
        });
    }
}

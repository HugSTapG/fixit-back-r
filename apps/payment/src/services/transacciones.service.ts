import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
    Logger,
    Inject
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { DatabaseService } from '../database/database.service';
import {
    CreateTransaccionDto,
    UpdateTransaccionDto,
    ProcesarPagoDto,
    TransaccionFilterDto
} from '../dto/transaccion.dto';
import { EstadoPago, EstadoSolicitud, RolUsuario, MetodoPago } from '@app/shared';
import { REQUEST_PATTERNS, AUTH_PATTERNS, TECHNICIAN_PATTERNS } from '@app/events';

/**
 * Servicio para la gestión de transacciones y pagos en microservicio
 */
@Injectable()
export class TransaccionesService {
    private readonly logger = new Logger(TransaccionesService.name);

    constructor(
        private readonly prisma: DatabaseService,
        @Inject('REQUEST_SERVICE') private readonly requestClient: ClientProxy,
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
        @Inject('TECHNICIAN_SERVICE') private readonly technicianClient: ClientProxy,
    ) { }

    /**
     * Obtiene todas las transacciones con filtros opcionales
     */
    async findAll(filterDto?: TransaccionFilterDto) {
        this.logger.log('Finding all transacciones with filters');

        const {
            idSolicitud,
            metodoPago,
            estadoPago,
            fechaInicio,
            fechaFin,
            limit = 20,
            page = 1
        } = filterDto || {};

        const where: any = {};
        if (idSolicitud) where.idSolicitud = idSolicitud;
        if (metodoPago) where.metodoPago = metodoPago;
        if (estadoPago) where.estadoPago = estadoPago;

        // Filtro por rango de fechas
        if (fechaInicio || fechaFin) {
            where.createdAt = {};
            if (fechaInicio) where.createdAt.gte = new Date(fechaInicio);
            if (fechaFin) where.createdAt.lte = new Date(fechaFin);
        }

        const skip = (page - 1) * limit;

        try {
            const [transacciones, total] = await Promise.all([
                this.prisma.transaccion.findMany({
                    where,
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: limit,
                    skip
                }),
                this.prisma.transaccion.count({ where })
            ]);

            return {
                transacciones,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            this.logger.error('Error finding all transacciones', error.stack);
            throw new BadRequestException('Error al obtener las transacciones');
        }
    }

    /**
     * Busca una transacción por su ID
     */
    async findOne(idTransaccion: number) {
        this.logger.log(`Finding transaccion: ${idTransaccion}`);

        try {
            const transaccion = await this.prisma.transaccion.findUnique({
                where: { idTransaccion }
            });

            if (!transaccion) {
                throw new NotFoundException(`Transacción con ID ${idTransaccion} no encontrada`);
            }

            return transaccion;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error finding transaccion ${idTransaccion}`, error.stack);
            throw new BadRequestException('Error al obtener la transacción');
        }
    }

    /**
     * Verifica si una solicitud existe y obtiene su información del microservicio Request
     */
    private async getSolicitudFromRequestService(idSolicitud: number) {
        try {
            this.logger.log(`Verifying solicitud ${idSolicitud} with Request service`);

            const response = await firstValueFrom(
                this.requestClient.send(REQUEST_PATTERNS.FIND_SOLICITUD_BY_ID, { idSolicitud })
            );

            if (!response.success) {
                throw new NotFoundException(`Solicitud con ID ${idSolicitud} no encontrada`);
            }

            return response.data;
        } catch (error) {
            this.logger.error(`Error communicating with Request service for solicitud ${idSolicitud}`, error);

            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new BadRequestException('Error al verificar la solicitud');
        }
    }

    /**
     * Obtiene información del usuario desde el microservicio Auth
     */
    private async getUserFromAuthService(idUser: number) {
        try {
            this.logger.log(`Getting user ${idUser} from Auth service`);

            const response = await firstValueFrom(
                this.authClient.send(AUTH_PATTERNS.FIND_USER_BY_ID, { id: idUser })
            );

            if (!response.success) {
                throw new NotFoundException(`Usuario con ID ${idUser} no encontrado`);
            }

            return response.data;
        } catch (error) {
            this.logger.error(`Error communicating with Auth service for user ${idUser}`, error);

            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new BadRequestException('Error al verificar el usuario');
        }
    }

    /**
     * Obtiene información del tipo de servicio desde el microservicio Technician
     */
    private async getTipoServicioFromTechnicianService(idTipoServicio: number) {
        try {
            this.logger.log(`Getting tipo servicio ${idTipoServicio} from Technician service`);

            const response = await firstValueFrom(
                this.technicianClient.send(TECHNICIAN_PATTERNS.FIND_TIPO_SERVICIO_BY_ID, { idTipoServicio })
            );

            if (!response.success) {
                throw new NotFoundException(`Tipo de servicio con ID ${idTipoServicio} no encontrado`);
            }

            return response.data;
        } catch (error) {
            this.logger.error(`Error communicating with Technician service for tipo servicio ${idTipoServicio}`, error);

            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new BadRequestException('Error al verificar el tipo de servicio');
        }
    }

    /**
     * Crea una nueva transacción
     */
    async create(
        createTransaccionDto: CreateTransaccionDto,
        currentUser: { idUser: number; rol: string }
    ) {
        this.logger.log(`Creating transaccion for solicitud: ${createTransaccionDto.idSolicitud}`);

        const { idSolicitud, monto, metodoPago, fechaPago } = createTransaccionDto;

        try {
            // Verificar que la solicitud existe en el microservicio Request
            const solicitud = await this.getSolicitudFromRequestService(idSolicitud);

            // Verificar que el usuario de la solicitud existe en Auth Service
            await this.getUserFromAuthService(solicitud.idUser);

            // Verificar que el tipo de servicio existe en Technician Service
            await this.getTipoServicioFromTechnicianService(solicitud.idTipoServicio);

            // Verificar permisos
            if (currentUser.rol !== RolUsuario.ADMIN && solicitud.idUser !== currentUser.idUser) {
                throw new ForbiddenException('No tienes permisos para crear transacciones para esta solicitud');
            }

            // Verificar que la solicitud esté completada
            if (solicitud.estadoSolicitud !== EstadoSolicitud.COMPLETADA) {
                throw new BadRequestException('Solo se pueden crear transacciones para solicitudes completadas');
            }

            // Verificar que no haya una transacción pagada existente para esta solicitud
            const transaccionExistente = await this.prisma.transaccion.findFirst({
                where: {
                    idSolicitud,
                    estadoPago: EstadoPago.PAGADO
                }
            });

            if (transaccionExistente) {
                throw new BadRequestException('Ya existe una transacción pagada para esta solicitud');
            }

            const transaccion = await this.prisma.transaccion.create({
                data: {
                    idSolicitud,
                    monto,
                    metodoPago,
                    fechaPago: fechaPago ? new Date(fechaPago) : null,
                    estadoPago: EstadoPago.PENDIENTE
                }
            });

            this.logger.log(`Transaccion created successfully: ${transaccion.idTransaccion}`);

            return {
                transaccion,
                solicitud: {
                    idSolicitud: solicitud.idSolicitud,
                    tituloProblema: solicitud.tituloProblema,
                    estadoSolicitud: solicitud.estadoSolicitud
                }
            };
        } catch (error) {
            if (error instanceof NotFoundException ||
                error instanceof ForbiddenException ||
                error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`Error creating transaccion for solicitud ${idSolicitud}`, error.stack);
            throw new BadRequestException('Error al crear la transacción');
        }
    }

    /**
     * Procesa un pago para una solicitud
     */
    async procesarPago(
        idSolicitud: number,
        procesarPagoDto: ProcesarPagoDto,
        currentUser: { idUser: number; rol: string }
    ) {
        this.logger.log(`Processing payment for solicitud: ${idSolicitud}`);

        const { metodoPago, informacionPago } = procesarPagoDto;

        try {
            // Verificar que la solicitud existe en el microservicio Request
            const solicitud = await this.getSolicitudFromRequestService(idSolicitud);

            // Verificar que el usuario existe en Auth Service
            await this.getUserFromAuthService(solicitud.idUser);

            // Verificar que el tipo de servicio existe en Technician Service
            await this.getTipoServicioFromTechnicianService(solicitud.idTipoServicio);

            // Verificar permisos
            if (currentUser.rol !== RolUsuario.ADMIN && solicitud.idUser !== currentUser.idUser) {
                throw new ForbiddenException('No tienes permisos para procesar el pago de esta solicitud');
            }

            // Verificar que la solicitud esté completada
            if (solicitud.estadoSolicitud !== EstadoSolicitud.COMPLETADA) {
                throw new BadRequestException('Solo se pueden procesar pagos para solicitudes completadas');
            }

            // Verificar si ya existe una transacción pagada
            const transaccionExistente = await this.prisma.transaccion.findFirst({
                where: {
                    idSolicitud,
                    estadoPago: EstadoPago.PAGADO
                }
            });

            if (transaccionExistente) {
                throw new BadRequestException('Ya existe una transacción pagada para esta solicitud');
            }

            // Usar el costo estimado de la solicitud o un monto por defecto
            const monto = Number(solicitud.costoEstimado) || 100.00;

            return await this.prisma.$transaction(async (prisma) => {
                // Crear la transacción
                const transaccion = await prisma.transaccion.create({
                    data: {
                        idSolicitud,
                        monto,
                        metodoPago,
                        estadoPago: EstadoPago.PENDIENTE
                    }
                });

                // Simular procesamiento del pago según el método
                const resultadoPago = await this.simularProcesamiento(metodoPago, monto, informacionPago);

                // Actualizar el estado según el resultado
                const transaccionActualizada = await prisma.transaccion.update({
                    where: { idTransaccion: transaccion.idTransaccion },
                    data: {
                        estadoPago: resultadoPago.exito ? EstadoPago.PAGADO : EstadoPago.FALLIDO,
                        fechaPago: resultadoPago.exito ? new Date() : null,
                        referencia: resultadoPago.referencia,
                        notas: resultadoPago.mensaje
                    }
                });

                this.logger.log(`Payment processed for solicitud ${idSolicitud}: ${resultadoPago.exito ? 'SUCCESS' : 'FAILED'}`);

                return {
                    transaccion: transaccionActualizada,
                    resultadoPago,
                    solicitud: {
                        idSolicitud: solicitud.idSolicitud,
                        tituloProblema: solicitud.tituloProblema,
                        estadoSolicitud: solicitud.estadoSolicitud
                    }
                };
            });

        } catch (error) {
            if (error instanceof NotFoundException ||
                error instanceof ForbiddenException ||
                error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`Error processing payment for solicitud ${idSolicitud}`, error.stack);
            throw new BadRequestException('Error al procesar el pago');
        }
    }

    /**
     * Actualiza una transacción existente
     */
    async update(
        idTransaccion: number,
        updateTransaccionDto: UpdateTransaccionDto,
        currentUser: { idUser: number; rol: string }
    ) {
        this.logger.log(`Updating transaccion: ${idTransaccion}`);

        try {
            const transaccion = await this.findOne(idTransaccion);

            // Para verificar permisos, necesitamos obtener la información de la solicitud
            const solicitud = await this.getSolicitudFromRequestService(transaccion.idSolicitud);

            // Verificar permisos
            if (currentUser.rol !== RolUsuario.ADMIN && solicitud.idUser !== currentUser.idUser) {
                throw new ForbiddenException('No tienes permisos para actualizar esta transacción');
            }

            // No permitir actualizar transacciones pagadas (excepto admin)
            if (transaccion.estadoPago === EstadoPago.PAGADO && currentUser.rol !== RolUsuario.ADMIN) {
                throw new BadRequestException('No se pueden actualizar transacciones pagadas');
            }

            const { fechaPago, ...restData } = updateTransaccionDto;
            const updateData: any = { ...restData, updatedAt: new Date() };
            if (fechaPago) updateData.fechaPago = new Date(fechaPago);

            const transaccionActualizada = await this.prisma.transaccion.update({
                where: { idTransaccion },
                data: updateData
            });

            this.logger.log(`Transaccion updated successfully: ${idTransaccion}`);

            return transaccionActualizada;
        } catch (error) {
            if (error instanceof NotFoundException ||
                error instanceof ForbiddenException ||
                error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`Error updating transaccion ${idTransaccion}`, error.stack);
            throw new BadRequestException('Error al actualizar la transacción');
        }
    }

    /**
     * Confirma un pago pendiente (para pagos manuales como transferencias)
     */
    async confirmarPago(
        idTransaccion: number,
        currentUser: { idUser: number; rol: string }
    ) {
        this.logger.log(`Confirming payment: ${idTransaccion}`);

        if (currentUser.rol !== RolUsuario.ADMIN) {
            throw new ForbiddenException('Solo los administradores pueden confirmar pagos');
        }

        try {
            const transaccion = await this.findOne(idTransaccion);

            if (transaccion.estadoPago !== EstadoPago.PENDIENTE) {
                throw new BadRequestException('Solo se pueden confirmar transacciones pendientes');
            }

            const transaccionConfirmada = await this.prisma.transaccion.update({
                where: { idTransaccion },
                data: {
                    estadoPago: EstadoPago.PAGADO,
                    fechaPago: new Date(),
                    notas: 'Pago confirmado manualmente por administrador',
                    updatedAt: new Date()
                }
            });

            this.logger.log(`Payment confirmed successfully: ${idTransaccion}`);

            return transaccionConfirmada;
        } catch (error) {
            if (error instanceof NotFoundException ||
                error instanceof ForbiddenException ||
                error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`Error confirming payment ${idTransaccion}`, error.stack);
            throw new BadRequestException('Error al confirmar el pago');
        }
    }

    /**
     * Marca un pago como fallido
     */
    async marcarComoFallido(
        idTransaccion: number,
        currentUser: { idUser: number; rol: string }
    ) {
        this.logger.log(`Marking payment as failed: ${idTransaccion}`);

        if (currentUser.rol !== RolUsuario.ADMIN) {
            throw new ForbiddenException('Solo los administradores pueden marcar pagos como fallidos');
        }

        try {
            const transaccion = await this.findOne(idTransaccion);

            if (transaccion.estadoPago === EstadoPago.PAGADO) {
                throw new BadRequestException('No se pueden marcar como fallidos pagos ya confirmados');
            }

            const transaccionFallida = await this.prisma.transaccion.update({
                where: { idTransaccion },
                data: {
                    estadoPago: EstadoPago.FALLIDO,
                    fechaPago: null,
                    notas: 'Pago marcado como fallido por administrador',
                    updatedAt: new Date()
                }
            });

            this.logger.log(`Payment marked as failed: ${idTransaccion}`);

            return transaccionFallida;
        } catch (error) {
            if (error instanceof NotFoundException ||
                error instanceof ForbiddenException ||
                error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`Error marking payment as failed ${idTransaccion}`, error.stack);
            throw new BadRequestException('Error al marcar el pago como fallido');
        }
    }

    /**
     * Obtiene transacciones por solicitud
     */
    async findBySolicitud(idSolicitud: number) {
        this.logger.log(`Finding transacciones for solicitud: ${idSolicitud}`);

        try {
            // Verificar que la solicitud existe
            await this.getSolicitudFromRequestService(idSolicitud);

            const transacciones = await this.prisma.transaccion.findMany({
                where: { idSolicitud },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return transacciones;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error finding transacciones for solicitud ${idSolicitud}`, error.stack);
            throw new BadRequestException('Error al obtener las transacciones de la solicitud');
        }
    }

    /**
     * Obtiene transacciones por usuario
     */
    async findByUser(idUser: number, filterDto?: TransaccionFilterDto) {
        this.logger.log(`Finding transacciones for user: ${idUser}`);

        try {
            // Verificar que el usuario existe en Auth Service
            await this.getUserFromAuthService(idUser);

            // Obtener las solicitudes del usuario desde el microservicio Request
            const solicitudesResponse = await firstValueFrom(
                this.requestClient.send(REQUEST_PATTERNS.FIND_SOLICITUDES_BY_USER, { idUser, filterDto: {} })
            );

            if (!solicitudesResponse.success || !solicitudesResponse.data.solicitudes) {
                return {
                    transacciones: [],
                    pagination: {
                        total: 0,
                        page: 1,
                        limit: 20,
                        totalPages: 0
                    }
                };
            }

            const idsSolicitudes = solicitudesResponse.data.solicitudes.map((s: any) => s.idSolicitud);

            if (idsSolicitudes.length === 0) {
                return {
                    transacciones: [],
                    pagination: {
                        total: 0,
                        page: 1,
                        limit: 20,
                        totalPages: 0
                    }
                };
            }

            const where: any = {
                idSolicitud: { in: idsSolicitudes }
            };

            // Aplicar filtros adicionales
            if (filterDto?.metodoPago) where.metodoPago = filterDto.metodoPago;
            if (filterDto?.estadoPago) where.estadoPago = filterDto.estadoPago;
            if (filterDto?.fechaInicio || filterDto?.fechaFin) {
                where.createdAt = {};
                if (filterDto.fechaInicio) where.createdAt.gte = new Date(filterDto.fechaInicio);
                if (filterDto.fechaFin) where.createdAt.lte = new Date(filterDto.fechaFin);
            }

            const limit = filterDto?.limit || 20;
            const page = filterDto?.page || 1;
            const skip = (page - 1) * limit;

            const [transacciones, total] = await Promise.all([
                this.prisma.transaccion.findMany({
                    where,
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: limit,
                    skip
                }),
                this.prisma.transaccion.count({ where })
            ]);

            return {
                transacciones,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Error finding transacciones for user ${idUser}`, error.stack);
            throw new BadRequestException('Error al obtener las transacciones del usuario');
        }
    }

    /**
     * Obtiene estadísticas de transacciones
     */
    async getStats(idUser?: number) {
        const logMessage = idUser ? `Getting payment stats for user: ${idUser}` : 'Getting payment stats';
        this.logger.log(logMessage);

        try {
            let where: any = {};

            if (idUser) {
                // Verificar que el usuario existe
                await this.getUserFromAuthService(idUser);

                // Obtener solicitudes del usuario desde Request service
                const solicitudesResponse = await firstValueFrom(
                    this.requestClient.send(REQUEST_PATTERNS.FIND_SOLICITUDES_BY_USER, { idUser, filterDto: {} })
                );

                if (solicitudesResponse.success && solicitudesResponse.data.solicitudes) {
                    const idsSolicitudes = solicitudesResponse.data.solicitudes.map((s: any) => s.idSolicitud);
                    where.idSolicitud = { in: idsSolicitudes };
                } else {
                    // Si no hay solicitudes, no hay transacciones
                    return {
                        total: 0,
                        pendientes: 0,
                        pagadas: 0,
                        fallidas: 0,
                        totalMontoRecaudado: 0,
                        montoPendiente: 0,
                        porcentajes: { pendientes: 0, pagadas: 0, fallidas: 0 }
                    };
                }
            }

            const [
                total,
                pendientes,
                pagadas,
                fallidas,
                totalMontoRecaudado,
                montoPendiente
            ] = await Promise.all([
                this.prisma.transaccion.count({ where }),
                this.prisma.transaccion.count({
                    where: { ...where, estadoPago: EstadoPago.PENDIENTE }
                }),
                this.prisma.transaccion.count({
                    where: { ...where, estadoPago: EstadoPago.PAGADO }
                }),
                this.prisma.transaccion.count({
                    where: { ...where, estadoPago: EstadoPago.FALLIDO }
                }),
                this.prisma.transaccion.aggregate({
                    where: { ...where, estadoPago: EstadoPago.PAGADO },
                    _sum: { monto: true }
                }),
                this.prisma.transaccion.aggregate({
                    where: { ...where, estadoPago: EstadoPago.PENDIENTE },
                    _sum: { monto: true }
                })
            ]);

            return {
                total,
                pendientes,
                pagadas,
                fallidas,
                totalMontoRecaudado: totalMontoRecaudado._sum.monto || 0,
                montoPendiente: montoPendiente._sum.monto || 0,
                porcentajes: {
                    pendientes: total > 0 ? Number(((pendientes / total) * 100).toFixed(2)) : 0,
                    pagadas: total > 0 ? Number(((pagadas / total) * 100).toFixed(2)) : 0,
                    fallidas: total > 0 ? Number(((fallidas / total) * 100).toFixed(2)) : 0
                }
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error('Error getting payment stats', error.stack);
            throw new BadRequestException('Error al obtener las estadísticas de pagos');
        }
    }

    /**
     * Obtiene estadísticas por método de pago
     */
    async getStatsByMetodoPago(idUser?: number) {
        const logMessage = idUser ? `Getting payment stats by method for user: ${idUser}` : 'Getting payment stats by method';
        this.logger.log(logMessage);

        try {
            let where: any = {};

            if (idUser) {
                // Verificar que el usuario existe
                await this.getUserFromAuthService(idUser);

                const solicitudesResponse = await firstValueFrom(
                    this.requestClient.send(REQUEST_PATTERNS.FIND_SOLICITUDES_BY_USER, { idUser, filterDto: {} })
                );

                if (solicitudesResponse.success && solicitudesResponse.data.solicitudes) {
                    const idsSolicitudes = solicitudesResponse.data.solicitudes.map((s: any) => s.idSolicitud);
                    where.idSolicitud = { in: idsSolicitudes };
                } else {
                    return [];
                }
            }

            const estadisticasPorMetodo = await this.prisma.transaccion.groupBy({
                by: ['metodoPago'],
                where: { ...where, estadoPago: EstadoPago.PAGADO },
                _count: { metodoPago: true },
                _sum: { monto: true }
            });

            return estadisticasPorMetodo.map(stat => ({
                metodoPago: stat.metodoPago,
                cantidad: stat._count.metodoPago,
                montoTotal: stat._sum.monto || 0
            }));
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error('Error getting payment stats by method', error.stack);
            throw new BadRequestException('Error al obtener las estadísticas por método de pago');
        }
    }

    /**
     * Simula el procesamiento de un pago según el método
     */
    private async simularProcesamiento(
        metodoPago: MetodoPago,
        monto: number,
        informacionPago?: any
    ): Promise<{ exito: boolean; mensaje: string; referencia?: string }> {
        // Simulación de procesamiento según el método de pago
        switch (metodoPago) {
            case MetodoPago.EFECTIVO:
                return {
                    exito: true,
                    mensaje: 'Pago en efectivo registrado exitosamente',
                    referencia: `EF-${Date.now()}`
                };

            case MetodoPago.TRANSFERENCIA: {
                // Simular verificación de transferencia (90% de éxito)
                const exitoTransferencia = Math.random() > 0.1;
                return {
                    exito: exitoTransferencia,
                    mensaje: exitoTransferencia
                        ? 'Transferencia procesada exitosamente'
                        : 'Error al procesar la transferencia - Verificar datos bancarios',
                    referencia: exitoTransferencia ? `TR-${Date.now()}` : undefined
                };
            }

            case MetodoPago.TARJETA: {
                // Simular procesamiento con tarjeta (95% de éxito)
                const exitoTarjeta = Math.random() > 0.05;
                return {
                    exito: exitoTarjeta,
                    mensaje: exitoTarjeta
                        ? 'Pago con tarjeta procesado exitosamente'
                        : 'Error al procesar el pago con tarjeta - Fondos insuficientes o tarjeta rechazada',
                    referencia: exitoTarjeta ? `TC-${Date.now()}` : undefined
                };
            }

            case MetodoPago.OTRO:
                return {
                    exito: true,
                    mensaje: 'Método de pago alternativo procesado exitosamente',
                    referencia: `OT-${Date.now()}`
                };

            default:
                return {
                    exito: false,
                    mensaje: 'Método de pago no soportado'
                };
        }
    }
}

import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Query,
    UseGuards,
    Request,
    ParseIntPipe,
    HttpCode,
    Logger
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PaymentProxyService } from '../proxy/services/payment-proxy.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, RolUsuario } from '@app/shared';

/**
 * Controlador para la gestión de transacciones y pagos en API Gateway
 */
@Controller('payment')
export class PaymentController {
    private readonly logger = new Logger(PaymentController.name);

    constructor(private readonly paymentProxyService: PaymentProxyService) { }

    /**
     * Obtiene todas las transacciones (solo administradores)
     */
    @Get('transacciones')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    findAll(@Query() filterDto: any): Observable<any> {
        this.logger.log('Getting all transacciones with filters');
        return this.paymentProxyService.findAllTransacciones(filterDto);
    }

    /**
     * Obtiene una transacción específica por su ID
     */
    @Get('transacciones/:id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number): Observable<any> {
        this.logger.log(`Getting transaccion: ${id}`);
        return this.paymentProxyService.findTransaccionById(id);
    }

    /**
     * Obtiene estadísticas generales de transacciones
     */
    @Get('transacciones/stats/general')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    getGeneralStats(): Observable<any> {
        this.logger.log('Getting general payment stats');
        return this.paymentProxyService.getPaymentStats();
    }

    /**
     * Obtiene estadísticas por método de pago
     */
    @Get('transacciones/stats/metodos-pago')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    getStatsByMetodoPago(): Observable<any> {
        this.logger.log('Getting payment stats by method');
        return this.paymentProxyService.getStatsByMetodoPago();
    }

    /**
     * Obtiene estadísticas del usuario actual
     */
    @Get('transacciones/stats/my-stats')
    @UseGuards(JwtAuthGuard)
    getMyStats(@Request() req: any): Observable<any> {
        this.logger.log(`Getting payment stats for user: ${req.user.idUser}`);
        return this.paymentProxyService.getUserStats(req.user.idUser);
    }

    /**
     * Obtiene estadísticas por método de pago del usuario actual
     */
    @Get('transacciones/stats/my-metodos-pago')
    @UseGuards(JwtAuthGuard)
    getMyStatsByMetodoPago(@Request() req: any): Observable<any> {
        this.logger.log(`Getting payment stats by method for user: ${req.user.idUser}`);
        return this.paymentProxyService.getUserStatsByMetodoPago(req.user.idUser);
    }

    /**
     * Obtiene transacciones del usuario actual
     */
    @Get('transacciones/my/transacciones')
    @UseGuards(JwtAuthGuard)
    findMyTransactions(@Request() req: any, @Query() filterDto: any): Observable<any> {
        this.logger.log(`Getting transactions for user: ${req.user.idUser}`);
        return this.paymentProxyService.findTransaccionesByUser(req.user.idUser, filterDto);
    }

    /**
     * Obtiene transacciones por solicitud
     */
    @Get('transacciones/solicitud/:idSolicitud')
    @UseGuards(JwtAuthGuard)
    findBySolicitud(@Param('idSolicitud', ParseIntPipe) idSolicitud: number): Observable<any> {
        this.logger.log(`Getting transactions for solicitud: ${idSolicitud}`);
        return this.paymentProxyService.findTransaccionesBySolicitud(idSolicitud);
    }

    /**
     * Crea una nueva transacción
     */
    @Post('transacciones')
    @UseGuards(JwtAuthGuard)
    @Roles(RolUsuario.ADMIN)
    create(@Body() createTransaccionDto: any, @Request() req: any): Observable<any> {
        this.logger.log(`Creating transaction for solicitud: ${createTransaccionDto.idSolicitud}`);
        return this.paymentProxyService.createTransaccion(createTransaccionDto, req.user);
    }

    /**
     * Procesa un pago para una solicitud
     */
    @Post('transacciones/procesar-pago/:idSolicitud')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.CLIENTE, RolUsuario.ADMIN)
    @HttpCode(200)
    procesarPago(
        @Param('idSolicitud', ParseIntPipe) idSolicitud: number,
        @Body() procesarPagoDto: any,
        @Request() req: any
    ): Observable<any> {
        this.logger.log(`Processing payment for solicitud: ${idSolicitud}`);
        return this.paymentProxyService.procesarPago(idSolicitud, procesarPagoDto, req.user);
    }

    /**
     * Actualiza una transacción existente
     */
    @Put('transacciones/:id')
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTransaccionDto: any,
        @Request() req: any
    ): Observable<any> {
        this.logger.log(`Updating transaction: ${id}`);
        return this.paymentProxyService.updateTransaccion(id, updateTransaccionDto, req.user);
    }

    /**
     * Confirma un pago pendiente (solo administradores)
     */
    @Put('transacciones/:id/confirmar')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    @HttpCode(200)
    confirmarPago(@Param('id', ParseIntPipe) id: number, @Request() req: any): Observable<any> {
        this.logger.log(`Confirming payment: ${id}`);
        return this.paymentProxyService.confirmarPago(id, req.user);
    }

    /**
     * Marca un pago como fallido (solo administradores)
     */
    @Put('transacciones/:id/marcar-fallido')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    @HttpCode(200)
    marcarComoFallido(@Param('id', ParseIntPipe) id: number, @Request() req: any): Observable<any> {
        this.logger.log(`Marking payment as failed: ${id}`);
        return this.paymentProxyService.marcarComoFallido(id, req.user);
    }
}

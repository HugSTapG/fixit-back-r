import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Query,
    UseGuards,
    Request,
    ParseIntPipe,
    HttpCode,
    BadRequestException,
    DefaultValuePipe
} from '@nestjs/common';
import { Observable, switchMap, throwError } from 'rxjs';
import { Public, Roles, RolUsuario, EstadoSolicitud } from '@app/shared';
import { RequestProxyService } from '../proxy/services/request-proxy.service';
import { TechnicianProxyService } from '../proxy/services/technician-proxy.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

/**
 * Controlador unificado del API Gateway para el Request Service
 */
@Controller('request')
export class RequestController {
    constructor(
        private readonly requestProxyService: RequestProxyService,
        private readonly technicianProxyService: TechnicianProxyService
    ) { }

    // ========================================
    // SOLICITUDES
    // ========================================

    /**
     * Obtiene estadísticas generales de solicitudes (solo ADMIN)
     */
    @Get('solicitudes/stats/general')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    getGeneralStats(): Observable<any> {
        return this.requestProxyService.getSolicitudesStats();
    }

    /**
     * Obtiene estadísticas de solicitudes del usuario actual
     */
    @Get('solicitudes/stats/my-stats')
    @UseGuards(JwtAuthGuard)
    getMyStats(@Request() req: any): Observable<any> {
        return this.requestProxyService.getSolicitudesStats(req.user.idUser);
    }

    /**
     * Obtiene las solicitudes del usuario actual
     */
    @Get('solicitudes/my/solicitudes')
    @UseGuards(JwtAuthGuard)
    findMyRequests(
        @Request() req: any,
        @Query() filterDto: any
    ): Observable<any> {
        return this.requestProxyService.findSolicitudesByUser(req.user.idUser, filterDto);
    }

    /**
     * Obtiene una solicitud específica por su ID
     */
    @Get('solicitudes/:id')
    @UseGuards(JwtAuthGuard)
    findOneSolicitud(@Param('id', ParseIntPipe) id: number, @Request() req: any): Observable<any> {
        return this.requestProxyService.findSolicitudById(id, req.user);
    }

    /**
     * Obtiene todas las solicitudes con filtros opcionales
     * CLIENTE: sin default, ver todas sus solicitudes
     * TÉCNICO: default PENDIENTE, ver solicitudes disponibles
     * ADMIN: sin default, ver todas
     */
    @Get('solicitudes')
    @UseGuards(JwtAuthGuard)
    findAllSolicitudes(
        @Request() req: any,
        @Query() filterDto: any,
        @Query('estado') estado?: EstadoSolicitud
    ): Observable<any> {
        // Pasar rol del usuario actual al proxy
        return this.requestProxyService.findAllSolicitudes({
            ...filterDto,
            ...(estado && { estadoSolicitud: estado }),
            rol: req.user.rol
        });
    }

    /**
     * Crea una nueva solicitud de servicio
     */
    @Post('solicitudes')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN, RolUsuario.CLIENTE)
    createSolicitud(
        @Body() createSolicitudDto: any,
        @Request() req: any
    ): Observable<any> {
        return this.requestProxyService.createSolicitud(createSolicitudDto, req.user.idUser);
    }

    /**
     * Actualiza una solicitud existente
     */
    @Put('solicitudes/:id')
    @UseGuards(JwtAuthGuard)
    updateSolicitud(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateSolicitudDto: any,
        @Request() req: any
    ): Observable<any> {
        return this.requestProxyService.updateSolicitud(id, updateSolicitudDto, req.user);
    }

    /**
     * Cancela una solicitud
     */
    @Put('solicitudes/:id/cancel')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    cancelSolicitud(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any
    ): Observable<any> {
        return this.requestProxyService.cancelSolicitud(id, req.user);
    }

    /**
     * Elimina permanentemente una solicitud (solo administradores)
     */
    @Delete('solicitudes/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    removeSolicitud(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any
    ): Observable<any> {
        return this.requestProxyService.deleteSolicitud(id, req.user);
    }

    // ========================================
    // SOLICITUDES-TECNICOS
    // ========================================

    /**
     * Obtiene todas las propuestas (solo administradores)
     */
    @Get('solicitudes-tecnicos')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    findAllSolicitudesTecnicos(): Observable<any> {
        return this.requestProxyService.findAllSolicitudesTecnicos();
    }

    /**
     * Obtiene una propuesta específica por su ID
     */
    @Get('solicitudes-tecnicos/:id')
    @UseGuards(JwtAuthGuard)
    findOneSolicitudTecnico(@Param('id', ParseIntPipe) id: number, @Request() req: any): Observable<any> {
        return this.requestProxyService.findSolicitudTecnicoById(id, req.user);
    }

    /**
     * Obtiene propuestas por solicitud
     */
    @Get('solicitudes-tecnicos/solicitud/:idSolicitud')
    @UseGuards(JwtAuthGuard)
    findSolicitudesTecnicosBySolicitud(@Param('idSolicitud', ParseIntPipe) idSolicitud: number, @Request() req: any): Observable<any> {
        return this.requestProxyService.findSolicitudesBySolicitud(idSolicitud, req.user);
    }

    /**
     * Obtiene las propuestas del técnico actual
     */
    @Get('solicitudes-tecnicos/my/propuestas')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.TECNICO)
    findMyProposals(@Request() req: any): Observable<any> {
        return this.technicianProxyService.findTechnicianByUserId(req.user.idUser).pipe(
            switchMap(technicianResponse => {
                if (!technicianResponse.success || !technicianResponse.data) {
                    return throwError(() => new BadRequestException('Usuario no es técnico o técnico no encontrado'));
                }
                return this.requestProxyService.findSolicitudesByTecnico(technicianResponse.data.idTecnico);
            })
        );
    }

    /**
     * Obtiene estadísticas del técnico actual
     */
    @Get('solicitudes-tecnicos/my/stats')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.TECNICO)
    getMyTechnicianStats(@Request() req: any): Observable<any> {
        return this.technicianProxyService.findTechnicianByUserId(req.user.idUser).pipe(
            switchMap(technicianResponse => {
                if (!technicianResponse.success || !technicianResponse.data) {
                    return throwError(() => new BadRequestException('Usuario no es técnico o técnico no encontrado'));
                }
                return this.requestProxyService.getStatsByTecnico(technicianResponse.data.idTecnico);
            })
        );
    }

    /**
     * Técnico se postula a una solicitud
     */
    @Post('solicitudes-tecnicos/postularse')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.TECNICO)
    postularse(
        @Body() createDto: any,
        @Request() req: any
    ): Observable<any> {
        return this.technicianProxyService.findTechnicianByUserId(req.user.idUser).pipe(
            switchMap(technicianResponse => {
                if (!technicianResponse.success || !technicianResponse.data) {
                    return throwError(() => new BadRequestException('Usuario no es técnico o técnico no encontrado'));
                }
                return this.requestProxyService.postularseSolicitud(createDto, technicianResponse.data.idTecnico);
            })
        );
    }

    /**
     * Cliente responde a una propuesta de técnico
     */
    @Put('solicitudes-tecnicos/:id/responder')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.CLIENTE, RolUsuario.ADMIN)
    @HttpCode(200)
    responderSolicitud(
        @Param('id', ParseIntPipe) id: number,
        @Body() respuestaDto: any,
        @Request() req: any
    ): Observable<any> {
        return this.requestProxyService.responderSolicitud(id, respuestaDto, req.user);
    }

    /**
     * Técnico actualiza su propuesta
     */
    @Put('solicitudes-tecnicos/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.TECNICO)
    updateSolicitudTecnico(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: any,
        @Request() req: any
    ): Observable<any> {
        return this.technicianProxyService.findTechnicianByUserId(req.user.idUser).pipe(
            switchMap(technicianResponse => {
                if (!technicianResponse.success || !technicianResponse.data) {
                    return throwError(() => new BadRequestException('Usuario no es técnico o técnico no encontrado'));
                }
                return this.requestProxyService.updateSolicitudTecnico(id, updateDto, technicianResponse.data.idTecnico);
            })
        );
    }

    /**
     * Técnico cancela su propuesta
     */
    @Delete('solicitudes-tecnicos/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.TECNICO)
    cancelarSolicitudTecnico(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any
    ): Observable<any> {
        return this.technicianProxyService.findTechnicianByUserId(req.user.idUser).pipe(
            switchMap(technicianResponse => {
                if (!technicianResponse.success || !technicianResponse.data) {
                    return throwError(() => new BadRequestException('Usuario no es técnico o técnico no encontrado'));
                }
                return this.requestProxyService.cancelSolicitudTecnico(id, technicianResponse.data.idTecnico);
            })
        );
    }

    // ========================================
    // MAESTRITO (Chat Inteligente)
    // ========================================

    /**
     * Inicia una nueva sesión de chat con Maestrito
     */
    @Post('maestrito/start')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN, RolUsuario.CLIENTE)
    startMaestritoSession(@Request() req: any): Observable<any> {
        return this.requestProxyService.startMaestritoSession(req.user.idUser);
    }

    /**
     * Envía un mensaje en una sesión de Maestrito
     */
    @Post('maestrito/:sessionId/message')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN, RolUsuario.CLIENTE)
    sendMaestritoMessage(
        @Param('sessionId') sessionId: string,
        @Body() body: { message: string },
        @Request() req: any
    ): Observable<any> {
        if (!body.message) {
            return throwError(() => new BadRequestException('El campo "message" es requerido'));
        }
        return this.requestProxyService.sendMaestritoMessage(sessionId, body.message, req.user.idUser);
    }

    /**
     * Obtiene el historial de una sesión de Maestrito
     */
    @Get('maestrito/:sessionId/history')
    @UseGuards(JwtAuthGuard)
    getMaestritoHistory(@Param('sessionId') sessionId: string): Observable<any> {
        return this.requestProxyService.getMaestritoSessionHistory(sessionId);
    }

    /**
     * Finaliza una sesión de Maestrito
     */
    @Delete('maestrito/:sessionId')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    endMaestritoSession(@Param('sessionId') sessionId: string): Observable<any> {
        return this.requestProxyService.endMaestritoSession(sessionId);
    }
}

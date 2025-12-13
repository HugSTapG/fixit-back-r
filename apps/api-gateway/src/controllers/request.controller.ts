import { Public, Roles, RolUsuario } from '@app/shared';
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Request,
    UseGuards
} from '@nestjs/common';
import { Observable, switchMap, throwError } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RequestProxyService } from '../proxy/services/request-proxy.service';
import { TechnicianProxyService } from '../proxy/services/technician-proxy.service';

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
     * Obtiene todas las solicitudes con filtros opcionales
     */
    @Get('solicitudes')
    @Public()
    findAllSolicitudes(@Query() filterDto: any): Observable<any> {
        return this.requestProxyService.findAllSolicitudes(filterDto);
    }

    /**
     * Obtiene una solicitud específica por su ID
     */
    @Get('solicitudes/:id')
    @UseGuards(JwtAuthGuard)
    findOneSolicitud(@Param('id', ParseIntPipe) id: number): Observable<any> {
        return this.requestProxyService.findSolicitudById(id);
    }

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
    findOneSolicitudTecnico(@Param('id', ParseIntPipe) id: number): Observable<any> {
        return this.requestProxyService.findSolicitudTecnicoById(id);
    }

    /**
     * Obtiene propuestas por solicitud
     */
    @Get('solicitudes-tecnicos/solicitud/:idSolicitud')
    @UseGuards(JwtAuthGuard)
    findSolicitudesTecnicosBySolicitud(@Param('idSolicitud', ParseIntPipe) idSolicitud: number): Observable<any> {
        return this.requestProxyService.findSolicitudesBySolicitud(idSolicitud);
    }

    /**
     * Obtiene las propuestas del técnico actual
     */
    @Get('solicitudes-tecnicos/my/propuestas')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN, RolUsuario.TECNICO)
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
    @Roles(RolUsuario.ADMIN, RolUsuario.TECNICO)
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
    @Roles(RolUsuario.ADMIN, RolUsuario.TECNICO)
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
    @Roles(RolUsuario.ADMIN, RolUsuario.TECNICO)
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
    @Roles(RolUsuario.ADMIN, RolUsuario.TECNICO)
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
}

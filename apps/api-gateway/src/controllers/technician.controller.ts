import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
  Request,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { Public, Roles, RolUsuario } from '@app/shared';
import { TechnicianProxyService } from '../proxy/services/technician-proxy.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Observable } from 'rxjs';
import { TopRatedQueryDto } from '../dto/top-rated-query.dto';

@Controller('technician')
export class TechnicianController {
  constructor(
    private readonly technicianProxyService: TechnicianProxyService,
  ) {}

  // ========================================================================
  // === TÉCNICOS ===
  // ⚠️ ORDEN CRÍTICO: Rutas específicas PRIMERO, parámetros DESPUÉS
  // ========================================================================

  // 1. RUTAS ESTÁTICAS (sin parámetros) - DEBEN IR PRIMERO
  @Get('tecnicos/top-rated')
  @Public()
  getTopRatedTechnicians(@Query() query: TopRatedQueryDto): Observable<any> {
    return this.technicianProxyService.getTopRatedTechnicians(query.limit);
  }

  @Get('tecnicos/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  getTechnicianStats(): Observable<any> {
    return this.technicianProxyService.getTechnicianStats();
  }

  // 2. RUTAS CON PREFIJOS ESPECÍFICOS (user/, parroquia/, etc.)
  @Get('tecnicos/user/:idUser')
  @UseGuards(JwtAuthGuard)
  getTechnicianByUserId(
    @Param('idUser', ParseIntPipe) idUser: number,
  ): Observable<any> {
    return this.technicianProxyService.findTechnicianByUserId(idUser);
  }

  @Get('tecnicos/parroquia/:codigoParroquia')
  @Public()
  getTechniciansByParroquia(
    @Param('codigoParroquia') codigoParroquia: string,
    @Query() filterDto: any,
  ): Observable<any> {
    return this.technicianProxyService.findTechniciansByParroquia(
      codigoParroquia,
      filterDto,
    );
  }

  @Get('tecnicos/servicio/:idTipoServicio')
  @Public()
  getTechniciansByTipoServicio(
    @Param('idTipoServicio', ParseIntPipe) idTipoServicio: number,
    @Query() filterDto: any,
  ): Observable<any> {
    return this.technicianProxyService.findTechniciansByTipoServicio(
      idTipoServicio,
      filterDto,
    );
  }

  @Get('tecnicos/available-for-request/:idSolicitud')
  @UseGuards(JwtAuthGuard)
  getAvailableForRequest(
    @Param('idSolicitud', ParseIntPipe) idSolicitud: number,
    @Query('codigoParroquia') codigoParroquia?: string,
    @Query('idTipoServicio') idTipoServicio?: number,
  ): Observable<any> {
    return this.technicianProxyService.findAvailableForRequest(
      idSolicitud,
      codigoParroquia,
      idTipoServicio,
    );
  }

  // 3. RUTAS GENERALES (con query params, sin path params)
  @Get('tecnicos')
  @Public()
  getTechnicians(@Query() filterDto: any): Observable<any> {
    return this.technicianProxyService.findAllTechnicians(filterDto);
  }

  // 4. RUTA CON PARÁMETRO DINÁMICO - DEBE IR AL FINAL
  @Get('tecnicos/:idTecnico')
  @Public()
  getTechnician(
    @Param('idTecnico', ParseIntPipe) idTecnico: number,
  ): Observable<any> {
    return this.technicianProxyService.findTechnicianById(idTecnico);
  }

  // POST, PUT, DELETE (el orden no importa tanto para estos)
  @Post('tecnicos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN, RolUsuario.TECNICO, RolUsuario.CLIENTE)
  createTechnician(
    @Body() createTecnicoDto: any,
    @Request() req: any,
  ): Observable<any> {
    return this.technicianProxyService.createTechnician(
      createTecnicoDto,
      req.user,
    );
  }

  @Put('tecnicos/:idTecnico')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN, RolUsuario.TECNICO)
  updateTechnician(
    @Param('idTecnico', ParseIntPipe) idTecnico: number,
    @Body() updateTecnicoDto: any,
    @Request() req: any,
  ): Observable<any> {
    return this.technicianProxyService.updateTechnician(
      idTecnico,
      updateTecnicoDto,
      req.user,
    );
  }

  @Delete('tecnicos/:idTecnico')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  deactivateTechnician(
    @Param('idTecnico', ParseIntPipe) idTecnico: number,
    @Request() req: any,
  ): Observable<any> {
    return this.technicianProxyService.deactivateTechnician(
      idTecnico,
      req.user,
    );
  }

  @Patch('tecnicos/:idTecnico/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  updateTechnicianStatus(
    @Param('idTecnico', ParseIntPipe) idTecnico: number,
    @Body() body: { status: string },
    @Request() req: any,
  ): Observable<any> {
    return this.technicianProxyService.updateTechnicianStatus(
      idTecnico,
      body.status,
      req.user,
    );
  }

  // ========================================================================
  // === CERTIFICACIONES ===
  // ========================================================================
  
  @Get('certificaciones')
  @Public()
  getCertificaciones(): Observable<any> {
    return this.technicianProxyService.findAllCertificaciones();
  }

  @Get('certificaciones/:idCertificacion')
  @Public()
  getCertificacion(
    @Param('idCertificacion', ParseIntPipe) idCertificacion: number,
  ): Observable<any> {
    return this.technicianProxyService.findCertificacionById(idCertificacion);
  }

  @Post('certificaciones')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  createCertificacion(
    @Body() createCertificacionDto: any,
    @Request() req: any,
  ): Observable<any> {
    return this.technicianProxyService.createCertificacion(
      createCertificacionDto,
      req.user,
    );
  }

  @Put('certificaciones/:idCertificacion')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  updateCertificacion(
    @Param('idCertificacion', ParseIntPipe) idCertificacion: number,
    @Body() updateCertificacionDto: any,
    @Request() req: any,
  ): Observable<any> {
    return this.technicianProxyService.updateCertificacion(
      idCertificacion,
      updateCertificacionDto,
      req.user,
    );
  }

  @Delete('certificaciones/:idCertificacion')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  deleteCertificacion(
    @Param('idCertificacion', ParseIntPipe) idCertificacion: number,
    @Request() req: any,
  ): Observable<any> {
    return this.technicianProxyService.deleteCertificacion(
      idCertificacion,
      req.user,
    );
  }

  // ========================================================================
  // === TÉCNICO-CERTIFICACIONES ===
  // ⚠️ MISMO PROBLEMA: pending, expiring, stats ANTES de :idTecCert
  // ========================================================================

  @Get('tecnico-certificaciones/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  getPendingCertificaciones(): Observable<any> {
    return this.technicianProxyService.findPendingCertificaciones();
  }

  @Get('tecnico-certificaciones/expiring')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  getExpiringCertificaciones(
    @Query('dias') diasAnticipacion?: number,
  ): Observable<any> {
    return this.technicianProxyService.findExpiringCertificaciones(
      diasAnticipacion,
    );
  }

  @Get('tecnico-certificaciones/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  getCertificacionStats(): Observable<any> {
    return this.technicianProxyService.getCertificacionStats();
  }

  @Get('tecnico-certificaciones')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  getTecnicoCertificaciones(): Observable<any> {
    return this.technicianProxyService.findAllTecnicoCertificaciones();
  }

  @Get('tecnico-certificaciones/:idTecCert')
  @UseGuards(JwtAuthGuard)
  getTecnicoCertificacion(
    @Param('idTecCert', ParseIntPipe) idTecCert: number,
  ): Observable<any> {
    return this.technicianProxyService.findTecnicoCertificacionById(idTecCert);
  }

  @Post('tecnicos/:idTecnico/certificaciones')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN, RolUsuario.TECNICO)
  createTecnicoCertificacion(
    @Param('idTecnico', ParseIntPipe) idTecnico: number,
    @Body() createTecnicoCertificacionDto: any,
    @Request() req: any,
  ): Observable<any> {
    return this.technicianProxyService.createTecnicoCertificacion(
      idTecnico,
      createTecnicoCertificacionDto,
      req.user,
    );
  }

  @Put('tecnico-certificaciones/:idTecCert')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN, RolUsuario.TECNICO)
  updateTecnicoCertificacion(
    @Param('idTecCert', ParseIntPipe) idTecCert: number,
    @Body() updateTecnicoCertificacionDto: any,
    @Request() req: any,
  ): Observable<any> {
    return this.technicianProxyService.updateTecnicoCertificacion(
      idTecCert,
      updateTecnicoCertificacionDto,
      req.user,
    );
  }

  @Delete('tecnico-certificaciones/:idTecCert')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN, RolUsuario.TECNICO)
  deleteTecnicoCertificacion(
    @Param('idTecCert', ParseIntPipe) idTecCert: number,
    @Request() req: any,
  ): Observable<any> {
    return this.technicianProxyService.deleteTecnicoCertificacion(
      idTecCert,
      req.user,
    );
  }

  @Patch('tecnico-certificaciones/:idTecCert/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  verifyTecnicoCertificacion(
    @Param('idTecCert', ParseIntPipe) idTecCert: number,
    @Request() req: any,
  ): Observable<any> {
    return this.technicianProxyService.verifyTecnicoCertificacion(
      idTecCert,
      req.user,
    );
  }

  @Patch('tecnico-certificaciones/:idTecCert/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  rejectTecnicoCertificacion(
    @Param('idTecCert', ParseIntPipe) idTecCert: number,
    @Request() req: any,
  ): Observable<any> {
    return this.technicianProxyService.rejectTecnicoCertificacion(
      idTecCert,
      req.user,
    );
  }

  @Patch('tecnico-certificaciones/mark-expired')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  markExpiredCertificaciones(): Observable<any> {
    return this.technicianProxyService.markExpiredCertificaciones();
  }

  // Rutas anidadas - van después
  @Get('tecnicos/:idTecnico/certificaciones')
  @Public()
  getCertificacionesByTecnico(
    @Param('idTecnico', ParseIntPipe) idTecnico: number,
  ): Observable<any> {
    return this.technicianProxyService.findCertificacionesByTecnico(idTecnico);
  }

  @Get('tecnicos/:idTecnico/parroquias')
  @Public()
  getParroquiasByTecnico(
    @Param('idTecnico', ParseIntPipe) idTecnico: number,
  ): Observable<any> {
    return this.technicianProxyService.findParroquiasByTecnico(idTecnico);
  }

  @Get('tecnicos/:idTecnico/servicios')
  @Public()
  getServiciosByTecnico(
    @Param('idTecnico', ParseIntPipe) idTecnico: number,
  ): Observable<any> {
    return this.technicianProxyService.findServiciosByTecnico(idTecnico);
  }

  @Get('tecnicos/:idTecnico/calificaciones')
  @Public()
  getCalificacionesByTecnico(
    @Param('idTecnico', ParseIntPipe) idTecnico: number,
  ): Observable<any> {
    return this.technicianProxyService.findCalificacionesByTecnico(idTecnico);
  }

  // === TÉCNICO-PARROQUIAS ===
  @Get('tecnico-parroquias')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  getTecnicoParroquias(): Observable<any> {
    return this.technicianProxyService.findAllTecnicoParroquias();
  }

  @Post('tecnicos/:idTecnico/parroquias')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN, RolUsuario.TECNICO)
  createTecnicoParroquia(
    @Param('idTecnico', ParseIntPipe) idTecnico: number,
    @Body() createTecnicoParroquiaDto: any,
    @Request() req: any,
  ): Observable<any> {
    return this.technicianProxyService.createTecnicoParroquia(
      idTecnico,
      createTecnicoParroquiaDto,
      req.user,
    );
  }

  @Delete('tecnicos/:idTecnico/parroquias/:codigoParroquia')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN, RolUsuario.TECNICO)
  deleteTecnicoParroquia(
    @Param('idTecnico', ParseIntPipe) idTecnico: number,
    @Param('codigoParroquia') codigoParroquia: string,
    @Request() req: any,
  ): Observable<any> {
    return this.technicianProxyService.deleteTecnicoParroquia(
      idTecnico,
      codigoParroquia,
      req.user,
    );
  }

  @Get('parroquias/:codigoParroquia/tecnicos')
  @Public()
  getTecnicosByParroquia(
    @Param('codigoParroquia') codigoParroquia: string,
  ): Observable<any> {
    return this.technicianProxyService.findTecnicosByParroquia(codigoParroquia);
  }

  // === TIPOS DE SERVICIOS ===
  // Stats primero, luego el parámetro
  @Get('tipos-servicios/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  getTipoServicioStats(): Observable<any> {
    return this.technicianProxyService.getTipoServicioStats();
  }

  @Get('tipos-servicios')
  @Public()
  getTiposServicios(): Observable<any> {
    return this.technicianProxyService.findAllTiposServicios();
  }

  @Get('tipos-servicios/:idTipoServicio')
  @Public()
  getTipoServicio(
    @Param('idTipoServicio', ParseIntPipe) idTipoServicio: number,
  ): Observable<any> {
    return this.technicianProxyService.findTipoServicioById(idTipoServicio);
  }

  @Get('tipos-servicios/:idTipoServicio/tecnicos')
  @Public()
  getTecnicosByServicio(
    @Param('idTipoServicio', ParseIntPipe) idTipoServicio: number,
  ): Observable<any> {
    return this.technicianProxyService.findTecnicosByServicio(idTipoServicio);
  }

  @Post('tipos-servicios')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  createTipoServicio(
    @Body() createTipoServicioDto: any,
    @Request() req: any,
  ): Observable<any> {
    return this.technicianProxyService.createTipoServicio(
      createTipoServicioDto,
      req.user,
    );
  }

  @Put('tipos-servicios/:idTipoServicio')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  updateTipoServicio(
    @Param('idTipoServicio', ParseIntPipe) idTipoServicio: number,
    @Body() updateTipoServicioDto: any,
    @Request() req: any,
  ): Observable<any> {
    return this.technicianProxyService.updateTipoServicio(
      idTipoServicio,
      updateTipoServicioDto,
      req.user,
    );
  }

  @Delete('tipos-servicios/:idTipoServicio')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  deleteTipoServicio(
    @Param('idTipoServicio', ParseIntPipe) idTipoServicio: number,
    @Request() req: any,
  ): Observable<any> {
    return this.technicianProxyService.deleteTipoServicio(
      idTipoServicio,
      req.user,
    );
  }

  // === TÉCNICO-SERVICIOS ===
  @Get('tecnico-servicios')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  getTecnicoServicios(): Observable<any> {
    return this.technicianProxyService.findAllTecnicoServicios();
  }

  @Post('tecnicos/:idTecnico/servicios')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN, RolUsuario.TECNICO)
  createTecnicoServicio(
    @Param('idTecnico', ParseIntPipe) idTecnico: number,
    @Body() createTecnicoServicioDto: any,
    @Request() req: any,
  ): Observable<any> {
    return this.technicianProxyService.createTecnicoServicio(
      idTecnico,
      createTecnicoServicioDto,
      req.user,
    );
  }

  @Delete('tecnicos/:idTecnico/servicios/:idTipoServicio')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN, RolUsuario.TECNICO)
  deleteTecnicoServicio(
    @Param('idTecnico', ParseIntPipe) idTecnico: number,
    @Param('idTipoServicio', ParseIntPipe) idTipoServicio: number,
    @Request() req: any,
  ): Observable<any> {
    return this.technicianProxyService.deleteTecnicoServicio(
      idTecnico,
      idTipoServicio,
      req.user,
    );
  }

  // === CALIFICACIONES ===
  @Get('calificaciones')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  getAllCalificaciones(@Query() filterDto: any): Observable<any> {
    return this.technicianProxyService.findAllCalificaciones(filterDto);
  }

  @Post('calificaciones')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN, RolUsuario.CLIENTE)
  createCalificacion(
    @Body() createCalificacionDto: any,
    @Request() req: any,
  ): Observable<any> {
    return this.technicianProxyService.createCalificacion(
      createCalificacionDto,
      req.user,
    );
  }

  @Put('calificaciones/:idCalificacion')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.CLIENTE, RolUsuario.ADMIN)
  updateCalificacion(
    @Param('idCalificacion', ParseIntPipe) idCalificacion: number,
    @Body() updateCalificacionDto: any,
    @Request() req: any,
  ): Observable<any> {
    return this.technicianProxyService.updateCalificacion(
      idCalificacion,
      updateCalificacionDto,
      req.user,
    );
  }

  @Delete('calificaciones/:idCalificacion')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  deleteCalificacion(
    @Param('idCalificacion', ParseIntPipe) idCalificacion: number,
    @Request() req: any,
  ): Observable<any> {
    return this.technicianProxyService.deleteCalificacion(
      idCalificacion,
      req.user,
    );
  }

  @Patch('tecnicos/:idTecnico/update-promedio')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  updatePromedioCalificaciones(
    @Param('idTecnico', ParseIntPipe) idTecnico: number,
  ): Observable<any> {
    return this.technicianProxyService.updatePromedioCalificaciones(idTecnico);
  }
}
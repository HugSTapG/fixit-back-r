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
    ParseIntPipe,
} from '@nestjs/common';
import { Public, Roles, RolUsuario } from '@app/shared';
import { GeoProxyService } from '../proxy/services/geo-proxy.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Observable } from 'rxjs';

@Controller('geo')
export class GeoController {
    constructor(private readonly geoProxyService: GeoProxyService) { }

    // === PROVINCIAS ===
    @Get('provincias')
    @Public()
    getProvincias(): Observable<any> {
        return this.geoProxyService.getProvincias();
    }

    @Get('provincias/:codigoProvincia')
    @Public()
    getProvincia(@Param('codigoProvincia') codigoProvincia: string): Observable<any> {
        return this.geoProxyService.getProvincia(codigoProvincia);
    }

    @Post('provincias')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    createProvincia(@Body() createProvinciaDto: any): Observable<any> {
        return this.geoProxyService.createProvincia(createProvinciaDto);
    }

    @Put('provincias/:codigoProvincia')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    updateProvincia(
        @Param('codigoProvincia') codigoProvincia: string,
        @Body() updateProvinciaDto: any,
    ): Observable<any> {
        return this.geoProxyService.updateProvincia(codigoProvincia, updateProvinciaDto);
    }

    @Delete('provincias/:codigoProvincia')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    deleteProvincia(@Param('codigoProvincia') codigoProvincia: string): Observable<any> {
        return this.geoProxyService.deleteProvincia(codigoProvincia);
    }

    // === CANTONES ===
    @Get('cantones')
    @Public()
    getCantones(@Query('codigoProvincia') codigoProvincia?: string): Observable<any> {
        return this.geoProxyService.getCantones(codigoProvincia);
    }

    @Get('cantones/:codigoCanton')
    @Public()
    getCanton(@Param('codigoCanton') codigoCanton: string): Observable<any> {
        return this.geoProxyService.getCanton(codigoCanton);
    }

    @Post('cantones')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    createCanton(@Body() createCantonDto: any): Observable<any> {
        return this.geoProxyService.createCanton(createCantonDto);
    }

    @Put('cantones/:codigoCanton')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    updateCanton(
        @Param('codigoCanton') codigoCanton: string,
        @Body() updateCantonDto: any,
    ): Observable<any> {
        return this.geoProxyService.updateCanton(codigoCanton, updateCantonDto);
    }

    @Delete('cantones/:codigoCanton')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    deleteCanton(@Param('codigoCanton') codigoCanton: string): Observable<any> {
        return this.geoProxyService.deleteCanton(codigoCanton);
    }

    // === PARROQUIAS ===
    @Get('parroquias')
    @Public()
    getParroquias(@Query('codigoCanton') codigoCanton?: string): Observable<any> {
        return this.geoProxyService.getParroquias(codigoCanton);
    }

    @Get('parroquias/:codigoParroquia')
    @Public()
    getParroquia(@Param('codigoParroquia') codigoParroquia: string): Observable<any> {
        return this.geoProxyService.getParroquia(codigoParroquia);
    }

    @Post('parroquias')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    createParroquia(@Body() createParroquiaDto: any): Observable<any> {
        return this.geoProxyService.createParroquia(createParroquiaDto);
    }

    @Put('parroquias/:codigoParroquia')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    updateParroquia(
        @Param('codigoParroquia') codigoParroquia: string,
        @Body() updateParroquiaDto: any,
    ): Observable<any> {
        return this.geoProxyService.updateParroquia(codigoParroquia, updateParroquiaDto);
    }

    @Delete('parroquias/:codigoParroquia')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    deleteParroquia(@Param('codigoParroquia') codigoParroquia: string): Observable<any> {
        return this.geoProxyService.deleteParroquia(codigoParroquia);
    }

    // === UBICACIONES ===
    @Get('ubicaciones')
    @Public()
    getUbicaciones(@Query() query: any): Observable<any> {
        return this.geoProxyService.getUbicaciones(query);
    }

    @Get('ubicaciones/:idUbicacion')
    @Public()
    getUbicacion(@Param('idUbicacion', ParseIntPipe) idUbicacion: number): Observable<any> {
        return this.geoProxyService.getUbicacion(idUbicacion);
    }

    @Get('ubicaciones/parroquia/:codigoParroquia')
    @Public()
    getUbicacionesByParroquia(@Param('codigoParroquia') codigoParroquia: string): Observable<any> {
        return this.geoProxyService.getUbicacionesByParroquia(codigoParroquia);
    }

    @Post('ubicaciones')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    createUbicacion(@Body() createUbicacionDto: any): Observable<any> {
        return this.geoProxyService.createUbicacion(createUbicacionDto);
    }

    @Put('ubicaciones/:idUbicacion')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    updateUbicacion(
        @Param('idUbicacion', ParseIntPipe) idUbicacion: number,
        @Body() updateUbicacionDto: any,
    ): Observable<any> {
        return this.geoProxyService.updateUbicacion(idUbicacion, updateUbicacionDto);
    }

    @Delete('ubicaciones/:idUbicacion')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RolUsuario.ADMIN)
    deleteUbicacion(@Param('idUbicacion', ParseIntPipe) idUbicacion: number): Observable<any> {
        return this.geoProxyService.deleteUbicacion(idUbicacion);
    }
}

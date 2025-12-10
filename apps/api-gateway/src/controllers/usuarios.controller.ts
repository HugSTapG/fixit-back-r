import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { Public, Roles, RolUsuario } from '@app/shared';
import { AuthProxyService } from '../proxy/services/auth-proxy.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Observable } from 'rxjs';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly authProxyService: AuthProxyService) {}

  @Post('switch-role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN, RolUsuario.CLIENTE, RolUsuario.TECNICO)
  switchRole(@Request() req: any, @Body() switchRoleDto: any): Observable<any> {
    const userId = req.user.idUser;
    return this.authProxyService.switchRole(userId, switchRoleDto);
  }
  
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findById(@Param('id', ParseIntPipe) id: number): Observable<any> {
    return this.authProxyService.findUserById(id);
  }

  @Get('cedula/:cedula')
  @UseGuards(JwtAuthGuard)
  findByCedula(@Param('cedula') cedula: string): Observable<any> {
    return this.authProxyService.findUserByCedula(cedula);
  }

  @Public()
  @Post()
  create(@Body() createUsuarioDto: any): Observable<any> {
    return this.authProxyService.createUser(createUsuarioDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: any,
  ): Observable<any> {
    return this.authProxyService.updateUser(id, updateUsuarioDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  findAll(): Observable<any> {
    return this.authProxyService.findAllUsers();
  }

  @Put(':id/verify-email')
  @UseGuards(JwtAuthGuard)
  verifyEmail(@Param('id', ParseIntPipe) id: number): Observable<any> {
    return this.authProxyService.verifyEmail(id);
  }

  @Put(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  deactivate(@Param('id', ParseIntPipe) id: number): Observable<any> {
    return this.authProxyService.deactivateUser(id);
  }
}

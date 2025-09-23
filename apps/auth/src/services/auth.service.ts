import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/database.service';
import { KafkaService } from '@app/events';
import { UsuariosService } from './usuarios.service';
import { LoginDto, RefreshTokenDto, AuthResponseDto } from '../dto';
import { SesionMapper } from '../mappers';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly database: DatabaseService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly kafkaService: KafkaService,
        private readonly usuariosService: UsuariosService,
    ) { }

    async login(loginDto: LoginDto): Promise<AuthResponseDto> {
        const user = await this.usuariosService.validatePassword(
            loginDto.email,
            loginDto.password,
        );

        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload = {
            sub: user.idUser,
            cedula: user.cedula,
            email: user.email,
            nombres: user.nombres,
            apellidos: user.apellidos,
            rol: user.rol,
        };

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
        });

        // Crear sesión en base de datos
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
        const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

        const sesionData = SesionMapper.toPrismaCreateData({
            idUser: user.idUser,
            accessToken,
            refreshToken,
            expiresAt,
            refreshExpiresAt,
            isActive: true,
            activa: true,
        });

        await this.database.sesionUsuario.create({
            data: sesionData,
        });

        // Emitir evento de login
        await this.kafkaService.publishEvent('user.logged_in', {
            userId: user.idUser,
            email: user.email,
            rol: user.rol,
        });

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                idUser: user.idUser,
                cedula: user.cedula,
                nombres: user.nombres,
                apellidos: user.apellidos,
                email: user.email,
                rol: user.rol,
            },
        };
    }

    async refresh(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
        const payload = this.jwtService.verify(refreshTokenDto.refresh_token, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
        });

        const session = await this.database.sesionUsuario.findFirst({
            where: {
                idUser: payload.sub,
                refreshToken: refreshTokenDto.refresh_token,
                isActive: true,
            },
        });

        if (!session) {
            throw new UnauthorizedException('Refresh token inválido');
        }

        const user = await this.usuariosService.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        const newPayload = {
            sub: user.idUser,
            cedula: user.cedula,
            email: user.email,
            nombres: user.nombres,
            apellidos: user.apellidos,
            rol: user.rol,
        };

        const newAccessToken = this.jwtService.sign(newPayload, {
            expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
        });

        const newRefreshToken = this.jwtService.sign(newPayload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
        });

        // Actualizar sesión
        await this.database.sesionUsuario.update({
            where: { idSesion: session.idSesion },
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000),
                refreshExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        // Emitir evento
        await this.kafkaService.publishEvent('token.refreshed', {
            userId: user.idUser,
            newTokenId: newAccessToken,
        });

        return {
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
            user: {
                idUser: user.idUser,
                cedula: user.cedula,
                nombres: user.nombres,
                apellidos: user.apellidos,
                email: user.email,
                rol: user.rol,
            },
        };
    }

    async logout(accessToken: string): Promise<void> {
        await this.database.sesionUsuario.updateMany({
            where: { accessToken },
            data: {
                isActive: false,
                activa: false,
            },
        });

        // Emitir evento de logout
        await this.kafkaService.publishEvent('user.logged_out', {
            accessToken,
            timestamp: new Date(),
        });
    }

    async validateToken(token: string): Promise<any> {
        const payload = this.jwtService.verify(token);

        const session = await this.database.sesionUsuario.findFirst({
            where: {
                accessToken: token,
                isActive: true,
            },
        });

        if (!session) {
            throw new UnauthorizedException('Token inválido');
        }

        const user = await this.usuariosService.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        return {
            valid: true,
            user,
        };
    }

    private async createSession(
        userId: number,
        accessToken: string,
        refreshToken: string,
    ) {
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
        const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

        const sesionData = SesionMapper.toPrismaCreateData({
            idUser: userId,
            accessToken,
            refreshToken,
            expiresAt,
            refreshExpiresAt,
            isActive: true,
            activa: true,
        });

        return this.database.sesionUsuario.create({
            data: sesionData,
        });
    }
}

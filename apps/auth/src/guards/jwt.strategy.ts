import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);

    constructor(
        configService: ConfigService,
        private readonly database: DatabaseService,
    ) {
        const jwtSecret = configService.get<string>('JWT_SECRET');

        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not configured in Auth Service');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
    }

    async validate(payload: any) {
        if (!payload.sub || !payload.cedula || !payload.rol) {
            throw new UnauthorizedException('Invalid token payload');
        }

        // Verificar que el usuario aún existe y está activo
        const user = await this.database.usuario.findUnique({
            where: {
                idUser: payload.sub,
                isActive: true,
            },
        });

        if (!user) {
            throw new UnauthorizedException('User not found or inactive');
        }

        return {
            idUser: payload.sub,
            cedula: payload.cedula,
            email: payload.email,
            nombres: payload.nombres,
            apellidos: payload.apellidos,
            rol: payload.rol,
        };
    }
}

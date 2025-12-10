import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        const jwtSecret = configService.get<string>('JWT_SECRET');

        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not configured');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
    }

    async validate(payload: any) {
        // Validar que el token tiene los campos requeridos
        if (!payload.sub || (!payload.roles && !payload.rol)) {
            throw new UnauthorizedException('Invalid token payload: missing sub or roles');
        }

        // Convertimos a nuestro modelo interno
        // Soportar tanto la nueva estructura (roles array) como la antigua (rol singular)
        return {
            idUser: payload.sub,
            cedula: payload.cedula,
            email: payload.email,
            nombres: payload.nombres,
            apellidos: payload.apellidos,
            roles: payload.roles || (payload.rol ? [payload.rol] : []),
        };
    }
}

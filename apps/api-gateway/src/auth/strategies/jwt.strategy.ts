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
        // Validar mínimamente (opcional)
        if (!payload.sub || !payload.rol) {
            throw new UnauthorizedException('Invalid token payload');
        }

        // Convertimos a nuestro modelo interno
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

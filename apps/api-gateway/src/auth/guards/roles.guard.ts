import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolUsuario, ROLES_KEY } from '@app/shared';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<RolUsuario[]>(
            ROLES_KEY,
            context.getHandler()
        );

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        console.log(">>> requiredRoles:", requiredRoles);
        console.log(">>> user:", user);

        // Soportar tanto roles array como rol singular
        const userRoles = user?.roles || (user?.rol ? [user.rol] : []);

        // Verificar si el usuario tiene al menos uno de los roles requeridos
        return requiredRoles.some((role) => userRoles.includes(role));
    }
}

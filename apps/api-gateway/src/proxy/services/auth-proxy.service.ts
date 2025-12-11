import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MicroserviceProxyService } from './microservice-proxy.service';
import { AUTH_PATTERNS } from '@app/events';

@Injectable()
export class AuthProxyService extends MicroserviceProxyService {

    // Autenticación
    login(loginDto: any): Observable<any> {
        return this.sendToAuth(AUTH_PATTERNS.LOGIN, loginDto);
    }

    refresh(refreshTokenDto: any): Observable<any> {
        return this.sendToAuth(AUTH_PATTERNS.REFRESH, refreshTokenDto);
    }

    logout(token: string): Observable<any> {
        return this.sendToAuth(AUTH_PATTERNS.LOGOUT, { token });
    }

    validateToken(token: string): Observable<any> {
        return this.sendToAuth(AUTH_PATTERNS.VALIDATE, { token });
    }

    // Gestión de usuarios
    findUserById(id: number): Observable<any> {
        return this.sendToAuth(AUTH_PATTERNS.FIND_USER_BY_ID, { id });
    }

    findUserByCedula(cedula: string): Observable<any> {
        return this.sendToAuth(AUTH_PATTERNS.FIND_USER_BY_CEDULA, { cedula });
    }

    findUserByEmail(email: string): Observable<any> {
        return this.sendToAuth(AUTH_PATTERNS.FIND_USER_BY_EMAIL, { email });
    }

    createUser(createUsuarioDto: any): Observable<any> {
        return this.sendToAuth(AUTH_PATTERNS.CREATE_USER, createUsuarioDto);
    }

    updateUser(id: number, updateUsuarioDto: any): Observable<any> {
        return this.sendToAuth(AUTH_PATTERNS.UPDATE_USER, { id, ...updateUsuarioDto });
    }

    findAllUsers(): Observable<any> {
        return this.sendToAuth(AUTH_PATTERNS.FIND_ALL_USERS, {});
    }

    verifyEmail(id: number): Observable<any> {
        return this.sendToAuth(AUTH_PATTERNS.VERIFY_EMAIL, { id });
    }

    deactivateUser(id: number): Observable<any> {
        return this.sendToAuth(AUTH_PATTERNS.DEACTIVATE_USER, { id });
    }

    switchRole(userId: number, switchRoleDto: any): Observable<any> {
        return this.sendToAuth(AUTH_PATTERNS.SWITCH_ROLE, { userId, ...switchRoleDto });
    }

}

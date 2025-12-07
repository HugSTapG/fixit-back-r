// apps/api-gateway/src/proxy/services/technician-proxy.service.ts
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MicroserviceProxyService } from './microservice-proxy.service';
import { TECHNICIAN_PATTERNS } from '@app/events';

@Injectable()
export class TechnicianProxyService extends MicroserviceProxyService {

    // === TÉCNICOS ===
    findAllTechnicians(filterDto?: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_ALL_TECHNICIANS, filterDto || {});
    }

    findTechnicianById(idTecnico: number): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_TECHNICIAN_BY_ID, { idTecnico });
    }

    findTechnicianByUserId(idUser: number): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_TECHNICIAN_BY_USER_ID, { idUser });
    }

    createTechnician(createTecnicoDto: any, currentUser: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.CREATE_TECHNICIAN, { createTecnicoDto, currentUser });
    }

    updateTechnician(idTecnico: number, updateTecnicoDto: any, currentUser: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.UPDATE_TECHNICIAN, { idTecnico, updateTecnicoDto, currentUser });
    }

    deactivateTechnician(idTecnico: number, currentUser: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.DEACTIVATE_TECHNICIAN, { idTecnico, currentUser });
    }

    findTechniciansByParroquia(codigoParroquia: string, filterDto?: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_TECHNICIANS_BY_PARROQUIA, { codigoParroquia, filterDto });
    }

    findTechniciansByTipoServicio(idTipoServicio: number, filterDto?: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_TECHNICIANS_BY_TIPO_SERVICIO, { idTipoServicio, filterDto });
    }

    getTopRatedTechnicians(limit?: number | string): Observable<any> {
    const limitStr = String(limit ?? 10);
    return this.sendToTechnician(
        TECHNICIAN_PATTERNS.GET_TOP_RATED_TECHNICIANS,
        { limit: limitStr }
    );
    }

    findAvailableForRequest(idSolicitud: number, codigoParroquia?: string, idTipoServicio?: number): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_AVAILABLE_FOR_REQUEST, { idSolicitud, codigoParroquia, idTipoServicio });
    }

    getTechnicianStats(): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.GET_TECHNICIAN_STATS, {});
    }

    // === CERTIFICACIONES ===
    findAllCertificaciones(): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_ALL_CERTIFICACIONES, {});
    }

    findCertificacionById(idCertificacion: number): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_CERTIFICACION_BY_ID, { idCertificacion });
    }

    createCertificacion(createCertificacionDto: any, currentUser: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.CREATE_CERTIFICACION, { createCertificacionDto, currentUser });
    }

    updateCertificacion(idCertificacion: number, updateCertificacionDto: any, currentUser: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.UPDATE_CERTIFICACION, { idCertificacion, updateCertificacionDto, currentUser });
    }

    deleteCertificacion(idCertificacion: number, currentUser: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.DELETE_CERTIFICACION, { idCertificacion, currentUser });
    }

    // === TÉCNICO-CERTIFICACIONES ===
    findAllTecnicoCertificaciones(): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_ALL_TECNICO_CERTIFICACIONES, {});
    }

    findTecnicoCertificacionById(idTecCert: number): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_TECNICO_CERTIFICACION_BY_ID, { idTecCert });
    }

    createTecnicoCertificacion(idTecnico: number, createTecnicoCertificacionDto: any, currentUser: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.CREATE_TECNICO_CERTIFICACION, { idTecnico, createTecnicoCertificacionDto, currentUser });
    }

    updateTecnicoCertificacion(idTecCert: number, updateTecnicoCertificacionDto: any, currentUser: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.UPDATE_TECNICO_CERTIFICACION, { idTecCert, updateTecnicoCertificacionDto, currentUser });
    }

    deleteTecnicoCertificacion(idTecCert: number, currentUser: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.DELETE_TECNICO_CERTIFICACION, { idTecCert, currentUser });
    }

    verifyTecnicoCertificacion(idTecCert: number, currentUser: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.VERIFY_TECNICO_CERTIFICACION, { idTecCert, currentUser });
    }

    rejectTecnicoCertificacion(idTecCert: number, currentUser: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.REJECT_TECNICO_CERTIFICACION, { idTecCert, currentUser });
    }

    findCertificacionesByTecnico(idTecnico: number): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_CERTIFICACIONES_BY_TECNICO, { idTecnico });
    }

    findPendingCertificaciones(): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_PENDING_CERTIFICACIONES, {});
    }

    findExpiringCertificaciones(diasAnticipacion?: number): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_EXPIRING_CERTIFICACIONES, { diasAnticipacion });
    }

    markExpiredCertificaciones(): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.MARK_EXPIRED_CERTIFICACIONES, {});
    }

    getCertificacionStats(): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.GET_CERTIFICACION_STATS, {});
    }

    // === TÉCNICO-PARROQUIAS ===
    findAllTecnicoParroquias(): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_ALL_TECNICO_PARROQUIAS, {});
    }

    createTecnicoParroquia(idTecnico: number, createTecnicoParroquiaDto: any, currentUser: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.CREATE_TECNICO_PARROQUIA, { idTecnico, createTecnicoParroquiaDto, currentUser });
    }

    deleteTecnicoParroquia(idTecnico: number, codigoParroquia: string, currentUser: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.DELETE_TECNICO_PARROQUIA, { idTecnico, codigoParroquia, currentUser });
    }

    findParroquiasByTecnico(idTecnico: number): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_PARROQUIAS_BY_TECNICO, { idTecnico });
    }

    findTecnicosByParroquia(codigoParroquia: string): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_TECNICOS_BY_PARROQUIA, { codigoParroquia });
    }

    // === TIPOS DE SERVICIOS ===
    findAllTiposServicios(): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_ALL_TIPOS_SERVICIOS, {});
    }

    findTipoServicioById(idTipoServicio: number): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_TIPO_SERVICIO_BY_ID, { idTipoServicio });
    }

    createTipoServicio(createTipoServicioDto: any, currentUser: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.CREATE_TIPO_SERVICIO, { createTipoServicioDto, currentUser });
    }

    updateTipoServicio(idTipoServicio: number, updateTipoServicioDto: any, currentUser: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.UPDATE_TIPO_SERVICIO, { idTipoServicio, updateTipoServicioDto, currentUser });
    }

    deleteTipoServicio(idTipoServicio: number, currentUser: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.DELETE_TIPO_SERVICIO, { idTipoServicio, currentUser });
    }

    getTipoServicioStats(): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.GET_TIPO_SERVICIO_STATS, {});
    }

    // === TÉCNICO-SERVICIOS ===
    findAllTecnicoServicios(): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_ALL_TECNICO_SERVICIOS, {});
    }

    createTecnicoServicio(idTecnico: number, createTecnicoServicioDto: any, currentUser: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.CREATE_TECNICO_SERVICIO, { idTecnico, createTecnicoServicioDto, currentUser });
    }

    deleteTecnicoServicio(idTecnico: number, idTipoServicio: number, currentUser: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.DELETE_TECNICO_SERVICIO, { idTecnico, idTipoServicio, currentUser });
    }

    findServiciosByTecnico(idTecnico: number): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_SERVICIOS_BY_TECNICO, { idTecnico });
    }

    findTecnicosByServicio(idTipoServicio: number): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_TECNICOS_BY_SERVICIO, { idTipoServicio });
    }

    // === CALIFICACIONES ===
    createCalificacion(createCalificacionDto: any, currentUser: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.CREATE_CALIFICACION, { createCalificacionDto, currentUser });
    }

    updateCalificacion(idCalificacion: number, updateCalificacionDto: any, currentUser: any): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.UPDATE_CALIFICACION, { idCalificacion, updateCalificacionDto, currentUser });
    }

    findCalificacionesByTecnico(idTecnico: number): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.FIND_CALIFICACIONES_BY_TECNICO, { idTecnico });
    }

    updatePromedioCalificaciones(idTecnico: number): Observable<any> {
        return this.sendToTechnician(TECHNICIAN_PATTERNS.UPDATE_PROMEDIO_CALIFICACIONES, { idTecnico });
    }
}

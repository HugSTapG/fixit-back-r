import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MicroserviceProxyService } from './microservice-proxy.service';
import { REQUEST_PATTERNS, MAESTRITO_PATTERNS } from '@app/events';

@Injectable()
export class RequestProxyService extends MicroserviceProxyService {

    // === SOLICITUDES ===
    findAllSolicitudes(filterDto?: any): Observable<any> {
        // Envolver en filterDto como lo espera el microservicio
        // filterDto ya contiene: estadoSolicitud (si viene), rol, y otros parámetros
        return this.sendToRequest(REQUEST_PATTERNS.FIND_ALL_SOLICITUDES, { filterDto });
    }

    findSolicitudById(idSolicitud: number, currentUser?: any): Observable<any> {
        return this.sendToRequest(REQUEST_PATTERNS.FIND_SOLICITUD_BY_ID, { idSolicitud, currentUser });
    }

    createSolicitud(createSolicitudDto: any, idUser: number): Observable<any> {
        return this.sendToRequest(REQUEST_PATTERNS.CREATE_SOLICITUD, { createSolicitudDto, idUser });
    }

    updateSolicitud(idSolicitud: number, updateSolicitudDto: any, currentUser: any): Observable<any> {
        return this.sendToRequest(REQUEST_PATTERNS.UPDATE_SOLICITUD, { idSolicitud, updateSolicitudDto, currentUser });
    }

    cancelSolicitud(idSolicitud: number, currentUser: any): Observable<any> {
        return this.sendToRequest(REQUEST_PATTERNS.CANCEL_SOLICITUD, { idSolicitud, currentUser });
    }

    deleteSolicitud(idSolicitud: number, currentUser: any): Observable<any> {
        return this.sendToRequest(REQUEST_PATTERNS.DELETE_SOLICITUD, { idSolicitud, currentUser });
    }

    findSolicitudesByUser(idUser: number, filterDto?: any): Observable<any> {
        return this.sendToRequest(REQUEST_PATTERNS.FIND_SOLICITUDES_BY_USER, { idUser, filterDto });
    }

    getSolicitudesStats(idUser?: number): Observable<any> {
        return this.sendToRequest(REQUEST_PATTERNS.GET_SOLICITUDES_STATS, { idUser });
    }

    findAvailableForTechnicians(filterDto?: any): Observable<any> {
        return this.sendToRequest(REQUEST_PATTERNS.FIND_AVAILABLE_FOR_TECHNICIANS, { filterDto });
    }

    // === SOLICITUDES-TECNICOS ===
    findAllSolicitudesTecnicos(): Observable<any> {
        return this.sendToRequest(REQUEST_PATTERNS.FIND_ALL_SOLICITUDES_TECNICOS, {});
    }

    findSolicitudTecnicoById(idSolTec: number, currentUser?: any): Observable<any> {
        return this.sendToRequest(REQUEST_PATTERNS.FIND_SOLICITUD_TECNICO_BY_ID, { idSolTec, currentUser });
    }

    postularseSolicitud(createDto: any, idTecnico: number): Observable<any> {
        return this.sendToRequest(REQUEST_PATTERNS.POSTULARSE_SOLICITUD, { createDto, idTecnico });
    }

    responderSolicitud(idSolTec: number, respuestaDto: any, currentUser: any): Observable<any> {
        return this.sendToRequest(REQUEST_PATTERNS.RESPONDER_SOLICITUD, { idSolTec, respuestaDto, currentUser });
    }

    findSolicitudesBySolicitud(idSolicitud: number, currentUser?: any): Observable<any> {
        return this.sendToRequest(REQUEST_PATTERNS.FIND_SOLICITUDES_BY_SOLICITUD, { idSolicitud, currentUser });
    }

    findSolicitudesByTecnico(idTecnico: number): Observable<any> {
        return this.sendToRequest(REQUEST_PATTERNS.FIND_SOLICITUDES_BY_TECNICO, { idTecnico });
    }

    updateSolicitudTecnico(idSolTec: number, updateDto: any, idTecnico: number): Observable<any> {
        return this.sendToRequest(REQUEST_PATTERNS.UPDATE_SOLICITUD_TECNICO, { idSolTec, updateDto, idTecnico });
    }

    cancelSolicitudTecnico(idSolTec: number, idTecnico: number): Observable<any> {
        return this.sendToRequest(REQUEST_PATTERNS.CANCEL_SOLICITUD_TECNICO, { idSolTec, idTecnico });
    }

    getStatsByTecnico(idTecnico: number): Observable<any> {
        return this.sendToRequest(REQUEST_PATTERNS.GET_STATS_BY_TECNICO, { idTecnico });
    }

    // === TRANSACCIONES ===
    createTransaccion(createTransaccionDto: any, currentUser: any): Observable<any> {
        return this.sendToRequest(REQUEST_PATTERNS.CREATE_TRANSACCION, { createTransaccionDto, currentUser });
    }

    updateTransaccion(idTransaccion: number, updateTransaccionDto: any, currentUser: any): Observable<any> {
        return this.sendToRequest(REQUEST_PATTERNS.UPDATE_TRANSACCION, { idTransaccion, updateTransaccionDto, currentUser });
    }

    findTransaccionesBySolicitud(idSolicitud: number): Observable<any> {
        return this.sendToRequest(REQUEST_PATTERNS.FIND_TRANSACCIONES_BY_SOLICITUD, { idSolicitud });
    }

    procesarPago(idSolicitud: number, procesarPagoDto: any, currentUser: any): Observable<any> {
        return this.sendToRequest(REQUEST_PATTERNS.PROCESAR_PAGO, { idSolicitud, procesarPagoDto, currentUser });
    }

    // === MAESTRITO ===
    startMaestritoSession(idUser: number): Observable<any> {
        return this.sendToRequest(MAESTRITO_PATTERNS.START_SESSION, { idUser });
    }

    sendMaestritoMessage(sessionId: string, message: string, idUser: number): Observable<any> {
        return this.sendToRequest(MAESTRITO_PATTERNS.SEND_MESSAGE, { sessionId, message, idUser });
    }

    getMaestritoSessionHistory(sessionId: string): Observable<any> {
        return this.sendToRequest(MAESTRITO_PATTERNS.GET_SESSION_HISTORY, { sessionId });
    }

    endMaestritoSession(sessionId: string): Observable<any> {
        return this.sendToRequest(MAESTRITO_PATTERNS.END_SESSION, { sessionId });
    }
}

import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MicroserviceProxyService } from './microservice-proxy.service';
import { PAYMENT_PATTERNS } from '@app/events';

@Injectable()
export class PaymentProxyService extends MicroserviceProxyService {

    // === TRANSACCIONES ===
    findAllTransacciones(filterDto?: any): Observable<any> {
        return this.sendToPayment(PAYMENT_PATTERNS.GET_ALL_TRANSACCIONES, filterDto || {});
    }

    findTransaccionById(idTransaccion: number): Observable<any> {
        return this.sendToPayment(PAYMENT_PATTERNS.GET_TRANSACCION, { idTransaccion });
    }

    createTransaccion(createTransaccionDto: any, currentUser: any): Observable<any> {
        return this.sendToPayment(PAYMENT_PATTERNS.CREATE_TRANSACCION, { createTransaccionDto, currentUser });
    }

    updateTransaccion(idTransaccion: number, updateTransaccionDto: any, currentUser: any): Observable<any> {
        return this.sendToPayment(PAYMENT_PATTERNS.UPDATE_TRANSACCION, { idTransaccion, updateTransaccionDto, currentUser });
    }

    // === PROCESAMIENTO DE PAGOS ===
    procesarPago(idSolicitud: number, procesarPagoDto: any, currentUser: any): Observable<any> {
        return this.sendToPayment(PAYMENT_PATTERNS.PROCESAR_PAGO, { idSolicitud, procesarPagoDto, currentUser });
    }

    confirmarPago(idTransaccion: number, currentUser: any): Observable<any> {
        return this.sendToPayment(PAYMENT_PATTERNS.CONFIRMAR_PAGO, { idTransaccion, currentUser });
    }

    marcarComoFallido(idTransaccion: number, currentUser: any): Observable<any> {
        return this.sendToPayment(PAYMENT_PATTERNS.MARCAR_FALLIDO, { idTransaccion, currentUser });
    }

    // === CONSULTAS ESPECÍFICAS ===
    findTransaccionesBySolicitud(idSolicitud: number): Observable<any> {
        return this.sendToPayment(PAYMENT_PATTERNS.GET_BY_SOLICITUD, { idSolicitud });
    }

    findTransaccionesByUser(idUser: number, filterDto?: any): Observable<any> {
        return this.sendToPayment(PAYMENT_PATTERNS.GET_BY_USER, { idUser, filterDto });
    }

    // === ESTADÍSTICAS ===
    getPaymentStats(idUser?: number): Observable<any> {
        return this.sendToPayment(PAYMENT_PATTERNS.GET_STATS, { idUser });
    }

    getStatsByMetodoPago(idUser?: number): Observable<any> {
        return this.sendToPayment(PAYMENT_PATTERNS.GET_STATS_BY_METODO, { idUser });
    }

    getUserStats(idUser: number): Observable<any> {
        return this.sendToPayment(PAYMENT_PATTERNS.GET_USER_STATS, { idUser });
    }

    getUserStatsByMetodoPago(idUser: number): Observable<any> {
        return this.sendToPayment(PAYMENT_PATTERNS.GET_USER_STATS_BY_METODO, { idUser });
    }
}

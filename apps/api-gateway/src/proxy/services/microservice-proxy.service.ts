import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, timeout, retry, catchError, throwError } from 'rxjs';

@Injectable()
export class MicroserviceProxyService {
    private readonly logger = new Logger(MicroserviceProxyService.name);

    constructor(
        @Inject('AUTH_SERVICE') protected authClient: ClientProxy,
        @Inject('GEO_SERVICE') protected geoClient: ClientProxy,
        @Inject('TECHNICIAN_SERVICE') protected technicianClient: ClientProxy,
        @Inject('REQUEST_SERVICE') protected requestClient: ClientProxy,
        @Inject('PAYMENT_SERVICE') protected paymentClient: ClientProxy,
        @Inject('NOTIFICATION_SERVICE') protected notificationClient: ClientProxy,
    ) { }

    protected sendToService(
        client: ClientProxy,
        pattern: string,
        data: any,
        timeoutMs: number = 30000
    ): Observable<any> {
        this.logger.debug(`Sending message to pattern: ${pattern}`, data);
        
        return client.send(pattern, data).pipe(
            timeout(timeoutMs),
            // ⚠️ REMOVED retry logic - Microservice errors are application-level, not transient
            // The ErrorResponseInterceptor will handle {success: false} responses
            catchError((error) => {
                this.logger.error(`Error in microservice call: ${pattern}`, error.message);
                return throwError(() => error);
            })
        );
    }

    sendToAuth(pattern: string, data: any): Observable<any> {
        return this.sendToService(this.authClient, pattern, data);
    }

    sendToGeo(pattern: string, data: any): Observable<any> {
        return this.sendToService(this.geoClient, pattern, data);
    }

    sendToTechnician(pattern: string, data: any): Observable<any> {
        return this.sendToService(this.technicianClient, pattern, data);
    }

    sendToRequest(pattern: string, data: any): Observable<any> {
        return this.sendToService(this.requestClient, pattern, data);
    }

    sendToPayment(pattern: string, data: any): Observable<any> {
        return this.sendToService(this.paymentClient, pattern, data);
    }

    sendToNotification(pattern: string, data: any): Observable<any> {
        return this.sendToService(this.notificationClient, pattern, data);
    }
}

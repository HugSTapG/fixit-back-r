import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('Gateway');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        const correlationId = request.headers['x-correlation-id'];

        const now = Date.now();

        return next.handle().pipe(
            tap(() => {
                const duration = Date.now() - now;
                this.logger.debug(`${method} ${url} - ${duration}ms [${correlationId}]`);
            }),
            catchError((error) => {
                const duration = Date.now() - now;
                this.logger.error(`${method} ${url} - ${duration}ms [${correlationId}] - Error: ${error.message}`);
                throw error;
            })
        );
    }
}

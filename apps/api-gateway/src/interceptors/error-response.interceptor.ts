import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ErrorResponseInterceptor implements NestInterceptor {
    private readonly logger = new Logger('ErrorResponseInterceptor');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((response) => {
                // Si la respuesta tiene success: false, lanzar una excepción HTTP
                if (response && response.success === false) {
                    this.logger.warn(
                        `Microservice error: ${response.error}`,
                        response.statusCode
                    );

                    throw new HttpException(
                        {
                            statusCode: response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                            message: response.error || 'Error from microservice',
                            error: response.error,
                        },
                        response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                    );
                }

                // Si la respuesta es exitosa, devolver solo los datos
                if (response && response.success === true && response.data !== undefined) {
                    return response.data;
                }

                // Si la respuesta no tiene estructura {success, data}, devolverla tal cual
                return response;
            }),
            catchError((error) => {
                this.logger.error(`Error in request: ${error.message}`, error.stack);
                throw error;
            }),
        );
    }
}

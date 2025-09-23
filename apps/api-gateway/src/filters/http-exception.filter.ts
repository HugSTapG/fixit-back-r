import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseResponseDto } from '@app/shared';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger('ExceptionFilter');

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception instanceof HttpException
            ? exception.getResponse()
            : 'Internal server error';

        const correlationId = request.headers['x-correlation-id'];

        // Construct BaseResponseDto
        const errorResponse = BaseResponseDto.error(
            typeof message === 'string' ? message : (message as any).message || 'Unknown error'
        );

        // Add extra info
        errorResponse.timestamp = new Date().toISOString();
        errorResponse.path = request.url;
        (errorResponse as any).method = request.method;
        (errorResponse as any).correlationId = correlationId;
        if (typeof message === 'object') {
            errorResponse.details = message;
        }

        // Log the error
        this.logger.error(
            `HTTP Exception: ${request.method} ${request.url} - Status: ${status} - Error: ${errorResponse.error} [${correlationId}]`,
            exception instanceof Error ? exception.stack : exception
        );

        response.status(status).json(errorResponse);
    }
}


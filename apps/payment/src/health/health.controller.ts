import { Controller, Get, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('health')
export class HealthController {
    private readonly logger = new Logger(HealthController.name);

    constructor(private readonly databaseService: DatabaseService) { }

    @Get()
    async checkHealth() {
        try {
            // Verificar conexión a la base de datos
            await this.databaseService.$queryRaw`SELECT 1`;

            return {
                status: 'ok',
                service: 'payment-service',
                timestamp: new Date().toISOString(),
                database: 'connected'
            };
        } catch (error) {
            this.logger.error('Health check failed', error.stack);
            return {
                status: 'error',
                service: 'payment-service',
                timestamp: new Date().toISOString(),
                database: 'disconnected',
                error: error.message
            };
        }
    }
}

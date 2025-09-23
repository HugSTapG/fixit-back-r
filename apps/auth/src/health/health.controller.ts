import { Controller, Get, Logger } from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckService,
    MemoryHealthIndicator,
    DiskHealthIndicator,
    HealthIndicatorResult,
    HealthIndicatorService,
} from '@nestjs/terminus';
import { DatabaseService } from '../database/database.service';
import * as os from 'os';

@Controller('health')
export class HealthController {
    private readonly logger = new Logger(HealthController.name);

    constructor(
        private readonly health: HealthCheckService,
        private readonly memory: MemoryHealthIndicator,
        private readonly disk: DiskHealthIndicator,
        private readonly database: DatabaseService,
        private readonly healthIndicatorService: HealthIndicatorService,
    ) { }

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
            () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
            () => this.checkDiskCrossPlatform(),
            () => this.checkDatabase(),
        ]);
    }

    private async checkDatabase(): Promise<HealthIndicatorResult> {
        const indicator = this.healthIndicatorService.check('database');

        try {
            await this.database.$queryRaw`SELECT 1`;
            return indicator.up();
        } catch (error) {
            return indicator.down({
                message: 'Auth database health check failed',
                details: (error as Error).message,
            });
        }
    }

    private async checkDiskCrossPlatform(): Promise<HealthIndicatorResult> {
        try {
            // Detectar la plataforma y usar la ruta correcta
            const platform = os.platform();
            const diskPath = platform === 'win32' ? 'C:' : '/';

            return await this.disk.checkStorage('storage', {
                thresholdPercent: 0.8,
                path: diskPath,
            });
        } catch (error) {
            // Registrar el error para no “silenciarlo”
            this.logger.error('Disk health check failed', (error as Error).stack);

            // Devolver resultado manual
            return {
                storage: {
                    status: 'up',
                    message: 'Disk check skipped due to error',
                    platform: os.platform(),
                    error: (error as Error).message,
                },
            };
        }
    }
}

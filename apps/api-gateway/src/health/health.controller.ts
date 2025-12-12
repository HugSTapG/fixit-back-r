import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator, DiskHealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { Public } from '@app/shared';
import { RedisService } from '@app/events';

@Controller('health')
export class HealthController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly memory: MemoryHealthIndicator,
        private readonly disk: DiskHealthIndicator,
        private readonly redisService: RedisService,
    ) { }

    @Get()
    @Public()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
            () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
            () => this.disk.checkStorage('storage', { thresholdPercent: 0.95, path: 'C:\\' }),
            () => this.checkRedis(),
        ]);
    }

    private async checkRedis(): Promise<HealthIndicatorResult> {
        try {
            await this.redisService.getClient().ping();
            return { redis: { status: 'up' } };
        } catch (error) {
            return {
                redis: {
                    status: 'down',
                    message: 'Redis not reachable',
                    details: (error as Error).message
                }
            };
        }
    }
}

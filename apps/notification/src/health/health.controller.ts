import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('health')
export class HealthController {
    @Get()
    @MessagePattern('notification.health.check')
    healthCheck() {
        return {
            status: 'ok',
            service: 'notification-service',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            version: process.env.npm_package_version || '1.0.0',
        };
    }

    @Get('detailed')
    @MessagePattern('notification.health.detailed')
    detailedHealthCheck() {
        return {
            status: 'ok',
            service: 'notification-service',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            version: process.env.npm_package_version || '1.0.0',
            memory: process.memoryUsage(),
            environment: process.env.NODE_ENV || 'development',
            database: {
                status: 'connected',
                provider: 'postgresql'
            },
            dependencies: {
                'auth-service': 'available',
                'request-service': 'available',
                'technician-service': 'available'
            }
        };
    }
}

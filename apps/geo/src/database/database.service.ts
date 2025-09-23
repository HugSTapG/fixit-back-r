import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '../prismaClientGeo/generated';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(DatabaseService.name);

    constructor(private readonly configService: ConfigService) {
        super({
            datasources: {
                db: {
                    url: configService.get('GEO_DATABASE_URL'),
                },
            },
            log: ['query', 'info', 'warn', 'error'],
        });
    }

    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Connected to Geo Service database');
        } catch (error) {
            this.logger.error('Failed to connect to Geo Service database:', error);
            throw error;
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Disconnected from Geo Service database');
    }
}

import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);
    private readonly client: Redis;

    constructor(private readonly configService: ConfigService) {
        this.client = new Redis({
            host: this.configService.get<string>('REDIS_HOST', 'localhost'),
            port: this.configService.get<number>('REDIS_PORT', 6379),
            enableReadyCheck: false,
            maxRetriesPerRequest: null,
            retryStrategy: (times) => Math.min(times * 50, 2000),
        });


        this.client.on('connect', () => {
            this.logger.log('Redis connected successfully');
        });

        this.client.on('error', (error) => {
            this.logger.error('Redis connection error:', error);
        });
    }

    onModuleDestroy() {
        this.client.disconnect();
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async set(key: string, value: string, ttl?: number): Promise<void> {
        if (ttl) {
            await this.client.setex(key, ttl, value);
        } else {
            await this.client.set(key, value);
        }
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async exists(key: string): Promise<boolean> {
        const result = await this.client.exists(key);
        return result === 1;
    }

    async setCache<T>(key: string, data: T, ttl: number = 3600): Promise<void> {
        await this.set(key, JSON.stringify(data), ttl);
    }

    async getCache<T>(key: string): Promise<T | null> {
        const data = await this.get(key);
        return data ? JSON.parse(data) : null;
    }

    getClient(): Redis {
        return this.client;
    }
}

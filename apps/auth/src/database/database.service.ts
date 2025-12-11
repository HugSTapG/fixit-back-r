import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '../prismaClientAuth/generated';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(DatabaseService.name);
    private readonly prisma: PrismaClient;

    constructor(private readonly configService: ConfigService) {
        this.prisma = new PrismaClient({
            datasources: {
                db: {
                    url: configService.get('AUTH_DATABASE_URL'),
                },
            },
            log: ['query', 'info', 'warn', 'error'],
        });
    }

    async onModuleInit() {
        try {
            await this.prisma.$connect();
            this.logger.log('Connected to Auth Service database');
        } catch (error) {
            this.logger.error('Failed to connect to Auth Service database:', error);
            throw error;
        }
    }

    async onModuleDestroy() {
        await this.prisma.$disconnect();
        this.logger.log('Disconnected from Auth Service database');
    }

    // Exponer los modelos
    get usuario() {
        return this.prisma.usuario;
    }

    get sesionUsuario() {
        return this.prisma.sesionUsuario;
    }


    // Exponer métodos de Prisma
    get $queryRaw() {
        return this.prisma.$queryRaw.bind(this.prisma);
    }

    get $executeRaw() {
        return this.prisma.$executeRaw.bind(this.prisma);
    }

    get $connect() {
        return this.prisma.$connect.bind(this.prisma);
    }

    get $disconnect() {
        return this.prisma.$disconnect.bind(this.prisma);
    }

    get $transaction() {
        return this.prisma.$transaction.bind(this.prisma);
    }
}

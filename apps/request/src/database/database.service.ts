import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '../prismaClientRequest/generated';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(DatabaseService.name);
    private readonly prisma: PrismaClient;

    constructor(private readonly configService: ConfigService) {
        this.prisma = new PrismaClient({
            datasources: {
                db: {
                    url: configService.get('REQUEST_DATABASE_URL'),
                },
            },
            log: ['query', 'info', 'warn', 'error'],
        });
    }

    async onModuleInit() {
        try {
            await this.prisma.$connect();
            this.logger.log('Connected to Request Service database');
        } catch (error) {
            this.logger.error('Failed to connect to Request Service database:', error);
            throw error;
        }
    }

    async onModuleDestroy() {
        await this.prisma.$disconnect();
        this.logger.log('Disconnected from Request Service database');
    }

    // Exponer los modelos específicos del request service
    get solicitud() {
        return this.prisma.solicitud;
    }

    get solicitudTecnico() {
        return this.prisma.solicitudTecnico;
    }

    get calificacion() {
        return this.prisma.calificacion;
    }

    get transaccion() {
        return this.prisma.transaccion;
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

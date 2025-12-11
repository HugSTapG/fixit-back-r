import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database.service';

/**
 * Módulo global de base de datos para el microservicio de Payment
 * Proporciona la conexión a PostgreSQL usando Prisma
 */
@Global()
@Module({
    imports: [ConfigModule],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule { }

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TerminusModule } from '@nestjs/terminus';

// Shared libraries
import { SharedModule } from '@app/shared';
import { EventsModule, KafkaModule, RedisModule } from '@app/events';

// Local modules
import { DatabaseModule } from './database/database.module';
import { ProvinciasController } from './controllers/provincias.controller';
import { CantonesController } from './controllers/cantones.controller';
import { ParroquiasController } from './controllers/parroquias.controller';
import { UbicacionesController } from './controllers/ubicaciones.controller';
import { HealthController } from './health/health.controller';

// Services
import { ProvinciasService } from './services/provincias.service';
import { CantonesService } from './services/cantones.service';
import { ParroquiasService } from './services/parroquias.service';
import { UbicacionesService } from './services/ubicaciones.service';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    DatabaseModule,

  // Shared libraries
    SharedModule,
    EventsModule,
    KafkaModule,
    RedisModule,

    // Health checks
    TerminusModule,
    // Microservice clients
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: configService.get('AUTH_SERVICE_PORT', 3301),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'REQUEST_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: configService.get('REQUEST_SERVICE_PORT', 3305),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'TECHNICIAN_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: configService.get('TECHNICIAN_SERVICE_PORT', 3304),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],

  controllers: [
    ProvinciasController,
    CantonesController,
    ParroquiasController,
    UbicacionesController,
    HealthController,
  ],

  providers: [
    ProvinciasService,
    CantonesService,
    ParroquiasService,
    UbicacionesService,
  ],

  exports: [
    ProvinciasService,
    CantonesService,
    ParroquiasService,
    UbicacionesService,
  ],
})
export class GeoModule { }

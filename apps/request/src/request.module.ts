import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from './database/database.module';
import { SolicitudesController } from './controllers/solicitudes.controller';
import { SolicitudesTecnicosController } from './controllers/solicitudes-tecnicos.controller';
import { SolicitudesService } from './services/solicitudes.service';
import { SolicitudesTecnicosService } from './services/solicitudes-tecnicos.service';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    // Clientes para comunicarse con otros microservicios
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
    SolicitudesController,
    SolicitudesTecnicosController,
    HealthController,
  ],
  providers: [
    SolicitudesService,
    SolicitudesTecnicosService,
  ],
  exports: [
    SolicitudesService,
    SolicitudesTecnicosService,
  ],
})
export class RequestModule { }

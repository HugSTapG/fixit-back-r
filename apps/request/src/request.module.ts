import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

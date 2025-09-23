// apps/technician/src/technician.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

// Shared libraries
import { SharedModule } from '@app/shared';
import { EventsModule, KafkaModule, RedisModule } from '@app/events';

// Local modules
import { DatabaseModule } from './database/database.module';

// Controllers
import { TecnicosController } from './controllers/tecnicos.controller';
import { CertificacionesController } from './controllers/certificaciones.controller';
import { TiposServiciosController } from './controllers/tipos-servicios.controller';
import { TecnicosCertificacionesController } from './controllers/tecnicos-certificaciones.controller';
import { TecnicosParroquiasController } from './controllers/tecnicos-parroquias.controller';
import { TecnicosServiciosController } from './controllers/tecnicos-servicios.controller';
import { CalificacionesController } from './controllers/calificaciones.controller';
import { HealthController } from './health/health.controller';

// Services
import { TecnicosService } from './services/tecnicos.service';
import { CertificacionesService } from './services/certificaciones.service';
import { TiposServiciosService } from './services/tipos-servicios.service';
import { TecnicosCertificacionesService } from './services/tecnicos-certificaciones.service';
import { TecnicosParroquiasService } from './services/tecnicos-parroquias.service';
import { TecnicosServiciosService } from './services/tecnicos-servicios.service';
import { CalificacionesService } from './services/calificaciones.service';

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
  ],

  controllers: [
    TecnicosController,
    CertificacionesController,
    TiposServiciosController,
    TecnicosCertificacionesController,
    TecnicosParroquiasController,
    TecnicosServiciosController,
    CalificacionesController,
    HealthController,
  ],

  providers: [
    TecnicosService,
    CertificacionesService,
    TiposServiciosService,
    TecnicosCertificacionesService,
    TecnicosParroquiasService,
    TecnicosServiciosService,
    CalificacionesService,
  ],

  exports: [
    TecnicosService,
    CertificacionesService,
    TiposServiciosService,
    TecnicosCertificacionesService,
    TecnicosParroquiasService,
    TecnicosServiciosService,
    CalificacionesService,
  ],
})
export class TechnicianModule { }

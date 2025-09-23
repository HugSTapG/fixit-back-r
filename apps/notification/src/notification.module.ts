import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from './database/database.module';
import { NotificacionesController } from './controllers/notificaciones.controller';
import { TokensNotificacionesController } from './controllers/tokens-notificaciones.controller';
import { NotificacionesService } from './services/notificaciones.service';
import { TokensNotificacionesService } from './services/tokens-notificaciones.service';
import { PushNotificationsService } from './services/push-notifications.service';
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
    NotificacionesController,
    TokensNotificacionesController,
    HealthController,
  ],
  providers: [
    NotificacionesService,
    TokensNotificacionesService,
    PushNotificationsService,
  ],
  exports: [
    NotificacionesService,
    TokensNotificacionesService,
    PushNotificationsService,
  ],
})
export class NotificationModule { }

import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TerminusModule } from '@nestjs/terminus';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Shared libraries
import { SharedModule } from '@app/shared';
import { EventsModule, KafkaModule, RedisModule } from '@app/events';

// Local modules and services
import { ProxyModule } from './proxy/proxy.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { JwtStrategy } from './auth/strategies/jwt.strategy';

// Controllers
import { AuthController } from './controllers/auth.controller';
import { GeoController } from './controllers/geo.controller';
import { HealthController } from './health/health.controller';
import { UsuariosController } from './controllers/usuarios.controller';
import { TechnicianController } from './controllers/technician.controller';
import { CatalogController } from './controllers/catalog.controller';
import { RequestController } from './controllers/request.controller';
import { PaymentController } from './controllers/payment.controller';
import { NotificationController } from './controllers/notification.controller';

// Middleware
import { CorrelationIdMiddleware } from './middleware/correlation-id.middleware';
import { LoggingMiddleware } from './middleware/logging.middleware';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Authentication
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),

    // Shared libraries
    SharedModule,
    EventsModule,
    KafkaModule,
    RedisModule,

    // Health checks
    TerminusModule,

    // Microservices clients
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
        name: 'GEO_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: configService.get('GEO_SERVICE_PORT', 3302),
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
        name: 'PAYMENT_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: configService.get('PAYMENT_SERVICE_PORT', 3306),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'NOTIFICATION_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: configService.get('NOTIFICATION_SERVICE_PORT', 3307),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ProxyModule,
  ],
  controllers: [
    // Auth controllers
    AuthController,
    UsuariosController,

    // Geo controllers
    GeoController,
    // Catalog controller
    CatalogController,

    // Technician controller
    TechnicianController,

    // Request controller
    RequestController,

    // Payment controller
    PaymentController,

    // Notification controller
    NotificationController,

    // Health controller
    HealthController,
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class ApiModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationIdMiddleware, LoggingMiddleware)
      .forRoutes('*');
  }
}

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { TerminusModule } from '@nestjs/terminus';

// Shared libraries
import { EventsModule, KafkaModule, RedisModule } from '@app/events';
import { SharedModule } from '@app/shared';

// Local modules and services
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { ProxyModule } from './proxy/proxy.module';

// Controllers
import { AuthController } from './controllers/auth.controller';
import { GeoController } from './controllers/geo.controller';
import { NotificationController } from './controllers/notification.controller';
import { PaymentController } from './controllers/payment.controller';
import { RequestController } from './controllers/request.controller';
import { TechnicianController } from './controllers/technician.controller';
import { UsuariosController } from './controllers/usuarios.controller';
import { HealthController } from './health/health.controller';

// ✅ LLM Controller
import { LlmController } from './controllers/llm.controller';

// Middleware
import { CorrelationIdMiddleware } from './middleware/correlation-id.middleware';
import { LoggingMiddleware } from './middleware/logging.middleware';

@Module({
  imports: [
    // =========================
    // Configuration
    // =========================
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // =========================
    // Authentication
    // =========================
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

    // =========================
    // Shared libraries
    // =========================
    SharedModule,
    EventsModule,
    KafkaModule,
    RedisModule,

    // =========================
    // Health checks
    // =========================
    TerminusModule,

    // =========================
    // Microservices clients
    // =========================
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

    // =========================
    // Proxy module (HTTP → MS)
    // =========================
    ProxyModule,
  ],

  // =========================
  // Controllers
  // =========================
  controllers: [
    AuthController,
    UsuariosController,
    GeoController,
    TechnicianController,
    RequestController,
    PaymentController,
    NotificationController,

    // ✅ LLM endpoint registered here
    LlmController,

    HealthController,
  ],

  // =========================
  // Providers / Guards
  // =========================
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
    consumer.apply(CorrelationIdMiddleware, LoggingMiddleware).forRoutes('*');
  }
}

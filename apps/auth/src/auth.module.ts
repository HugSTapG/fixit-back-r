import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TerminusModule } from '@nestjs/terminus';

// Shared libraries
import { SharedModule } from '@app/shared';
import { EventsModule, KafkaModule } from '@app/events';

// Local modules
import { DatabaseModule } from './database/database.module';
import { AuthController } from './controllers/auth.controller';
import { UsuariosController } from './controllers/usuarios.controller';
import { HealthController } from './health/health.controller';

// Services
import { AuthService } from './services/auth.service';
import { UsuariosService } from './services/usuarios.service';

// Guards and strategies
import { JwtStrategy } from './guards/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    DatabaseModule,

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
    AuthController,
    UsuariosController,
    HealthController,
  ],

  providers: [
    AuthService,
    UsuariosService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],

  exports: [
    AuthService,
    UsuariosService,
  ],
})
export class AuthModule {}
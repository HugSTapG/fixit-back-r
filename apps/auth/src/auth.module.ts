import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
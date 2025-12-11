import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const logger = new Logger('AuthService');

  // Crear aplicación híbrida (HTTP + TCP)
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Configurar microservicio TCP
  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: configService.get('AUTH_SERVICE_PORT', 3001),
    },
  };

  app.connectMicroservice(microserviceOptions);

  // Puerto para health checks HTTP
  const httpPort = configService.get('AUTH_SERVICE_HTTP_PORT', 3011);

  await app.startAllMicroservices();
  await app.listen(httpPort);

  logger.log(`Auth Service TCP running on port ${configService.get('AUTH_SERVICE_PORT', 3001)}`);
  logger.log(`Auth Service HTTP running on port ${httpPort}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start Auth Service:', error);
  process.exit(1);
});

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { RequestModule } from './request.module';

async function bootstrap() {
  const logger = new Logger('RequestService');

  // Crear aplicación híbrida (HTTP + TCP)
  const app = await NestFactory.create(RequestModule);
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
      port: configService.get('REQUEST_SERVICE_PORT', 3305),
    },
  };

  app.connectMicroservice(microserviceOptions);

  // Puerto para health checks HTTP
  const httpPort = configService.get('REQUEST_SERVICE_HTTP_PORT', 3315);

  await app.startAllMicroservices();
  await app.listen(httpPort);

  logger.log(`Request Service TCP running on port ${configService.get('REQUEST_SERVICE_PORT', 3305)}`);
  logger.log(`Request Service HTTP running on port ${httpPort}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start Request Service:', error);
  process.exit(1);
});

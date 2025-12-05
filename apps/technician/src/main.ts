import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { TechnicianModule } from './technician.module';

async function bootstrap() {
  const logger = new Logger('TechnicianService');

  // Crear aplicación híbrida (HTTP + TCP)
  const app = await NestFactory.create(TechnicianModule);
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
      skipMissingProperties: true, // ← AGREGAR ESTO
    }),
  );

  // Configurar microservicio TCP
  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: configService.get('TECHNICIAN_SERVICE_PORT', 3304),
    },
  };

  app.connectMicroservice(microserviceOptions);

  // Puerto para health checks HTTP
  const httpPort = configService.get('TECHNICIAN_SERVICE_HTTP_PORT', 3314);

  await app.startAllMicroservices();
  await app.listen(httpPort);

  logger.log(
    `Technician Service TCP running on port ${configService.get('TECHNICIAN_SERVICE_PORT', 3304)}`,
  );
  logger.log(`Technician Service HTTP running on port ${httpPort}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start Technician Service:', error);
  process.exit(1);
});

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { GeoModule } from './geo.module';

async function bootstrap() {
  const logger = new Logger('GeoService');

  // Crear aplicación híbrida (HTTP + TCP)
  const app = await NestFactory.create(GeoModule);
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
      port: configService.get('GEO_SERVICE_PORT', 3003),
    },
  };

  app.connectMicroservice(microserviceOptions);

  // Puerto para health checks HTTP
  const httpPort = configService.get('GEO_SERVICE_HTTP_PORT', 3013);

  await app.startAllMicroservices();
  await app.listen(httpPort);

  logger.log(`Geo Service TCP running on port ${configService.get('GEO_SERVICE_PORT', 3003)}`);
  logger.log(`Geo Service HTTP running on port ${httpPort}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start Geo Service:', error);
  process.exit(1);
});

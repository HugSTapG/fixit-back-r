import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { PaymentModule } from './payment.module';

async function bootstrap() {
  const logger = new Logger('PaymentService');

  // Crear aplicación híbrida (HTTP + TCP)
  const app = await NestFactory.create(PaymentModule);
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
      port: configService.get('PAYMENT_SERVICE_PORT', 3306),
    },
  };

  app.connectMicroservice(microserviceOptions);

  // Puerto para health checks HTTP
  const httpPort = configService.get('PAYMENT_SERVICE_HTTP_PORT', 3316);

  await app.startAllMicroservices();
  await app.listen(httpPort);

  logger.log(`Payment Service TCP running on port ${configService.get('PAYMENT_SERVICE_PORT', 3306)}`);
  logger.log(`Payment Service HTTP running on port ${httpPort}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start Payment Service:', error);
  process.exit(1);
});

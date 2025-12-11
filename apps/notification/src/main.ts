import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NotificationModule } from './notification.module';

async function bootstrap() {
  const logger = new Logger('NotificationMicroservice');

  // Crear contexto de aplicación para obtener ConfigService
  const appContext = await NestFactory.createApplicationContext(NotificationModule);
  const configService = appContext.get(ConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: configService.get('NOTIFICATION_SERVICE_PORT', 3307),
      },
    },
  );

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen();
  await appContext.close();

  const port = configService.get('NOTIFICATION_SERVICE_PORT', 3307);
  logger.log(`🚀 Notification Microservice is running on port ${port}`);
}

bootstrap().catch((error) => {
  const logger = new Logger('NotificationMicroservice');
  logger.error('❌ Failed to start Notification Microservice', error.stack);
  process.exit(1);
});

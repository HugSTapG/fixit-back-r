import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiModule } from './api.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { CorrelationIdMiddleware } from './middleware/correlation-id.middleware';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(ApiModule);
  const configService = app.get(ConfigService);

  // Apply CorrelationIdMiddleware globally
  app.use(new CorrelationIdMiddleware().use);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    })
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TimeoutInterceptor(30000) // 30 seconds timeout
  );

  // Enable CORS
  app.enableCors({
    origin: configService.get('FRONTEND_URL') || 'http://localhost:8081',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-ID'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  const port = configService.get<number>('API_GATEWAY_PORT') || 3000;

  await app.listen(port);

  logger.log(`🚀 FixIt API Gateway running on: http://localhost:${port}/api/v1`);
  logger.log(`📊 Health check: http://localhost:${port}/api/v1/health`);
  logger.log(`🌍 Environment: ${configService.get('NODE_ENV', 'development')}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});


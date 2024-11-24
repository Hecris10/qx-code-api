import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ErrorLogService } from './common/services/error-log.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const errorLogService = app.get(ErrorLogService);
  app.useGlobalFilters(new HttpExceptionFilter(errorLogService)); // Pass errorLogService to the filter
  app.setGlobalPrefix('api'); // Set the global prefix
  const port = process.env.PORT || 3001;
  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type, Accept, Authorization'],
    credentials: true,
  });

  await app.listen(port);
}
bootstrap();

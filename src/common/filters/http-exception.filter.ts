// src/common/filters/http-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorLogService } from '../services/error-log.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly errorLogService: ErrorLogService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const { message } = exception;
    const { user, method, originalUrl } = request;
    const userId = Number(user && 'id' in user ? user.id : null);

    // Log the error asynchronously
    this.errorLogService
      .createErrorLog({
        statusCode: status,
        message,
        userId,
        path: originalUrl,
        method,
      })
      .catch((err) => console.error('Error logging failed:', err));

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}

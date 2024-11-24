import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorLogService } from '../services/error-log.service';

@Injectable()
export class ErrorLoggingInterceptor implements NestInterceptor {
  constructor(private readonly errorLogService: ErrorLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const request = context.switchToHttp().getRequest();
        const { statusCode, message } = error;
        const { user, method, originalUrl } = request;
        const userId = user ? user.id : null;

        // Log the error asynchronously
        this.errorLogService
          .createErrorLog({
            statusCode,
            message,
            userId,
            path: originalUrl,
            method,
          })
          .catch((err) => console.error('Error logging failed:', err));

        return throwError(error);
      }),
    );
  }
}

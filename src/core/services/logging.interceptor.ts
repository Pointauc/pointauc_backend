import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const now = Date.now();

    const logRequestData = () => {
      const req = context.switchToHttp().getRequest();
      console.log(`[${req.method}] ${req.url} - ${Date.now() - now}ms`);
    };

    return next.handle().pipe(tap(logRequestData));
  }
}

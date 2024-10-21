import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const body = request.body;

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`Requesição para ${method} ${url}  body: ${JSON.stringify(body)}, data: ${Date.now() - now}ms`)),
      );
  }
}

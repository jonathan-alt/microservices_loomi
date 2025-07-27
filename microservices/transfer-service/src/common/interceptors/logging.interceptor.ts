import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Request } from "express";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;
    const url = request.url;
    const body = request.body as unknown;
    const now = Date.now();

    this.logger.log(`${method} ${url} - Request: ${JSON.stringify(body)}`);

    return next.handle().pipe(
      tap((data) => {
        const responseTime = Date.now() - now;
        this.logger.log(
          `${method} ${url} - Response: ${JSON.stringify(data)} - ${responseTime}ms`,
        );
      }),
    );
  }
}

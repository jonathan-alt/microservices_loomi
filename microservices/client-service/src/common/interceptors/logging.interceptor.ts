import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap, catchError } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, headers } = request;
    const userAgent = headers["user-agent"] || "";
    const ip = headers["x-forwarded-for"] || request.connection.remoteAddress;

    const now = Date.now();

    this.logger.log(` ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);

    if (body && Object.keys(body).length > 0) {
      this.logger.debug(` Request Body: ${JSON.stringify(body)}`);
    }

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        this.logger.log(`${method} ${url} - ${responseTime}ms - Status: 200`);
      }),
      catchError((error) => {
        const responseTime = Date.now() - now;
        this.logger.error(
          `❌ ${method} ${url} - ${responseTime}ms - Status: ${error.status || 500} - Error: ${error.message}`,
        );
        throw error;
      }),
    );
  }
}

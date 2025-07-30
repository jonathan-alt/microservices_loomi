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
export class MetricsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MetricsInterceptor.name);
  private requestCount = 0;
  private errorCount = 0;
  private responseTimes: number[] = [];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    this.requestCount++;

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        this.responseTimes.push(responseTime);

        // Log métricas a cada 10 requests
        if (this.requestCount % 10 === 0) {
          this.logMetrics();
        }

        this.logger.log(`📊 ${method} ${url} - ${responseTime}ms - Success`);
      }),
      catchError((error) => {
        const responseTime = Date.now() - now;
        this.errorCount++;

        this.logger.error(
          `📊 ${method} ${url} - ${responseTime}ms - Error: ${error.message}`,
        );

        throw error;
      }),
    );
  }

  private logMetrics() {
    const avgResponseTime =
      this.responseTimes.length > 0
        ? this.responseTimes.reduce((a, b) => a + b, 0) /
          this.responseTimes.length
        : 0;

    const errorRate =
      this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0;

    this.logger.log(
      `📈 METRICS - Requests: ${this.requestCount}, Errors: ${this.errorCount}, ` +
        `Error Rate: ${errorRate.toFixed(2)}%, Avg Response Time: ${avgResponseTime.toFixed(2)}ms`,
    );

    // Reset arrays para evitar crescimento infinito
    if (this.responseTimes.length > 100) {
      this.responseTimes = this.responseTimes.slice(-50);
    }
  }

  // Métodos para expor métricas
  getRequestCount(): number {
    return this.requestCount;
  }

  getErrorCount(): number {
    return this.errorCount;
  }

  getErrorRate(): number {
    return this.requestCount > 0
      ? (this.errorCount / this.requestCount) * 100
      : 0;
  }

  getAverageResponseTime(): number {
    return this.responseTimes.length > 0
      ? this.responseTimes.reduce((a, b) => a + b, 0) /
          this.responseTimes.length
      : 0;
  }

  getMetrics() {
    return {
      totalRequests: this.requestCount,
      totalErrors: this.errorCount,
      errorRate: this.getErrorRate(),
      averageResponseTime: this.getAverageResponseTime(),
      timestamp: new Date().toISOString(),
    };
  }
}

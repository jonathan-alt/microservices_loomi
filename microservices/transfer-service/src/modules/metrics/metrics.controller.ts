import { Controller, Get } from "@nestjs/common";
import { MetricsInterceptor } from "../../common/interceptors/metrics.interceptor";

@Controller("metrics")
export class MetricsController {
  constructor(private readonly metricsInterceptor: MetricsInterceptor) {}

  @Get()
  getMetrics() {
    return this.metricsInterceptor.getMetrics();
  }

  @Get("health")
  getHealth() {
    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "transfer-service",
    };
  }
}

import { Module } from "@nestjs/common";
import { MetricsController } from "./metrics.controller";
import { MetricsInterceptor } from "../../common/interceptors/metrics.interceptor";

@Module({
  controllers: [MetricsController],
  providers: [MetricsInterceptor],
  exports: [MetricsInterceptor],
})
export class MetricsModule {}

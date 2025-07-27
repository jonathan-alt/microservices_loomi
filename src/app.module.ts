import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TransferModule } from "./modules/transfer/transfer.module";
import { AccountModule } from "./modules/account/account.module";
import { HistoryModule } from "./modules/history/history.module";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    TransferModule,
    AccountModule,
    HistoryModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}

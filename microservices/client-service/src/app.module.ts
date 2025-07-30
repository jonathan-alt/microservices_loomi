import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { AuthModule } from "./modules/auth/auth.module";
import { MessagingModule } from "./modules/messaging/messaging.module";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      username: process.env.DB_USERNAME || "your_username",
      password: process.env.DB_PASSWORD || "your_password",
      database: process.env.DB_NAME || "your_database_name",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: false,
      logging: true,
    }),
    AuthModule,
    MessagingModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: class {},
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}

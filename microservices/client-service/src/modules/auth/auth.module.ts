import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { UserSession } from "./entities/user-session.entity";
import { RedisService } from "./services/redis.service";
import { BlacklistGuard } from "./guards/blacklist.guard";
import { MessagingModule } from "../messaging/messaging.module";
import { jwtConfig } from "../../config/jwt.config";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: jwtConfig.signOptions,
    }),
    TypeOrmModule.forFeature([UserSession]),
    MessagingModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    RedisService,
    BlacklistGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}

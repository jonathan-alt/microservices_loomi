import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { RedisService } from "../services/redis.service";

@Injectable()
export class BlacklistGuard implements CanActivate {
  constructor(private redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace("Bearer ", "");

    if (token) {
      const isBlacklisted = await this.redisService.isBlacklisted(token);
      if (isBlacklisted) {
        throw new UnauthorizedException("Token revogado");
      }
    }

    return true;
  }
}

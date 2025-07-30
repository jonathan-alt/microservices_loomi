import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConfig } from "../../../config/jwt.config";
import { JwtPayload } from "../types/auth.types";
import { RedisService } from "../services/redis.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private redisService: RedisService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  validate(payload: JwtPayload) {
    // Por enquanto, vamos usar um middleware global para verificar blacklist
    // A validação será feita no guard personalizado
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      cpf: payload.cpf,
    };
  }
}

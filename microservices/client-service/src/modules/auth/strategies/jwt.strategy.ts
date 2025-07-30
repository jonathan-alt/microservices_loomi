import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConfig } from "../../../config/jwt.config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: any) {
    // Aqui você pode adicionar validações adicionais
    // Por exemplo, verificar se o usuário ainda existe no banco
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      cpf: payload.cpf,
    };
  }
}

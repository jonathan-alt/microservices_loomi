import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConfig } from "../../../config/jwt.config";
import { JwtPayload } from "../types/auth.types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  validate(payload: JwtPayload) {
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

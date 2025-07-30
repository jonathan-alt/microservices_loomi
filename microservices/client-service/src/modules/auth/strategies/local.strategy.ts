import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      usernameField: "email",
    });
  }

  async validate(email: string, password: string): Promise<any> {
    // Aqui você implementará a lógica de validação
    // Por enquanto, retornamos um mock
    if (email === "test@example.com" && password === "password") {
      return {
        id: 1,
        email: "test@example.com",
        name: "Test User",
        cpf: "123.456.789-00",
      };
    }
    throw new UnauthorizedException("Credenciais inválidas");
  }
}

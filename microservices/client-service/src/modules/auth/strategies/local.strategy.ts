import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { Client } from "../types/auth.types";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      usernameField: "email",
    });
  }

  validate(email: string, password: string): Client {
    // Aqui você implementará a lógica de validação
    // Por enquanto, retornamos um mock
    if (email === "test@example.com" && password === "password") {
      return {
        id: 1,
        email: "test@example.com",
        name: "Test User",
        cpf: "123.456.789-00",
        picture: "https://example.com/test.jpg",
        phone: "(11) 99999-9999",
      };
    }
    throw new UnauthorizedException("Credenciais inválidas");
  }
}

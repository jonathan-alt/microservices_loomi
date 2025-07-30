import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { jwtConfig } from "../../config/jwt.config";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Aqui você implementará a validação real com o banco
    // Por enquanto, usamos dados mock
    if (
      loginDto.email === "test@example.com" &&
      loginDto.password === "password"
    ) {
      const user = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        cpf: "123.456.789-00",
        picture: "https://example.com/test.jpg",
        phone: "(11) 99999-9999",
      };

      return this.generateTokens(user);
    }

    throw new UnauthorizedException("Credenciais inválidas");
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Aqui você implementará o registro real
    // Por enquanto, simulamos um registro bem-sucedido
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = {
      id: 2, // Simulando ID gerado
      name: registerDto.name,
      email: registerDto.email,
      cpf: registerDto.cpf,
      picture: registerDto.picture,
      phone: registerDto.phone,
    };

    return this.generateTokens(user);
  }

  async refreshToken(token: string): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: jwtConfig.secret,
      });

      // Aqui você pode verificar se o token está na blacklist
      const user = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        cpf: payload.cpf,
        picture: payload.picture,
        phone: payload.phone,
      };

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException("Token inválido");
    }
  }

  private generateTokens(user: any): AuthResponseDto {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      cpf: user.cpf,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: jwtConfig.signOptions.expiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: jwtConfig.refreshExpiresIn,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 900, // 15 minutos em segundos
      token_type: "Bearer",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        picture: user.picture,
        phone: user.phone,
      },
    };
  }

  async logout(token: string): Promise<void> {
    // Aqui você implementará a revogação do token
    // Por exemplo, adicionar à blacklist no Redis
    console.log("Token revogado:", token);
  }
}

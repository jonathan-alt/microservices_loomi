import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { jwtConfig } from "../../config/jwt.config";
import { User, JwtPayload } from "./types/auth.types";
import { RedisService } from "./services/redis.service";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Rate limiting
    const attempts = await this.redisService.incrementLoginAttempts(
      loginDto.email,
    );
    if (attempts > 5) {
      throw new BadRequestException(
        "Muitas tentativas de login. Tente novamente em 15 minutos.",
      );
    }

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

      // Reset login attempts on success
      await this.redisService.resetLoginAttempts(loginDto.email);

      // Cache user data
      await this.redisService.cacheUser(user.id, user);

      return this.generateTokens(user);
    }

    throw new UnauthorizedException("Credenciais inválidas");
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Aqui você implementará o registro real
    // Por enquanto, simulamos um registro bem-sucedido
    await bcrypt.hash(registerDto.password, 10); // Simulando hash

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

  refreshToken(token: string): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: jwtConfig.secret,
      });

      // Aqui você pode verificar se o token está na blacklist
      const user: User = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        cpf: payload.cpf,
        picture: "https://example.com/default.jpg",
        phone: "(11) 99999-9999",
      };

      return Promise.resolve(this.generateTokens(user));
    } catch {
      throw new UnauthorizedException("Token inválido");
    }
  }

  private generateTokens(user: User): AuthResponseDto {
    const payload: JwtPayload = {
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
    // Adicionar token à blacklist
    await this.redisService.addToBlacklist(token, 3600); // 1 hora

    // Remover sessão ativa
    const payload = this.jwtService.verify(token, {
      secret: jwtConfig.secret,
    });

    await this.redisService.removeSession(token);
    console.log("Token revogado:", token);
  }
}

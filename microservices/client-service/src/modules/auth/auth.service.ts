import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { jwtConfig } from "../../config/jwt.config";
import { JwtPayload } from "./types/auth.types";
import { RedisService } from "./services/redis.service";
import { MessagingService } from "../messaging/messaging.service";
import { Client } from "./entities/client.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private jwtService: JwtService,
    private redisService: RedisService,
    private messagingService: MessagingService,
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

    // Buscar usuário no banco de dados
    const client = await this.clientRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!client) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      client.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const userData = {
      id: client.id,
      name: client.name,
      email: client.email,
      cpf: client.cpf,
      picture: client.picture,
      phone: client.phone,
    };

    // Reset login attempts on success
    await this.redisService.resetLoginAttempts(loginDto.email);

    // Cache user data
    await this.redisService.cacheUser(userData.id, userData);

    // Publish login event
    await this.messagingService.publishUserLoggedIn(userData);

    return this.generateTokens(userData);
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Verificar se o email já existe
    const existingClient = await this.clientRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingClient) {
      throw new BadRequestException("Email já cadastrado");
    }

    // Verificar se o CPF já existe
    const existingCpf = await this.clientRepository.findOne({
      where: { cpf: registerDto.cpf },
    });

    if (existingCpf) {
      throw new BadRequestException("CPF já cadastrado");
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Criar novo cliente
    const newClient = this.clientRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      cpf: registerDto.cpf,
      picture: registerDto.picture,
      phone: registerDto.phone,
      password: hashedPassword,
    });

    const savedClient = await this.clientRepository.save(newClient);

    const userData = {
      id: savedClient.id,
      name: savedClient.name,
      email: savedClient.email,
      cpf: savedClient.cpf,
      picture: savedClient.picture,
      phone: savedClient.phone,
    };

    return this.generateTokens(userData);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken) as JwtPayload;
      const userData = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        cpf: payload.cpf,
        picture: "https://example.com/default.jpg", // Default picture
        phone: "(11) 99999-9999", // Default phone
      };

      return Promise.resolve(this.generateTokens(userData));
    } catch {
      throw new UnauthorizedException("Token inválido");
    }
  }

  private generateTokens(userData: any): AuthResponseDto {
    const payload = {
      sub: userData.id,
      email: userData.email,
      name: userData.name,
      cpf: userData.cpf,
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
      expires_in: 900, // 15 minutes
      token_type: "Bearer",
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        cpf: userData.cpf,
        picture: userData.picture,
        phone: userData.phone,
      },
    };
  }

  async logout(token: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token) as JwtPayload;
      await this.redisService.addToBlacklist(token, 3600); // 1 hour
      await this.messagingService.publishUserLoggedOut({ id: payload.sub });
    } catch {
      // Token inválido, mas ainda assim adicionar ao blacklist
      await this.redisService.addToBlacklist(token, 3600); // 1 hour
    }
  }
}

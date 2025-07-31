import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";

import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { BlacklistGuard } from "./guards/blacklist.guard";
import { RequestWithUser, User } from "./types/auth.types";
import { ApiProperty } from "@nestjs/swagger";

// Classe para documentação do Swagger
export class UserResponse {
  @ApiProperty({ description: "ID do usuário", example: 1 })
  id: number;

  @ApiProperty({ description: "Nome do usuário", example: "João Silva" })
  name: string;

  @ApiProperty({ description: "Email do usuário", example: "joao@email.com" })
  email: string;

  @ApiProperty({ description: "CPF do usuário", example: "123.456.789-00" })
  cpf: string;

  @ApiProperty({
    description: "URL da foto de perfil",
    example: "https://example.com/photo.jpg",
  })
  picture: string;

  @ApiProperty({
    description: "Telefone do usuário (opcional)",
    example: "(11) 99999-9999",
    required: false,
  })
  phone?: string;
}

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "Fazer login do usuário" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: "Login realizado com sucesso",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Credenciais inválidas",
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post("register")
  @ApiOperation({ summary: "Registrar novo usuário" })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: "Usuário registrado com sucesso",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Dados inválidos ou usuário já existe",
  })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() body: { refresh_token: string },
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(body.refresh_token);
  }

  @Post("logout")
  @ApiOperation({ summary: "Fazer logout do usuário" })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Logout realizado com sucesso",
  })
  @ApiResponse({
    status: 401,
    description: "Token inválido",
  })
  @UseGuards(JwtAuthGuard, BlacklistGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: RequestWithUser): Promise<{ message: string }> {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token) {
      await this.authService.logout(token);
    }
    return { message: "Logout realizado com sucesso" };
  }

  @Post("me")
  @ApiOperation({ summary: "Obter perfil do usuário logado" })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Perfil do usuário",
    type: UserResponse,
  })
  @ApiResponse({
    status: 401,
    description: "Token inválido",
  })
  @UseGuards(JwtAuthGuard, BlacklistGuard)
  @HttpCode(HttpStatus.OK)
  getProfile(@Request() req: RequestWithUser): User {
    return req.user;
  }
}

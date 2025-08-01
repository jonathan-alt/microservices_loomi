import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsCPF } from "../../client/dto/cpf.decorator";

export class RegisterDto {
  @ApiProperty({
    description: "Nome completo do usuário",
    example: "João Silva",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "CPF do usuário",
    example: "123.456.789-00",
  })
  @IsNotEmpty()
  @IsCPF()
  cpf: string;

  @ApiProperty({
    description: "URL da foto de perfil",
    example: "https://example.com/photo.jpg",
  })
  @IsNotEmpty()
  @IsString()
  picture: string;

  @ApiProperty({
    description: "Email do usuário",
    example: "joao@email.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Telefone do usuário (opcional)",
    example: "(11) 99999-9999",
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: "Senha do usuário",
    example: "123456",
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsCPF } from "./cpf.decorator";

export class UpdateUserDto {
  @ApiProperty({
    description: "Nome completo do usuário",
    example: "João Silva",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: "CPF do usuário",
    example: "123.456.789-00",
    required: false,
  })
  @IsOptional()
  @IsCPF()
  cpf?: string;

  @ApiProperty({
    description: "Email do usuário",
    example: "joao@email.com",
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: "Telefone do usuário",
    example: "(11) 99999-9999",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}

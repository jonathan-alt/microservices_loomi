import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAccountDto {
  @ApiProperty({
    description: "ID do cliente",
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  client_id: number;

  @ApiProperty({
    description: "Saldo inicial da conta",
    example: 1000.0,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  value: number;

  @ApiProperty({
    description: "ID do histórico",
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  history_id: number;

  @ApiProperty({
    description: "Número da agência",
    example: "0001",
    minLength: 1,
    maxLength: 10,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 10)
  agency: string;

  @ApiProperty({
    description: "Número da conta",
    example: "123456-7",
    minLength: 1,
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  account_number: string;
}

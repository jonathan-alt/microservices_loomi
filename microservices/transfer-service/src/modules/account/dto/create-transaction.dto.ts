import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
} from "class-validator";

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  senderUserId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  receiverUserId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}

import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsPositive,
  IsOptional,
} from "class-validator";

export class CreateTransferDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  account_id: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  transfer_value: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  target_id_account: number;

  @IsOptional()
  @IsString()
  description?: string;
}

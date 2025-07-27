import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
  IsDateString,
} from "class-validator";

export class CreateHistoryDto {
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

  @IsNotEmpty()
  @IsDateString()
  timestamp: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  new_value: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  old_value: number;

  @IsNotEmpty()
  @IsString()
  type: string;
}

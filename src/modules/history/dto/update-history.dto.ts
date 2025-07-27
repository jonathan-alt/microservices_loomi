import {
  IsOptional,
  IsNumber,
  IsPositive,
  IsString,
  IsDateString,
} from "class-validator";

export class UpdateHistoryDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  account_id?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  transfer_value?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  target_id_account?: number;

  @IsOptional()
  @IsDateString()
  timestamp?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  new_value?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  old_value?: number;

  @IsOptional()
  @IsString()
  type?: string;
}

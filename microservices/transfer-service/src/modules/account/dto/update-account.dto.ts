import {
  IsOptional,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from "class-validator";

export class UpdateAccountDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  client_id?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  value?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  history_id?: number;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  agency?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  account_number?: string;
}

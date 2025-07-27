import { IsOptional, IsNumber, IsPositive } from "class-validator";

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
}
